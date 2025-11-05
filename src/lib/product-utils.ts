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

