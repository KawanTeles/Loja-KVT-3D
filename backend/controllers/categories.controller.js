import { supabase } from '../services/supabase.service.js';
import { triggerSync } from '../services/sync.service.js';
import { validateCategory } from '../utils/validator.js';
import logger from '../services/logger.service.js';

export async function getAllCategories(req, res) {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    logger.error('Failed to get categories', err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}

export async function createCategory(req, res) {
  try {
    const body = req.body;
    const validationError = validateCategory(body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const payload = {
      slug: body.slug.toLowerCase().trim(),
      nome: body.nome.trim(),
      ativa: body.ativa !== false,
      ordem: Number(body.ordem) || 0
    };

    const { data, error } = await supabase
      .from('categorias')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Categoria '${payload.slug}' criada automaticamente pelo painel administrativo`,
      admin,
      `Criar Categoria - ${payload.nome}`
    ).catch(e => logger.error('Sync failed after category creation', e));

    res.status(201).json(data);
  } catch (err) {
    logger.error('Failed to create category', err);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
}

export async function updateCategory(req, res) {
  try {
    const { slug } = req.params;
    const body = req.body;

    const payload = {
      nome: body.nome ? body.nome.trim() : undefined,
      ativa: body.ativa !== undefined ? !!body.ativa : undefined,
      ordem: body.ordem !== undefined ? Number(body.ordem) : undefined
    };

    const newSlug = body.slug ? body.slug.toLowerCase().trim() : null;
    if (newSlug && newSlug !== slug) {
      payload.slug = newSlug;

      // If the slug changed, update all products belonging to the old category slug first
      const { error: prodUpdateErr } = await supabase
        .from('produtos')
        .update({ categoria: newSlug })
        .eq('categoria', slug);
        
      if (prodUpdateErr) {
        logger.warn(`Failed to update products belonging to category slug ${slug} to ${newSlug}: ${prodUpdateErr.message}`);
      }
    }

    // Filter undefined fields to avoid overwriting them
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const { data, error } = await supabase
      .from('categorias')
      .update(payload)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      throw error;
    }

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Categoria '${slug}' atualizada automaticamente pelo painel administrativo`,
      admin,
      `Atualizar Categoria '${slug}'`
    ).catch(e => logger.error('Sync failed after category update', e));

    res.json(data);
  } catch (err) {
    logger.error(`Failed to update category ${req.params.slug}`, err);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { slug } = req.params;

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Categoria '${slug}' excluída automaticamente pelo painel administrativo`,
      admin,
      `Excluir Categoria '${slug}'`
    ).catch(e => logger.error('Sync failed after category deletion', e));

    res.json({ success: true, message: `Categoria '${slug}' excluída com sucesso.` });
  } catch (err) {
    logger.error(`Failed to delete category ${req.params.slug}`, err);
    res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
}

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
