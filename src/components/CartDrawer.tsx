import {
  Check,
  Copy,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CartItem, OrderType, StoreSettings } from '../types/menu';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
} from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  settings: StoreSettings;
  onClose: () => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  settings,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [address, setAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [addressError, setAddressError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLPreElement>(null);

  const { itemCount, subtotal } = useMemo(() => calculateCartTotals(items), [items]);

  const message = useMemo(
    () =>
      buildWhatsAppOrderMessage({
        brandName: settings.brandName,
        items,
        orderType,
        address,
        customerPhone,
        orderNote,
        deliveryNote: settings.deliveryNote,
      }),
    [settings.brandName, settings.deliveryNote, items, orderType, address, customerPhone, orderNote]
  );

  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(settings.whatsappNumber, message),
    [settings.whatsappNumber, message]
  );

  if (!isOpen) return null;

  const isDeliveryMissingAddress = orderType === 'delivery' && address.trim().length === 0;

  const handleValidateBeforeOrder = () => {
    if (isDeliveryMissingAddress) {
      setAddressError('Veuillez saisir votre quartier ou adresse pour la livraison.');
      addressInputRef.current?.focus();
    }
  };

  const handleCopyMessage = async () => {
    if (isDeliveryMissingAddress) {
      handleValidateBeforeOrder();
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setShowPreview(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-none sm:h-full flex flex-col rounded-t-3xl sm:rounded-none bg-[#161412] border-t sm:border-t-0 sm:border-l border-white/15 shadow-2xl overflow-hidden">
        <div className="sm:hidden w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
            <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-[#F8F5F0]">
              Votre commande ({itemCount})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="min-h-[40px] px-2.5 rounded-lg text-xs font-medium text-[#A89F95] hover:text-[#E12D24] hover:bg-white/5 transition-colors cursor-pointer"
              >
                Vider
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le panier"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-[#221E1B] hover:bg-[#2C2723] text-[#F8F5F0] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#211D1A] flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-[#F59E0B]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#F8F5F0] mb-1">
              Votre panier est vide
            </h3>
            <p className="text-sm text-[#A89F95] max-w-xs mb-6">
              Ajoutez des tacos, burgers ou boissons depuis la carte pour envoyer votre commande sur WhatsApp.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-semibold cursor-pointer"
            >
              Parcourir le menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="space-y-3">
                {items.map((item) => {
                  const unitTotal = item.unitPrice + item.extrasPrice;
                  const lineTotal = unitTotal * item.quantity;
                  const customDetails = [
                    item.sauce ? `Sauce: ${item.sauce}` : null,
                    item.spicy && item.spicy !== 'Normal' ? item.spicy : null,
                    item.extras && item.extras.length > 0 ? item.extras.join(', ') : null,
                    item.note ? `Note: ${item.note}` : null,
                  ].filter(Boolean);

                  return (
                    <div
                      key={item.cartKey}
                      className="p-3.5 rounded-2xl bg-[#1E1B18] border border-white/8 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm sm:text-base font-bold text-[#F8F5F0] leading-snug">
                          {item.name}
                        </p>
                        {customDetails.length > 0 && (
                          <p className="text-xs text-[#A89F95] mt-1 leading-relaxed">
                            {customDetails.join(' · ')}
                          </p>
                        )}
                        <p className="font-price text-sm font-bold text-[#F59E0B] mt-1.5">
                          {lineTotal} DH
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center bg-[#141210] border border-white/10 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, -1)}
                            aria-label={`Diminuer ${item.name}`}
                            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#F8F5F0] hover:bg-[#272320] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-price text-xs font-bold px-2 text-[#F8F5F0]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, 1)}
                            aria-label={`Augmenter ${item.name}`}
                            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#F8F5F0] hover:bg-[#272320] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartKey)}
                          aria-label={`Supprimer ${item.name}`}
                          className="min-h-[40px] min-w-[40px] rounded-xl text-[#9E948A] hover:text-[#E12D24] hover:bg-white/5 flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#F8F5F0] mb-2">
                    Mode de réception
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOrderType('delivery');
                        setAddressError('');
                      }}
                      className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-[#E12D24] text-white'
                          : 'bg-[#1E1B18] border border-white/10 text-[#C4BBB1] hover:border-white/25'
                      }`}
                    >
                      <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">Livraison (توصيل)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOrderType('pickup');
                        setAddressError('');
                      }}
                      className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-[#E12D24] text-white'
                          : 'bg-[#1E1B18] border border-white/10 text-[#C4BBB1] hover:border-white/25'
                      }`}
                    >
                      <Store className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">Sur place / Emporter</span>
                    </button>
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="delivery-address"
                        className="block text-sm font-semibold text-[#F8F5F0] mb-1.5"
                      >
                        Quartier / Adresse (الحي / العنوان) <span className="text-[#E12D24]">*</span>
                      </label>
                      <input
                        ref={addressInputRef}
                        id="delivery-address"
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (addressError) setAddressError('');
                        }}
                        placeholder="Ex: Hay Al Massira, Rue 4, près de la pharmacie"
                        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none ${
                          addressError
                            ? 'border-[#E12D24] focus:border-[#E12D24]'
                            : 'border-white/12 focus:border-[#F59E0B]'
                        }`}
                      />
                      {addressError && (
                        <p className="text-xs text-[#FF6B63] mt-1.5 font-medium" role="alert">
                          {addressError}
                        </p>
                      )}
                    </div>

                    {settings.deliveryNote && (
                      <p className="text-xs text-[#B5ACA2] leading-relaxed">
                        {settings.deliveryNote}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="block text-xs font-medium text-[#B5ACA2] mb-1.5"
                    >
                      Téléphone (optionnel)
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="06..."
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-global-note"
                      className="block text-xs font-medium text-[#B5ACA2] mb-1.5"
                    >
                      Note commande (optionnel)
                    </label>
                    <input
                      id="order-global-note"
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Ex: Serviettes, sonnette..."
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#110F0E] border border-white/12 text-sm text-[#F8F5F0] placeholder-[#7C736B] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !showPreview;
                      setShowPreview(next);
                      if (next) {
                        window.setTimeout(() => {
                          previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 40);
                      }
                    }}
                    className="text-xs font-medium text-[#F59E0B] hover:underline cursor-pointer"
                  >
                    {showPreview
                      ? 'Masquer l’aperçu du message WhatsApp'
                      : 'Voir l’aperçu du message WhatsApp'}
                  </button>

                  {showPreview && (
                    <pre
                      ref={previewRef}
                      className="mt-2 p-3.5 rounded-xl bg-[#0E0D0C] border border-white/10 text-xs text-[#D6CEC5] whitespace-pre-wrap font-sans leading-relaxed"
                    >
                      {message}
                    </pre>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-[#141210] space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#B5ACA2]">Total estimé</span>
                <span className="font-price text-xl font-extrabold text-[#F59E0B]">
                  {subtotal} DH
                </span>
              </div>

              <p className="text-[11px] text-[#9E948A] leading-snug">
                La confirmation finale et les frais/délais de livraison sont confirmés sur WhatsApp par {settings.brandName}.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                {isDeliveryMissingAddress ? (
                  <button
                    type="button"
                    onClick={handleValidateBeforeOrder}
                    className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1FB857] text-[#09180D] text-sm font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    <span>Commander sur WhatsApp</span>
                  </button>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1FB857] text-[#09180D] text-sm font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    <span>Commander sur WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  aria-label="Copier le message de commande"
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-[#221E1B] hover:bg-[#2C2723] border border-white/10 text-[#F8F5F0] text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
