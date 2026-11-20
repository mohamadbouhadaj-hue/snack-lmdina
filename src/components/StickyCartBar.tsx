import { ArrowRight, ShoppingBag } from 'lucide-react';

interface StickyCartBarProps {
  itemCount: number;
  subtotal: number;
  onOpenCart: () => void;
}

export function StickyCartBar({
  itemCount,
  subtotal,
  onOpenCart,
}: StickyCartBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-[#0E0D0C] via-[#0E0D0C]/95 to-transparent pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Voir le panier et commander (${itemCount} articles, ${subtotal} DH)`}
          className="w-full min-h-[52px] px-4 sm:px-5 py-2.5 rounded-2xl bg-[#E12D24] hover:bg-[#C8231B] active:scale-[0.99] text-white shadow-xl shadow-black/50 flex items-center justify-between gap-3 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-black/25 flex items-center justify-center font-price text-sm font-bold">
              {itemCount}
            </span>
            <div className="text-left">
              <span className="block text-sm font-bold leading-tight">
                Voir le panier &amp; Commander
              </span>
              <span className="block text-xs text-white/85">
                Envoi rapide sur WhatsApp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-price text-base font-extrabold">{subtotal} DH</span>
            <ShoppingBag className="w-4 h-4 hidden sm:block" aria-hidden="true" />
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </div>
        </button>
      </div>
    </div>
  );
}
