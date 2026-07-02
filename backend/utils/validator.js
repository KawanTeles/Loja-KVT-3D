/**
 * Validation utility to assert data integrity before database inserts or github sync.
 */

/**
 * Validates product payload.
 * @param {object} product - Product to validate.
 * @returns {string|null} Error message or null if valid.
 */
export function validateProduct(product) {
  if (!product) return 'Product payload is missing';
  if (!product.nome || typeof product.nome !== 'string' || !product.nome.trim()) {
    return 'Nome do produto é obrigatório';
  }
  if (!product.categoria || typeof product.categoria !== 'string' || !product.categoria.trim()) {
    return 'Categoria do produto é obrigatória';
  }
  return null;
}

/**
 * Validates category payload.
 * @param {object} category - Category to validate.
 * @returns {string|null} Error message or null if valid.
 */
export function validateCategory(category) {
  if (!category) return 'Category payload is missing';
  if (!category.nome || typeof category.nome !== 'string' || !category.nome.trim()) {
    return 'Nome da categoria é obrigatório';
  }
  if (!category.slug || typeof category.slug !== 'string' || !category.slug.trim()) {
    return 'Slug da categoria é obrigatório';
  }
  return null;
}
