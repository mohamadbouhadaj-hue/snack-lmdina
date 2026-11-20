import { Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types/menu';
import { FoodImage } from './FoodImage';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onQuickAdd: (product: Product) => void;
  onDecrement: (productId: string) => void;
  onCustomize: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart,
  onQuickAdd,
  onDecrement,
  onCustomize,
}: ProductCardProps) {
  const isAvailable = product.inStock;

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className={`group flex flex-col rounded-2xl overflow-hidden bg-[#181614] border border-white/10 transition-transform duration-150 ${
        isAvailable ? 'hover:-translate-y-0.5 hover:border-white/20' : 'opacity-70'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#12100E]">
        <FoodImage
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isAvailable ? 'group-hover:scale-[1.03]' : 'grayscale'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181614]/85 via-transparent to-transparent pointer-events-none" />

        {!isAvailable && (
          <div className="absolute inset-0 bg-[#0E0D0C]/65 flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-lg bg-[#181614]/95 border border-white/15 text-xs font-bold tracking-wide text-[#F59E0B]">
              Épuisé
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-medium text-[#A89F95] mb-1 truncate">
          {product.category}
        </p>

        <h3 className="font-display text-base sm:text-lg font-bold text-[#F8F5F0] leading-snug mb-1.5">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-[#B5ACA2] leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-price text-lg font-bold text-[#F59E0B]">
              {product.price} DH
            </span>
          </div>

          {!isAvailable ? (
            <button
              type="button"
              disabled
              aria-label={`${product.name} est épuisé`}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#24201D] text-[#857C74] text-xs font-semibold cursor-not-allowed whitespace-nowrap shrink-0"
            >
              Épuisé
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onCustomize(product)}
                aria-label={`Personnaliser ${product.name}`}
                title="Sauces, suppléments & note"
                className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl bg-[#221E1B] hover:bg-[#2C2723] text-[#D6CEC5] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              </button>

              {quantityInCart === 0 ? (
                <button
                  type="button"
                  onClick={() => onQuickAdd(product)}
                  aria-label={`Ajouter ${product.name} au panier`}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Ajouter</span>
                </button>
              ) : (
                <div className="flex items-center bg-[#231F1C] border border-[#E12D24]/50 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onDecrement(product.id)}
                    aria-label={`Retirer un ${product.name}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F8F5F0] hover:bg-[#2E2925] transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    className="font-price text-sm font-bold text-[#F8F5F0] px-2 min-w-[28px] text-center"
                    aria-label={`Quantité de ${product.name}: ${quantityInCart}`}
                  >
                    {quantityInCart}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuickAdd(product)}
                    aria-label={`Ajouter un autre ${product.name}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-[#E12D24] hover:bg-[#C8231B] text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
