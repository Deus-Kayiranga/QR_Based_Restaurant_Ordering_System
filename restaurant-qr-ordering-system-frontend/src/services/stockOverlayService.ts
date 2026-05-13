import type { MenuItem, MenuItemResponse } from '../types'

const KEY = 'deus_stock_overlay_v1'
const MOV_KEY = 'deus_stock_movements_v1'

type StockRecord = {
  currentStock: number
  initialStock: number
  minimumStockAlert: number
  stockUnit: string
  lastRestockedAt?: string
}

type Overlay = Record<number, StockRecord>

function readOverlay(): Overlay {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Overlay
  } catch {
    return {}
  }
}

function writeOverlay(o: Overlay) {
  localStorage.setItem(KEY, JSON.stringify(o))
}

function deterministicBaseStock(itemId: number): number {
  return 15 + (itemId % 37)
}

function num(v: number | string | null | undefined): number | undefined {
  if (v == null) return undefined
  return typeof v === 'string' ? Number(v) : v
}

export function mergeMenuItemWithStock(raw: MenuItemResponse, categoryId: number): MenuItem {
  const price = typeof raw.price === 'string' ? Number(raw.price) : raw.price
  const discounted = num(raw.discountedPrice)
  const overlay = readOverlay()[raw.itemId]
  const base = raw.currentStock ?? deterministicBaseStock(raw.itemId)
  const current = overlay?.currentStock ?? base
  const initial = overlay?.initialStock ?? raw.initialStock ?? base
  const minimum = overlay?.minimumStockAlert ?? raw.minimumStockAlert ?? 5
  const unit = overlay?.stockUnit ?? raw.stockUnit ?? 'pcs'

  return {
    itemId: raw.itemId,
    categoryId: raw.categoryId ?? categoryId,
    categoryName: raw.categoryName,
    itemName: raw.itemName,
    description: raw.description,
    price,
    discountedPrice: discounted ?? undefined,
    imageUrl: raw.imageUrl,
    destinationStation: (raw.destinationStation ?? 'KITCHEN') as MenuItem['destinationStation'],
    isAvailable: raw.isAvailable !== false,
    isVegetarian: !!raw.isVegetarian,
    isVegan: !!raw.isVegan,
    isGlutenFree: !!raw.isGlutenFree,
    containsAllergens: raw.containsAllergens,
    displayOrder: raw.displayOrder ?? 0,
    currentStock: current,
    initialStock: initial,
    minimumStockAlert: minimum,
    stockUnit: unit,
    lastRestockedAt: overlay?.lastRestockedAt ?? raw.lastRestockedAt ?? undefined,
  }
}

export function adjustStock(itemId: number, delta: number, patch?: Partial<StockRecord>) {
  const o = readOverlay()
  const prev = o[itemId]
  const cur = prev?.currentStock ?? deterministicBaseStock(itemId)
  o[itemId] = {
    currentStock: Math.max(0, cur + delta),
    initialStock: patch?.initialStock ?? prev?.initialStock ?? deterministicBaseStock(itemId),
    minimumStockAlert: patch?.minimumStockAlert ?? prev?.minimumStockAlert ?? 5,
    stockUnit: patch?.stockUnit ?? prev?.stockUnit ?? 'pcs',
    lastRestockedAt: delta > 0 ? new Date().toISOString() : prev?.lastRestockedAt,
  }
  writeOverlay(o)
  appendMovement(itemId, delta)
}

function appendMovement(itemId: number, quantityChanged: number) {
  try {
    const raw = localStorage.getItem(MOV_KEY)
    const list = (raw ? JSON.parse(raw) : []) as { itemId: number; quantityChanged: number; at: string }[]
    list.unshift({ itemId, quantityChanged, at: new Date().toISOString() })
    localStorage.setItem(MOV_KEY, JSON.stringify(list.slice(0, 200)))
  } catch {
    /* ignore */
  }
}

export function getStockMovements(itemId: number) {
  try {
    const list = JSON.parse(localStorage.getItem(MOV_KEY) ?? '[]') as {
      itemId: number
      quantityChanged: number
      at: string
    }[]
    return list.filter((m) => m.itemId === itemId)
  } catch {
    return []
  }
}
