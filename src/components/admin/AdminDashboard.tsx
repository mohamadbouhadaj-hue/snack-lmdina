import {
  ArrowLeft,
  Check,
  Copy,
  Edit3,
  Lock,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Utensils,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Product, StoreSettings } from '../../types/menu';
import { filterProducts } from '../../utils/menuFilter';
import { formatMoroccanWhatsAppNumber } from '../../utils/whatsapp';
import { FoodImage } from '../FoodImage';
import { ProductFormModal } from './ProductFormModal';

interface AdminDashboardProps {
  products: Product[];
  settings: StoreSettings;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStock: (productId: string) => void;
  onResetDemoMenu: () => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onBackToMenu: () => void;
  onLockAdmin: () => void;
}

export function AdminDashboard({
  products,
  settings,
  onSaveProduct,
  onDeleteProduct,
  onToggleStock,
  onResetDemoMenu,
  onSaveSettings,
  onBackToMenu,
  onLockAdmin,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Settings form state
  const [brandName, setBrandName] = useState(settings.brandName);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [adminPin, setAdminPin] = useState(settings.adminPin);
  const [deliveryNote, setDeliveryNote] = useState(settings.deliveryNote);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const filteredProducts = useMemo(
    () => filterProducts(products, 'All', searchQuery),
    [products, searchQuery]
  );

  const inStockCount = useMemo(
    () => products.filter((p) => p.inStock).length,
    [products]
  );

  const privateAdminUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?admin=1`
      : '?admin=1';

  const handleCopyAdminLink = async () => {
    try {
      await navigator.clipboard.writeText(privateAdminUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setSettingsError('Le nom du snack est obligatoire.');
      return;
    }
    if (whatsappNumber.replace(/\D/g, '').length < 9) {
      setSettingsError('Numéro WhatsApp invalide (ex: 0717288651).');
      return;
    }
    if (!/^\d{4,6}$/.test(adminPin.trim())) {
      setSettingsError('Le code PIN doit contenir 4 à 6 chiffres.');
      return;
    }

    setSettingsError('');
    onSaveSettings({
      brandName: brandName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      adminPin: adminPin.trim(),
      deliveryNote: deliveryNote.trim(),
    });
    setSettingsSaved(true);
    window.setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#F8F5F0]">
      <header className="sticky top-0 z-30 bg-[#141210]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToMenu}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#221E1B] hover:bg-[#2C2723] text-xs sm:text-sm font-semibold text-[#F8F5F0] inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Menu public</span>
            </button>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-extrabold text-[#F8F5F0]">
                Admin · {settings.brandName}
              </h1>
              <p className="text-xs text-[#A89F95]">
                {products.length} plats <span aria-hidden="true">·</span> {inStockCount} disponibles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAdminLink}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#221E1B] hover:bg-[#2C2723] border border-white/10 text-xs sm:text-sm font-semibold text-[#F59E0B] inline-flex items-center gap-2 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
                  <span>Lien copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copier lien admin</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onLockAdmin}
              aria-label="Verrouiller l’espace admin"
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-[#1D1A17] hover:bg-[#292420] border border-white/10 text-xs font-semibold text-[#C4BBB1] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Verrouiller</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#E12D24] text-white'
                : 'bg-[#181614] text-[#B5ACA2] hover:text-[#F8F5F0]'
            }`}
          >
            <Utensils className="w-4 h-4" aria-hidden="true" />
            <span>Produits ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#E12D24] text-white'
                : 'bg-[#181614] text-[#B5ACA2] hover:text-[#F8F5F0]'
            }`}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span>Paramètres du snack</span>
          </button>
        </div>

        {activeTab === 'products' ? (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="w-4 h-4 text-[#8A8178] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrer les plats..."
                  aria-label="Filtrer les plats dans l'administration"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#181614] border border-white/10 text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {confirmReset ? (
                  <div className="flex items-center gap-2 bg-[#181614] border border-[#F59E0B]/40 rounded-xl p-1">
                    <span className="text-xs text-[#F59E0B] px-2 font-medium">
                      Restaurer les 20 plats ?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onResetDemoMenu();
                        setConfirmReset(false);
                      }}
                      className="min-h-[36px] px-3 rounded-lg bg-[#E12D24] text-white text-xs font-bold cursor-pointer"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="min-h-[36px] px-2.5 rounded-lg bg-[#221E1B] text-[#C4BBB1] text-xs font-medium cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#181614] hover:bg-[#221E1B] border border-white/10 text-xs sm:text-sm font-semibold text-[#C4BBB1] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Réinitialiser menu démo</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Nouveau produit</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#181614] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-20 h-15 rounded-xl overflow-hidden bg-[#110F0E] shrink-0">
                      <FoodImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#9E948A]">{product.category}</p>
                      <h3 className="font-display text-base font-bold text-[#F8F5F0] truncate">
                        {product.name}
                      </h3>
                      <p className="font-price text-sm font-bold text-[#F59E0B]">
                        {product.price} DH
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleStock(product.id)}
                      aria-label={`Changer disponibilité de ${product.name}`}
                      className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors duration-75 cursor-pointer ${
                        product.inStock
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-500/20 border-red-500/50 text-red-200'
                      }`}
                    >
                      {product.inStock ? 'En stock' : 'Épuisé'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      aria-label={`Modifier ${product.name}`}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#221E1B] hover:bg-[#2D2824] text-xs font-semibold text-[#F8F5F0] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Modifier</span>
                    </button>

                    {confirmDeleteId === product.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteProduct(product.id);
                            setConfirmDeleteId(null);
                          }}
                          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#E12D24] text-white text-xs font-bold cursor-pointer"
                        >
                          Supprimer
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-[#221E1B] text-[#C4BBB1] text-xs cursor-pointer"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(product.id)}
                        aria-label={`Supprimer ${product.name}`}
                        className="min-h-[40px] min-w-[40px] rounded-xl bg-[#221E1B] hover:bg-[#E12D24]/20 text-[#9E948A] hover:text-[#FF857E] flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="p-8 rounded-2xl bg-[#181614] border border-white/10 text-center text-sm text-[#A89F95]">
                  Aucun produit trouvé pour cette recherche.
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="max-w-xl">
            <form
              onSubmit={handleSaveSettingsSubmit}
              className="rounded-2xl bg-[#181614] border border-white/10 p-5 sm:p-6 space-y-4"
            >
              <h2 className="font-display text-lg font-bold text-[#F8F5F0]">
                Configuration de la boutique
              </h2>

              {settingsError && (
                <p
                  className="p-3 rounded-xl bg-[#E12D24]/15 border border-[#E12D24]/40 text-xs font-medium text-[#FF857E]"
                  role="alert"
                >
                  {settingsError}
                </p>
              )}

              {settingsSaved && (
                <p
                  className="p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-xs font-medium text-[#68EB98]"
                  role="status"
                >
                  Paramètres enregistrés avec succès.
                </p>
              )}

              <div>
                <label
                  htmlFor="set-brand-name"
                  className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
                >
                  Nom du snack
                </label>
                <input
                  id="set-brand-name"
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label
                  htmlFor="set-whatsapp"
                  className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
                >
                  Numéro WhatsApp (format local ou international)
                </label>
                <input
                  id="set-whatsapp"
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm font-price text-[#F8F5F0] focus:outline-none focus:border-[#F59E0B]"
                />
                <p className="text-[11px] text-[#9E948A] mt-1">
                  Lien généré : https://wa.me/{formatMoroccanWhatsAppNumber(whatsappNumber)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="set-pin"
                  className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
                >
                  Code PIN Admin (4 à 6 chiffres)
                </label>
                <input
                  id="set-pin"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm font-price text-[#F8F5F0] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label
                  htmlFor="set-delivery-note"
                  className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
                >
                  Note de livraison par défaut
                </label>
                <textarea
                  id="set-delivery-note"
                  rows={2}
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <button
                type="submit"
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-bold cursor-pointer"
              >
                Enregistrer les paramètres
              </button>
            </form>
          </section>
        )}
      </main>

      {editingProduct !== undefined && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => setEditingProduct(undefined)}
          onSave={(saved) => {
            onSaveProduct(saved);
            setEditingProduct(undefined);
          }}
        />
      )}
    </div>
  );
}
