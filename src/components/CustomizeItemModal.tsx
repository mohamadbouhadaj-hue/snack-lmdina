import { Check, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { EXTRA_OPTIONS, SAUCE_OPTIONS } from '../data/defaultMenu';
import { ItemCustomization, Product, SpiceLevel } from '../types/menu';
import { calculateExtrasPrice } from '../utils/whatsapp';
import { FoodImage } from './FoodImage';

interface CustomizeItemModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, customization: ItemCustomization) => void;
}

const SPICE_LEVELS: SpiceLevel[] = ['Sans piment', 'Normal', 'Piquant'];

export function CustomizeItemModal({
  product,
  onClose,
  onConfirm,
}: CustomizeItemModalProps) {
  const isDrinkOrDessert = product.category === 'Drinks & Desserts';
  const [quantity, setQuantity] = useState(1);
  const [sauce, setSauce] = useState(isDrinkOrDessert ? '' : SAUCE_OPTIONS[0]);
  const [spicy, setSpicy] = useState<SpiceLevel>('Normal');
  const [extras, setExtras] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const extrasCost = calculateExtrasPrice(extras);
  const lineTotal = (product.price + extrasCost) * quantity;

  const toggleExtra = (label: string) => {
    setExtras((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(product, quantity, {
      sauce,
      spicy,
      extras,
      note: note.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
    >
      <div className="w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-[#181614] border border-white/15 overflow-hidden shadow-2xl">
        <div className="sm:hidden w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#12100E]">
              <FoodImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2
                id="customize-modal-title"
                className="font-display text-lg font-bold text-[#F8F5F0] truncate"
              >
                {product.name}
              </h2>
              <p className="font-price text-sm font-semibold text-[#F59E0B]">
                {product.price} DH
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les options"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#221E1B] hover:bg-[#2C2723] text-[#D6CEC5] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {!isDrinkOrDessert && (
            <>
              <div>
                <p className="text-sm font-semibold text-[#F8F5F0] mb-2.5">
                  Choix de sauce
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SAUCE_OPTIONS.map((option) => {
                    const selected = sauce === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSauce(option)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#E12D24]/15 border border-[#E12D24] text-[#F8F5F0]'
                            : 'bg-[#211D1A] border border-white/8 text-[#C4BBB1] hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{option}</span>
                        {selected && <Check className="w-4 h-4 text-[#E12D24] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#F8F5F0] mb-2.5">
                  Niveau de piment
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SPICE_LEVELS.map((level) => {
                    const selected = spicy === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSpicy(level)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-center transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#F59E0B] text-[#0E0D0C] font-bold'
                            : 'bg-[#211D1A] border border-white/8 text-[#C4BBB1] hover:border-white/20'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#F8F5F0] mb-2.5">
                  Suppléments (optionnel)
                </p>
                <div className="space-y-2">
                  {EXTRA_OPTIONS.map((extra) => {
                    const active = extras.includes(extra.label);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() => toggleExtra(extra.label)}
                        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#F59E0B]/15 border border-[#F59E0B] text-[#F8F5F0]'
                            : 'bg-[#211D1A] border border-white/8 text-[#C4BBB1] hover:border-white/20'
                        }`}
                      >
                        <span>{extra.label}</span>
                        <span className="font-price text-xs font-bold text-[#F59E0B]">
                          +{extra.price} DH
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="item-custom-note"
              className="block text-sm font-semibold text-[#F8F5F0] mb-2"
            >
              Note cuisine (optionnel)
            </label>
            <input
              id="item-custom-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isDrinkOrDessert
                  ? 'Ex: Bien glacée, choix Coca / Sprite...'
                  : 'Ex: Sans oignons, bien grillé...'
              }
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center bg-[#211D1A] border border-white/10 rounded-xl overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F8F5F0] hover:bg-[#2C2723] cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-price text-sm font-bold px-3 text-[#F8F5F0]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Augmenter la quantité"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F8F5F0] hover:bg-[#2C2723] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              className="flex-1 min-h-[48px] px-5 py-2.5 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Ajouter</span>
              <span className="font-price">· {lineTotal} DH</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
