import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('WARNING: Supabase URL or Key not set in backend/.env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Maps a database product record to the frontend camelCase structure.
 * @param {object} p - Database product record.
 * @returns {object} CamelCase product.
 */
export function mapProductFromDb(p) {
  if (!p) return null;
  return {
    id: p.id,
    nome: p.nome,
    precoUnidade: p.preco_unidade === null ? undefined : (isNaN(Number(p.preco_unidade)) ? p.preco_unidade : Number(p.preco_unidade)),
    precoUnidade5: p.preco_unidade_5 ? Number(p.preco_unidade_5) : undefined,
    precoUnidade50: p.preco_unidade_50 ? Number(p.preco_unidade_50) : undefined,
    categoria: p.categoria,
    descricao: p.descricao,
    imagem: p.imagem,
    imagensExtras: p.imagens_extras || [],
    data: p.data,
    ativo: p.ativo !== false,
    destaque: !!p.destaque,
    promocao: !!p.promocao,
    novo: !!p.novo,
    maisVendido: !!p.mais_vendido,
    mensagemCustomizada: p.mensagem_customizada
  };
}

/**
 * Maps a camelCase frontend product to the snake_case database structure.
 * @param {object} p - Frontend product object.
 * @returns {object} Snake_case product.
 */
export function mapProductToDb(p) {
  if (!p) return null;
  const dbProd = {};
  if (p.id !== undefined) dbProd.id = p.id;
  if (p.nome !== undefined) dbProd.nome = p.nome;
  if (p.categoria !== undefined) dbProd.categoria = p.categoria;
  if (p.descricao !== undefined) dbProd.descricao = p.descricao;
  if (p.precoUnidade !== undefined) dbProd.preco_unidade = p.precoUnidade === null ? null : String(p.precoUnidade);
  if (p.precoUnidade5 !== undefined) dbProd.preco_unidade_5 = p.precoUnidade5 === "" || p.precoUnidade5 === null ? null : Number(p.precoUnidade5);
  if (p.precoUnidade50 !== undefined) dbProd.preco_unidade_50 = p.precoUnidade50 === "" || p.precoUnidade50 === null ? null : Number(p.precoUnidade50);
  if (p.imagem !== undefined) dbProd.imagem = p.imagem;
  if (p.imagensExtras !== undefined) dbProd.imagens_extras = p.imagensExtras;
  if (p.data !== undefined) dbProd.data = p.data;
  if (p.ativo !== undefined) dbProd.ativo = !!p.ativo;
  if (p.destaque !== undefined) dbProd.destaque = !!p.destaque;
  if (p.promocao !== undefined) dbProd.promocao = !!p.promocao;
  if (p.novo !== undefined) dbProd.novo = !!p.novo;
  if (p.maisVendido !== undefined) dbProd.mais_vendido = !!p.maisVendido;
  if (p.mensagemCustomizada !== undefined) dbProd.mensagem_customizada = p.mensagemCustomizada;
  return dbProd;
}

/**
 * Fetches all products, categories and configurations to assemble a complete store snapshot.
 * @returns {Promise<object>} The database snapshot.
 */
export async function getFullDbSnapshot() {
  // 1. Fetch products
  const { data: prods, error: prodErr } = await supabase
    .from('produtos')
    .select('*');
  if (prodErr) throw prodErr;

  // 2. Fetch categories ordered by order (ordem)
  const { data: cats, error: catErr } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem', { ascending: true });
  if (catErr) throw catErr;

  // 3. Fetch configurations
  const { data: configs, error: confErr } = await supabase
    .from('configuracoes')
    .select('*');
  if (confErr) throw confErr;

  const mappedProducts = (prods || []).map(mapProductFromDb);

  // Sort products by ID ascending in natural sequence (KF001, KF002, KF003...)
  mappedProducts.sort((a, b) => {
    if (!a.id) return 1;
    if (!b.id) return -1;
    return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
  });

  const mappedConfigs = {};
  (configs || []).forEach(c => {
    if (c.key !== 'auth') {
      mappedConfigs[c.key] = c.value;
    }
  });

  return {
    produtos: mappedProducts,
    categorias: cats || [],
    configuracoes: mappedConfigs.configuracoes || {},
    hero: mappedConfigs.hero || {},
    seo: mappedConfigs.seo || {},
    tema: mappedConfigs.tema || {}
  };
}

export default {
  supabase,
  mapProductFromDb,
  mapProductToDb,
  getFullDbSnapshot
};
