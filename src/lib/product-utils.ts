// Função auxiliar para formatar preço de número para string brasileira
export function formatPrice(price: number | string | null | undefined): string {
  if (!price) return "R$ 0,00";
  
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numPrice);
}

// Extrair categoria do nome do produto (primeira palavra)
export function extractCategoryFromName(name: string): string {
  const firstWord = name.split(' ')[0];
  // Capitalizar primeira letra
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

// Normalizar texto (remover acentos e converter para minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Gerar variações de busca (singular/plural e variações comuns)
function generateSearchVariations(term: string): string[] {
  const normalized = normalizeText(term);
  const variations = [normalized];
  
  // Remover 's' final para buscar singular
  if (normalized.endsWith('s') && normalized.length > 1) {
    variations.push(normalized.slice(0, -1));
  }
  
  // Adicionar 's' para buscar plural
  if (!normalized.endsWith('s')) {
    variations.push(normalized + 's');
  }
  
  // Variações comuns
  const commonVariations: Record<string, string[]> = {
    'sela': ['selas', 'sela'],
    'selas': ['sela', 'selas'],
    'arreio': ['arreios', 'arreio'],
    'arreios': ['arreio', 'arreios'],
    'bota': ['botas', 'bota'],
    'botas': ['bota', 'botas'],
    'peitoral': ['peitorais', 'peitoral'],
    'peitorais': ['peitoral', 'peitorais'],
    'espora': ['esporas', 'espora'],
    'esporas': ['espora', 'esporas'],
    'cabecada': ['cabeçadas', 'cabeçada'],
    'cabeçada': ['cabecadas', 'cabecada'],
    'cabresto': ['cabrestos', 'cabresto'],
    'cabrestos': ['cabresto', 'cabrestos'],
    'luva': ['luvas', 'luva'],
    'luvas': ['luva', 'luvas'],
    'capacete': ['capacetes', 'capacete'],
    'capacetes': ['capacete', 'capacetes'],
    'redea': ['rédeas', 'rédea'],
    'rédea': ['redeas', 'redea'],
    'reideas': ['rédea', 'redea'],
    'rédeas': ['redea', 'redea'],
  };
  
  if (commonVariations[normalized]) {
    variations.push(...commonVariations[normalized]);
  }
  
  return [...new Set(variations)]; // Remove duplicatas
}

// Função de busca inteligente que entende variações
export function smartProductSearch(product: any, searchTerm: string): boolean {
  if (!searchTerm.trim()) return true;
  
  const searchVariations = generateSearchVariations(searchTerm);
  const normalizedSearch = normalizeText(searchTerm);
  
  // Normalizar campos do produto
  const productName = normalizeText(product.name || '');
  const productDescription = normalizeText(product.description || '');
  const productCategory = normalizeText(product.category || '');
  const extractedCategory = normalizeText(extractCategoryFromName(product.name));
  
  // Buscar em todos os campos com todas as variações
  for (const variation of searchVariations) {
    const normalizedVariation = normalizeText(variation);
    
    // Busca exata ou parcial no nome
    if (productName.includes(normalizedVariation) || normalizedVariation.includes(productName.split(' ')[0])) {
      return true;
    }
    
    // Busca na descrição
    if (productDescription.includes(normalizedVariation)) {
      return true;
    }
    
    // Busca na categoria
    if (productCategory.includes(normalizedVariation) || extractedCategory.includes(normalizedVariation)) {
      return true;
    }
    
    // Busca por palavras individuais (divide o termo de busca)
    const searchWords = normalizedVariation.split(/\s+/);
    for (const word of searchWords) {
      if (word.length > 2) { // Ignorar palavras muito curtas
        if (productName.includes(word) || productDescription.includes(word) || 
            productCategory.includes(word) || extractedCategory.includes(word)) {
          return true;
        }
      }
    }
  }
  
  // Busca também por palavras do nome do produto no termo de busca
  const productWords = productName.split(/\s+/);
  for (const word of productWords) {
    if (word.length > 2 && normalizedSearch.includes(word)) {
      return true;
    }
  }
  
  return false;
}

// Converter produto do banco para formato esperado pelos componentes
export function formatProductForCarousel(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    price: formatPrice(product.price),
    originalPrice: product.originalPrice ? formatPrice(product.originalPrice) : undefined,
    category: product.category,
    rating: product.rating,
  };
}

export function formatProductForGrid(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description, // Incluir descrição
    price: formatPrice(product.price),
    originalPrice: product.originalPrice ? formatPrice(product.originalPrice) : undefined,
    image: product.image,
    rating: product.rating,
    category: product.category || extractCategoryFromName(product.name), // Usar categoria do produto ou extrair do nome
  };
}

