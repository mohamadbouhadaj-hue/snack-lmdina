import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_PRODUCTS } from '../data/defaultMenu';
import { CartItem } from '../types/menu';
import { filterProducts } from './menuFilter';
import { isAdminRoute } from './storage';
import {
  buildCartItemKey,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
  calculateExtrasPrice,
  formatMoroccanWhatsAppNumber,
} from './whatsapp';

test('default demo catalog has exactly 20 products with valid prices', () => {
  assert.equal(DEFAULT_PRODUCTS.length, 20);
  for (const product of DEFAULT_PRODUCTS) {
    assert.ok(product.name.length > 0);
    assert.ok(product.price > 0);
  }
});

test('formatMoroccanWhatsAppNumber converts 0717288651 to 212717288651', () => {
  assert.equal(formatMoroccanWhatsAppNumber('0717288651'), '212717288651');
  assert.equal(formatMoroccanWhatsAppNumber('07 17 28 86 51'), '212717288651');
  assert.equal(formatMoroccanWhatsAppNumber('+212 717-288-651'), '212717288651');
  assert.equal(formatMoroccanWhatsAppNumber('212717288651'), '212717288651');
});

test('calculateExtrasPrice and calculateCartTotals compute exact DH totals', () => {
  const extras = ['Extra Cheddar', 'Double Viande'];
  const extrasCost = calculateExtrasPrice(extras);
  assert.equal(extrasCost, 20);

  const items: CartItem[] = [
    {
      cartKey: buildCartItemKey('tacos-poulet-grille', 'Sauce Algérienne', 'Piquant', extras, ''),
      productId: 'tacos-poulet-grille',
      name: 'Tacos Poulet Grillé',
      unitPrice: 42,
      extrasPrice: extrasCost,
      quantity: 2,
      image: '',
      sauce: 'Sauce Algérienne',
      spicy: 'Piquant',
      extras,
    },
    {
      cartKey: buildCartItemKey('soda-canette-fraiche'),
      productId: 'soda-canette-fraiche',
      name: 'Soda Canette Fraîche',
      unitPrice: 10,
      extrasPrice: 0,
      quantity: 1,
      image: '',
    },
  ];

  const totals = calculateCartTotals(items);
  assert.equal(totals.itemCount, 3);
  assert.equal(totals.subtotal, (42 + 20) * 2 + 10);
});

test('buildWhatsAppOrderMessage formats delivery and pickup cleanly and links to 212717288651', () => {
  const items: CartItem[] = [
    {
      cartKey: '1',
      productId: 'smash-burger-classic',
      name: 'Smash Burger Classic',
      unitPrice: 38,
      extrasPrice: 5,
      quantity: 2,
      image: '',
      sauce: 'Sauce Biggy',
      extras: ['Extra Cheddar'],
      note: 'Sans oignons',
    },
  ];

  const deliveryMsg = buildWhatsAppOrderMessage({
    brandName: 'snacklmdina',
    items,
    orderType: 'delivery',
    address: 'Hay Riad, Rue 12',
    deliveryNote: 'Livraison express 25-35 min',
  });

  assert.match(deliveryMsg, /snacklmdina/);
  assert.match(deliveryMsg, /Livraison \(توصيل\)/);
  assert.match(deliveryMsg, /Hay Riad, Rue 12/);
  assert.match(deliveryMsg, /2x Smash Burger Classic/);
  assert.match(deliveryMsg, /86 DH/);
  assert.match(deliveryMsg, /Sans oignons/);
  assert.match(deliveryMsg, /confirmés sur WhatsApp par snacklmdina/);

  const pickupMsg = buildWhatsAppOrderMessage({
    brandName: 'snacklmdina',
    items,
    orderType: 'pickup',
  });
  assert.match(pickupMsg, /Sur place \/ À emporter/);

  const url = buildWhatsAppUrl('0717288651', deliveryMsg);
  assert.ok(url.startsWith('https://wa.me/212717288651?text='));
});

test('filterProducts filters by category and accent-insensitive query', () => {
  const tacos = filterProducts(DEFAULT_PRODUCTS, 'Tacos & Wraps', '');
  assert.equal(tacos.length, 4);

  const searchGrill = filterProducts(DEFAULT_PRODUCTS, 'All', 'grille');
  assert.ok(searchGrill.some((p) => p.id === 'tacos-poulet-grille'));

  const searchSmash = filterProducts(DEFAULT_PRODUCTS, 'Burgers', 'smash');
  assert.equal(searchSmash.length, 3);
});

test('isAdminRoute detects ?admin=1 and #admin only', () => {
  assert.equal(isAdminRoute('?admin=1', ''), true);
  assert.equal(isAdminRoute('', '#admin'), true);
  assert.equal(isAdminRoute('', ''), false);
  assert.equal(isAdminRoute('?category=burgers', ''), false);
});
