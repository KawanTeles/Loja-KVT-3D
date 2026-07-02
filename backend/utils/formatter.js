/**
 * Formatting utility to serialize data to file contents.
 */

/**
 * Formats database object into the public frontend dados_loja.js content.
 * @param {object} data - The full database snapshot.
 * @returns {string} The javascript string to be loaded by index.html.
 */
export function formatDadosLoja(data) {
  return `// DADOS DINÂMICOS DA LOJA - GERADO PELO PAINEL ADMINISTRATIVO\nwindow.DADOS_LOJA = ${JSON.stringify(data, null, 2)};\n`;
}

/**
 * Formats database object to pretty-printed JSON.
 * @param {object} data - The full database snapshot.
 * @returns {string} The formatted JSON string.
 */
export function formatDbJson(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Updates the hardcoded PRODUTOS array inside script.js using static markers.
 * @param {string} scriptContent - Current contents of js/script.js.
 * @param {Array<object>} products - The updated list of products.
 * @returns {string} The modified script.js content.
 */
export function updateScriptJsProducts(scriptContent, products) {
  const startMarker = 'const PRODUTOS = [';
  const endMarker = '// 2. INICIALIZAÇÃO E INTEGRAÇÃO DO PAINEL';
  
  const startIndex = scriptContent.indexOf(startMarker);
  const endIndex = scriptContent.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Could not find PRODUTOS or INICIALIZAÇÃO markers in script.js');
  }
  
  // Format products array similarly to original file structure
  const formattedProducts = `const PRODUTOS = ${JSON.stringify(products, null, 4)};\n\n\n\n`;
  
  return scriptContent.substring(0, startIndex) + formattedProducts + scriptContent.substring(endIndex);
}
