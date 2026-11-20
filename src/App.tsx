import { UtensilsCrossed } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { CustomizeItemModal } from './components/CustomizeItemModal';
import { MenuHero } from './components/MenuHero';
import { ProductCard } from './components/ProductCard';
import { PublicHeader } from './components/PublicHeader';
import { StickyCartBar } from './components/StickyCartBar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPinGate } from './components/admin/AdminPinGate';
import {
  CartItem,
  CategoryFilter,
  ItemCustomization,
  Product,
  StoreSettings,
} from './types/menu';
import { filterProducts } from './utils/menuFilter';
import {
  isAdminRoute,
  loadProducts,
  loadStoreSettings,
  resetProductsToDemo,
  saveProducts,
  saveStoreSettings,
} from './utils/storage';
import {
  buildCartItemKey,
  calculateCartTotals,
  calculateExtrasPrice,
} from './utils/whatsapp';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [settings, setSettings] = useState<StoreSettings>(() => loadStoreSettings());
  const [isAdminView, setIsAdminView] = useState<boolean>(() =>
    isAdminRoute(window.location.search, window.location.hash)
  );
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Public Menu state
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const syncRoute = () => {
      setIsAdminView(isAdminRoute(window.location.search, window.location.hash));
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const navigateToPublicMenu = () => {
    const cleanUrl = window.location.pathname;
    window.history.pushState({}, '', cleanUrl);
    setIsAdminView(false);
  };

  // Menu filtering & totals
  const visibleProducts = useMemo(
    () => filterProducts(products, selectedCategory, searchQuery),
    [products, selectedCategory, searchQuery]
  );

  const { itemCount, subtotal } = useMemo(() => calculateCartTotals(cart), [cart]);

  const productQuantityMap = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of cart) {
      counts.set(item.productId, (counts.get(item.productId) || 0) + item.quantity);
    }
    return counts;
  }, [cart]);

  // Cart handlers
  const handleQuickAdd = (product: Product) => {
    if (!product.inStock) return;
    const cartKey = buildCartItemKey(product.id);
    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          cartKey,
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          extrasPrice: 0,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  const handleDecrementProduct = (productId: string) => {
    setCart((prev) => {
      let index = -1;
      for (let i = prev.length - 1; i >= 0; i -= 1) {
        if (prev[i].productId === productId) {
          index = i;
          break;
        }
      }
      if (index === -1) return prev;
      const target = prev[index];
      if (target.quantity <= 1) {
        return prev.filter((_, idx) => idx !== index);
      }
      return prev.map((item, idx) =>
        idx === index ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleConfirmCustomized = (
    product: Product,
    quantity: number,
    customization: ItemCustomization
  ) => {
    const extrasPrice = calculateExtrasPrice(customization.extras);
    const cartKey = buildCartItemKey(
      product.id,
      customization.sauce,
      customization.spicy,
      customization.extras,
      customization.note
    );

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartKey,
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          extrasPrice,
          quantity,
          image: product.image,
          sauce: customization.sauce || undefined,
          spicy: customization.spicy,
          extras: customization.extras,
          note: customization.note || undefined,
        },
      ];
    });
    setCustomizingProduct(null);
  };

  const handleUpdateCartQuantity = (cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartKey: string) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  // Admin handlers
  const handleSaveProduct = (saved: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
      saveProducts(next);
      return next;
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveProducts(next);
      return next;
    });
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) => {
      const next = prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      );
      saveProducts(next);
      return next;
    });
  };

  const handleResetDemoMenu = () => {
    const restored = resetProductsToDemo();
    setProducts(restored);
  };

  const handleSaveSettings = (nextSettings: StoreSettings) => {
    setSettings(nextSettings);
    saveStoreSettings(nextSettings);
  };

  // Private Admin Route (completely isolated from public menu)
  if (isAdminView) {
    if (!isAdminUnlocked) {
      return (
        <AdminPinGate
          brandName={settings.brandName}
          expectedPin={settings.adminPin}
          onUnlock={() => setIsAdminUnlocked(true)}
          onBackToMenu={navigateToPublicMenu}
        />
      );
    }

    return (
      <AdminDashboard
        products={products}
        settings={settings}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleStock={handleToggleStock}
        onResetDemoMenu={handleResetDemoMenu}
        onSaveSettings={handleSaveSettings}
        onBackToMenu={navigateToPublicMenu}
        onLockAdmin={() => setIsAdminUnlocked(false)}
      />
    );
  }

  // Public Customer Menu View
  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#F8F5F0] pb-24">
      <PublicHeader
        brandName={settings.brandName}
        itemCount={itemCount}
        subtotal={subtotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <MenuHero brandName={settings.brandName} productCount={products.length} />

      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={visibleProducts.length}
      />

      <main id="menu-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#F8F5F0]">
            {selectedCategory === 'All' ? 'Notre Carte' : selectedCategory}
          </h2>
          <span className="font-price text-xs text-[#A89F95]">
            {visibleProducts.length} choix
          </span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={productQuantityMap.get(product.id) || 0}
                onQuickAdd={handleQuickAdd}
                onDecrement={handleDecrementProduct}
                onCustomize={(item) => setCustomizingProduct(item)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#181614] border border-white/10 p-10 text-center">
            <UtensilsCrossed className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold text-[#F8F5F0] mb-1">
              Aucun plat trouvé
            </h3>
            <p className="text-sm text-[#A89F95] mb-5">
              Essayez un autre mot-clé ou réinitialisez les filtres de catégorie.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-semibold cursor-pointer"
            >
              Afficher tout le menu
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A8178]">
        <p>
          © {new Date().getFullYear()} {settings.brandName} · Commande directe WhatsApp
        </p>
        <p>
          Livraison &amp; Retrait sur place · Confirmation immédiate sur WhatsApp
        </p>
      </footer>

      <StickyCartBar
        itemCount={itemCount}
        subtotal={subtotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {customizingProduct && (
        <CustomizeItemModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={handleConfirmCustomized}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        settings={settings}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
