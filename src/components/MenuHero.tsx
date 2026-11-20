import { ArrowDown, Clock, MapPin } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../data/defaultMenu';
import { FoodImage } from './FoodImage';

interface MenuHeroProps {
  brandName: string;
  productCount: number;
}

export function MenuHero({ brandName, productCount }: MenuHeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-[#141210]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs sm:text-sm font-medium text-[#F59E0B] mb-2">
              Ouvert maintenant <span aria-hidden="true">·</span> Commande rapide WhatsApp
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8F5F0] leading-[1.1] text-balance mb-3">
              Tacos gratinés &amp; smash burgers préparés à la minute.
            </h1>
            <p className="text-sm sm:text-base text-[#C4BBB1] max-w-xl leading-relaxed mb-5">
              Composez votre commande {brandName} en quelques clics et envoyez-la
              directement sur WhatsApp pour livraison ou retrait sur place.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#menu-grid"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
              >
                <span>Voir la carte ({productCount})</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </a>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-[#A89F95]">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  25–35 min
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <MapPin className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  Livraison &amp; À emporter
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[190px] sm:min-h-[240px] rounded-2xl overflow-hidden border border-white/10 bg-[#1B1816]">
              <FoodImage
                src={HERO_BANNER_IMAGE}
                alt={`Assortiment signature ${brandName} : Tacos gratiné, Smash Burger, Frites Cheddar et Mojito`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#F8F5F0]/90 font-medium">
                <span>Menu du jour</span>
                <span className="font-price text-[#F59E0B] font-bold">À partir de 10 DH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
