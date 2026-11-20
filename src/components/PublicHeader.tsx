import { ShoppingBag } from 'lucide-react';

interface PublicHeaderProps {
  brandName: string;
  itemCount: number;
  subtotal: number;
  onOpenCart: () => void;
}

export function PublicHeader({
  brandName,
  itemCount,
  subtotal,
  onOpenCart,
}: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-[#0E0D0C]/92 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
        <a
          href="#top"
          className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#F8F5F0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] rounded-md"
        >
          {brandName}
        </a>

        <p className="hidden md:block text-sm text-[#B8AFA6] whitespace-nowrap truncate">
          Ouvert <span aria-hidden="true">·</span> Commande rapide WhatsApp
        </p>

        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Ouvrir le panier (${itemCount} articles, ${subtotal} DH)`}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1D1A17] hover:bg-[#27221E] border border-white/10 text-[#F8F5F0] text-sm font-semibold flex items-center gap-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
        >
          <ShoppingBag className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
          <span>Panier</span>
          {itemCount > 0 && (
            <span className="font-price text-xs font-bold px-2 py-0.5 rounded-md bg-[#E12D24] text-white">
              {itemCount} · {subtotal} DH
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
