import { CategoryFilter, Product } from '../types/menu';

function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function filterProducts(
  products: Product[],
  category: CategoryFilter,
  searchQuery: string
): Product[] {
  const normalizedQuery = normalizeSearch(searchQuery);

  return products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;
    const haystack = normalizeSearch(`${product.name} ${product.description} ${product.category}`);
    return haystack.includes(normalizedQuery);
  });
}
