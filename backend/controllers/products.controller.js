import { supabase, mapProductFromDb, mapProductToDb } from '../services/supabase.service.js';
import { triggerSync } from '../services/sync.service.js';
import { validateProduct } from '../utils/validator.js';
import logger from '../services/logger.service.js';

// Helper to calculate next product ID (KFxxx)
async function getNextProductId() {
  const { data: allProds, error } = await supabase.from('produtos').select('id');
  if (error) throw error;
  
  let maxNum = 0;
  (allProds || []).forEach(p => {
    if (p.id && p.id.startsWith('KF')) {
      const num = parseInt(p.id.substring(2));
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });
  return 'KF' + String(maxNum + 1).padStart(3, '0');
}

export async function getAllProducts(req, res) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');
    
    if (error) throw error;
    
    const mapped = (data || []).map(mapProductFromDb);
    res.json(mapped);
  } catch (err) {
    logger.error('Failed to get products', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export async function createProduct(req, res) {
  try {
    const body = req.body;
    const validationError = validateProduct(body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const nextId = body.id || await getNextProductId();
    
    const payload = mapProductToDb({
      ...body,
      id: nextId,
      data: body.data || new Date().toISOString().split('T')[0]
    });

    const { data, error } = await supabase
      .from('produtos')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    const newProduct = mapProductFromDb(data);

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Produto ${nextId} adicionado automaticamente pelo painel administrativo`,
      admin,
      `Criar Produto ${nextId} - ${body.nome}`
    ).catch(e => logger.error('Sync failed after product creation', e));

    res.status(201).json(newProduct);
  } catch (err) {
    logger.error('Failed to create product', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const payload = mapProductToDb(body);

    const { data, error } = await supabase
      .from('produtos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      throw error;
    }

    const updatedProduct = mapProductFromDb(data);

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Produto ${id} atualizado automaticamente pelo painel administrativo`,
      admin,
      `Atualizar Produto ${id} - ${updatedProduct.nome}`
    ).catch(e => logger.error('Sync failed after product update', e));

    res.json(updatedProduct);
  } catch (err) {
    logger.error(`Failed to update product ${req.params.id}`, err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Produto ${id} excluído automaticamente pelo painel administrativo`,
      admin,
      `Excluir Produto ${id}`
    ).catch(e => logger.error('Sync failed after product deletion', e));

    res.json({ success: true, message: `Produto ${id} excluído com sucesso.` });
  } catch (err) {
    logger.error(`Failed to delete product ${req.params.id}`, err);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
}

export async function duplicateProduct(req, res) {
  try {
    const { id } = req.params;

    const { data: original, error: fetchErr } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !original) {
      return res.status(404).json({ error: 'Produto original não encontrado' });
    }

    const nextId = await getNextProductId();
    const duplicatedPayload = {
      ...original,
      id: nextId,
      nome: `${original.nome} - Cópia`,
      data: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('produtos')
      .insert([duplicatedPayload])
      .select()
      .single();

    if (error) throw error;

    const duplicatedProduct = mapProductFromDb(data);

    // Trigger async sync to GitHub
    const admin = req.headers['x-admin-name'] || 'Admin';
    triggerSync(
      `Produto ${id} duplicado automaticamente como ${nextId} pelo painel administrativo`,
      admin,
      `Duplicar Produto ${id} para ${nextId}`
    ).catch(e => logger.error('Sync failed after product duplication', e));

    res.status(201).json(duplicatedProduct);
  } catch (err) {
    logger.error(`Failed to duplicate product ${req.params.id}`, err);
    res.status(500).json({ error: 'Erro ao duplicar produto' });
  }
}

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct
};
