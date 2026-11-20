import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { MENU_CATEGORIES, PRESET_FOOD_IMAGES } from '../../data/defaultMenu';
import { MenuCategory, Product } from '../../types/menu';
import { FoodImage } from '../FoodImage';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductFormModal({
  initialProduct,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? '');
  const [category, setCategory] = useState<MenuCategory>(
    initialProduct?.category ?? 'Tacos & Wraps'
  );
  const [price, setPrice] = useState(
    initialProduct ? String(initialProduct.price) : ''
  );
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [image, setImage] = useState(
    initialProduct?.image ?? PRESET_FOOD_IMAGES[0].url
  );
  const [inStock, setInStock] = useState(initialProduct?.inStock ?? true);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const numericPrice = Number(price);

    if (!trimmedName) {
      setError('Le nom du produit est obligatoire.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('Veuillez saisir un prix valide en DH (> 0).');
      return;
    }

    const id =
      initialProduct?.id ||
      `${trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

    onSave({
      id,
      name: trimmedName,
      category,
      price: Math.round(numericPrice),
      description:
        description.trim() || 'Préparé à la minute avec nos ingrédients maison.',
      image: image.trim() || PRESET_FOOD_IMAGES[0].url,
      inStock,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div className="w-full sm:max-w-xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-[#181614] border border-white/15 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 id="product-form-title" className="font-display text-lg font-bold text-[#F8F5F0]">
            {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le formulaire"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#221E1B] hover:bg-[#2C2723] text-[#D6CEC5] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div
              className="p-3 rounded-xl bg-[#E12D24]/15 border border-[#E12D24]/40 text-xs font-medium text-[#FF857E]"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="prod-name"
                className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
              >
                Nom du plat *
              </label>
              <input
                id="prod-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ex: Tacos Royal Spécial"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label
                htmlFor="prod-price"
                className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
              >
                Prix (DH) *
              </label>
              <input
                id="prod-price"
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (error) setError('');
                }}
                placeholder="45"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm font-price text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <label
                htmlFor="prod-category"
                className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
              >
                Catégorie
              </label>
              <select
                id="prod-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategory)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#F59E0B]"
              >
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setInStock((prev) => !prev)}
              aria-pressed={inStock}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                inStock
                  ? 'bg-[#25D366]/15 border-[#25D366]/50 text-[#68EB98]'
                  : 'bg-[#E12D24]/15 border-[#E12D24]/50 text-[#FF857E]'
              }`}
            >
              {inStock ? 'Statut : En stock (Disponible)' : 'Statut : Épuisé (Indisponible)'}
            </button>
          </div>

          <div>
            <label
              htmlFor="prod-desc"
              className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
            >
              Description appétissante
            </label>
            <textarea
              id="prod-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingrédients, sauce maison, accompagnement..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="prod-image-url"
                className="text-xs font-semibold text-[#D6CEC5]"
              >
                Photo du plat (URL, fichier local ou visuel studio)
              </label>
              <label className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#221E1B] hover:bg-[#2C2723] text-xs font-semibold text-[#F59E0B] inline-flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Importer image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-20 h-15 rounded-xl overflow-hidden bg-[#110F0E] border border-white/10 shrink-0">
                <FoodImage src={image} alt={name || 'Aperçu'} className="w-full h-full object-cover" />
              </div>
              <input
                id="prod-image-url"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... ou sélectionnez ci-dessous"
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-xs text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <p className="text-[11px] text-[#9E948A] mb-2 inline-flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Visuels rapides prêts à l’emploi :</span>
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_FOOD_IMAGES.map((preset) => {
                  const active = image === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      title={preset.label}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        active ? 'border-[#F59E0B]' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#221E1B] hover:bg-[#2C2723] text-sm font-semibold text-[#D6CEC5] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-bold cursor-pointer"
            >
              {isEditing ? 'Enregistrer' : 'Ajouter au menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
