import { Search, X } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/defaultMenu';
import { CategoryFilter } from '../types/menu';

interface CategoryFilterBarProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

const CATEGORY_TABS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'All', label: 'Tous' },
  ...MENU_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
];

export function CategoryFilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  resultCount,
}: CategoryFilterBarProps) {
  return (
    <div className="lg:sticky lg:top-16 z-20 bg-[#0E0D0C]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[#9E948A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="menu-search" className="sr-only">
              Rechercher un plat dans le menu
            </label>
            <input
              id="menu-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher tacos, smash burger, panini..."
              className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-xl bg-[#181614] border border-white/10 text-sm text-[#F8F5F0] placeholder-[#8A8178] focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Effacer la recherche"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#9E948A] hover:text-[#F8F5F0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-xs text-[#9E948A] font-price hidden sm:block">
            {resultCount} plat{resultCount > 1 ? 's' : ''} affiché{resultCount > 1 ? 's' : ''}
          </p>
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
          role="tablist"
          aria-label="Filtrer par catégorie"
        >
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectCategory(tab.value)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] ${
                  active
                    ? 'bg-[#E12D24] text-white'
                    : 'bg-[#181614] text-[#C4BBB1] hover:bg-[#231F1C] hover:text-[#F8F5F0] border border-white/8'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
