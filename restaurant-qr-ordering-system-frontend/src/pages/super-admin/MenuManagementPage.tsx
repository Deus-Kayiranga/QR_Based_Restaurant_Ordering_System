import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '../../api/menu'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'
import { 
  Search, Plus, Flame, Leaf, Coffee, Wine, UtensilsCrossed, 
  Pizza, Fish, Salad, Edit, Trash2, X, AlertTriangle, ShieldCheck
} from 'lucide-react'
import { COLORS } from '../../styles/theme'
import { formatCurrency } from '../../utils/format'
import type { StationType } from '../../types'

const CATEGORY_ICONS: Record<string, any> = {
  'Burgers': UtensilsCrossed, 'Drinks': Coffee, 'Wines': Wine, 
  'Pizza': Pizza, 'Seafood': Fish, 'Salads': Salad, 'Popular': Flame
}

export function MenuManagementPage() {
  const queryClient = useQueryClient()
  const [activeCategory, setActiveCategory] = useState<number | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [itemForm, setItemForm] = useState({
    categoryId: 0, itemName: '', description: '', price: 0, imageUrl: '',
    destinationStation: 'KITCHEN' as StationType, isVegetarian: false,
    isVegan: false, isGlutenFree: false,
    containsAllergens: 'None', initialStock: 0, trackStock: false,
    stockQuantity: 0, displayOrder: 0
  })
  const [catForm, setCatForm] = useState({ categoryName: '', description: '', displayOrder: 0 })

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['categories'], queryFn: () => menuApi.getCategories()
  })

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['items', activeCategory !== 'ALL' ? activeCategory : undefined], 
    queryFn: () => menuApi.getItems(activeCategory !== 'ALL' ? { categoryId: activeCategory as number } : undefined)
  })

  const saveItemMutation = useMutation({
    mutationFn: (data: any) => editingItem ? menuApi.updateItem(editingItem.itemId, data) : menuApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      setIsItemModalOpen(false)
    }
  })

  const saveCatMutation = useMutation({
    mutationFn: menuApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsCatModalOpen(false)
    }
  })

  const deleteItemMutation = useMutation({
    mutationFn: menuApi.deleteItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] })
  })

  const toggleAvailabilityMutation = useMutation({
    mutationFn: menuApi.toggleAvailability,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] })
  })

  const handleOpenItemEdit = (item: any) => {
    setEditingItem(item)
    setItemForm({
      categoryId: item.categoryId, itemName: item.itemName, description: item.description || '',
      price: item.price, imageUrl: item.imageUrl || '', destinationStation: item.destinationStation,
      isVegetarian: item.isVegetarian, isVegan: item.isVegan || false, isGlutenFree: item.isGlutenFree || false,
      containsAllergens: item.containsAllergens || 'None',
      initialStock: item.stockQuantity || 0, trackStock: item.trackStock || false,
      stockQuantity: item.stockQuantity || 0, displayOrder: item.displayOrder || 0
    })
    setIsItemModalOpen(true)
  }

  const handleOpenItemAdd = () => {
    setEditingItem(null)
    setItemForm({
      categoryId: categories?.[0]?.categoryId || 0, itemName: '', description: '', price: 0, imageUrl: '',
      destinationStation: 'KITCHEN', isVegetarian: false, isVegan: false, isGlutenFree: false,
      containsAllergens: 'None', initialStock: 0, trackStock: false, stockQuantity: 0, displayOrder: 0
    })
    setIsItemModalOpen(true)
  }

  const filteredItems = items?.filter((i: any) => 
    i.itemName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-[1100px] mx-auto min-h-screen pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Menu Management</h1>
          <p className="text-[#8B7355] mt-1">Manage your categories and menu items</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => { setCatForm({categoryName: '', description: '', displayOrder: 0}); setIsCatModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E8D5C4] text-[#8B7355] rounded-xl font-bold hover:bg-[#FFF8F0] transition-colors shadow-sm"
          >
            <Plus size={18} /> Category
          </button>
          <button 
            onClick={handleOpenItemAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primaryDark transition-colors shadow-sm"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Plus size={18} /> Menu Item
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="bg-white p-2 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 mb-6" style={{ borderColor: COLORS.border }}>
        <div className="flex-1 overflow-x-auto scroll-hide flex gap-2">
          <button
            onClick={() => setActiveCategory('ALL')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold flex-shrink-0 transition-all"
            style={{
              background: activeCategory === 'ALL' ? COLORS.primary : 'transparent',
              color: activeCategory === 'ALL' ? '#fff' : COLORS.textSecondary,
            }}
          >
            All Items
          </button>
          {categories?.map((cat: any) => {
            const Icon = CATEGORY_ICONS[cat.categoryName] || UtensilsCrossed
            const isActive = activeCategory === cat.categoryId
            return (
              <button
                key={cat.categoryId}
                onClick={() => setActiveCategory(cat.categoryId)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold flex-shrink-0 transition-all"
                style={{
                  background: isActive ? COLORS.primary : 'transparent',
                  color: isActive ? '#fff' : COLORS.textSecondary,
                }}
              >
                <Icon size={14} /> {cat.categoryName}
              </button>
            )
          })}
        </div>
        
        <div className="flex items-center gap-2 bg-[#FFF8F0] rounded-xl px-3 py-2 flex-shrink-0 md:w-64 border border-[#E8D5C4]">
          <Search size={16} className="text-[#8B7355]" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items..." 
            className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full text-[#2C1810]"
          />
        </div>
      </div>

      {/* Items Grid */}
      {itemsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"><LoadingSkeleton className="h-64" /><LoadingSkeleton className="h-64" /><LoadingSkeleton className="h-64" /></div>
      ) : filteredItems?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8D5C4]">
          <UtensilsCrossed size={48} className="mx-auto text-[#E8D5C4] mb-4" />
          <p className="font-bold text-lg text-[#2C1810]">No menu items found</p>
          <p className="text-[#8B7355]">Click "Add Menu Item" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems?.map((item: any) => (
            <div key={item.itemId} className="bg-white rounded-2xl overflow-hidden border transition-all hover:shadow-xl group" style={{ borderColor: COLORS.border }}>
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-[#FFF8F0]">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed size={32} className="text-[#E8D5C4]" />
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider text-white ${item.destinationStation === 'BAR' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                    {item.destinationStation}
                  </span>
                  {!item.isAvailable && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider text-white bg-gray-500">
                      SOLD OUT
                    </span>
                  )}
                </div>

                {/* Quick Actions overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenItemEdit(item)} className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white text-primary">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => deleteItemMutation.mutate(item.itemId)} className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Stock info */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                  <div className="flex items-center gap-1.5">
                    {item.currentStock <= item.minimumStockAlert && <AlertTriangle size={14} className="text-yellow-400" />}
                    <span className="text-xs font-bold shadow-sm">Stock: {item.currentStock}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[#2C1810] text-base leading-tight line-clamp-1 flex-1 pr-2">{item.itemName}</h3>
                  <p className="font-black text-primary text-base whitespace-nowrap">{formatCurrency(item.price)}</p>
                </div>
                
                {item.isVegetarian && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 mb-2">
                    <Leaf size={10} /> VEGETARIAN
                  </div>
                )}
                
                <p className="text-xs text-[#8B7355] line-clamp-2 min-h-[32px] mb-4">
                  {item.description || 'No description provided.'}
                </p>

                <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: COLORS.border }}>
                  <span className="text-[10px] font-bold text-[#8B7355] uppercase tracking-wider">Availability</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={item.isAvailable} onChange={() => toggleAvailabilityMutation.mutate(item.itemId)} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b flex justify-between items-center bg-[#FFF8F0]" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button onClick={() => setIsItemModalOpen(false)} className="text-[#8B7355]"><X size={20} /></button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); saveItemMutation.mutate(itemForm) }} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2C1810] border-b pb-2" style={{ borderColor: COLORS.border }}>Basic Info</h3>
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Item Name</label>
                  <input required value={itemForm.itemName} onChange={e => setItemForm({...itemForm, itemName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Category</label>
                  <select required value={itemForm.categoryId} onChange={e => setItemForm({...itemForm, categoryId: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm bg-white">
                    {categories?.map((c: any) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Price (RWF)</label>
                  <input required type="number" min="0" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Description</label>
                  <textarea rows={3} value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Image URL</label>
                  <input value={itemForm.imageUrl} onChange={e => setItemForm({...itemForm, imageUrl: e.target.value})} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2C1810] border-b pb-2 mt-4" style={{ borderColor: COLORS.border }}>Operations & Dietary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Station</label>
                    <select value={itemForm.destinationStation} onChange={e => setItemForm({...itemForm, destinationStation: e.target.value as StationType})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm bg-white">
                      <option value="KITCHEN">Kitchen</option>
                      <option value="BAR">Bar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Display Order</label>
                    <input type="number" value={itemForm.displayOrder} onChange={e => setItemForm({...itemForm, displayOrder: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg">
                    <input type="checkbox" checked={itemForm.isVegetarian} onChange={e => setItemForm({...itemForm, isVegetarian: e.target.checked})} className="w-4 h-4 text-primary border-[#E8D5C4] rounded focus:ring-primary" />
                    <span className="text-[10px] font-bold text-[#2C1810]">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg">
                    <input type="checkbox" checked={itemForm.isVegan} onChange={e => setItemForm({...itemForm, isVegan: e.target.checked})} className="w-4 h-4 text-primary border-[#E8D5C4] rounded focus:ring-primary" />
                    <span className="text-[10px] font-bold text-[#2C1810]">Vegan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg">
                    <input type="checkbox" checked={itemForm.isGlutenFree} onChange={e => setItemForm({...itemForm, isGlutenFree: e.target.checked})} className="w-4 h-4 text-primary border-[#E8D5C4] rounded focus:ring-primary" />
                    <span className="text-[10px] font-bold text-[#2C1810]">Gluten Free</span>
                  </label>
                </div>

                <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#E8D5C4] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">Track Stock</label>
                    <input type="checkbox" checked={itemForm.trackStock} onChange={e => setItemForm({...itemForm, trackStock: e.target.checked})} className="w-5 h-5 text-primary border-[#E8D5C4] rounded focus:ring-primary" />
                  </div>
                  {itemForm.trackStock && (
                    <div>
                      <label className="block text-[10px] font-bold text-[#8B7355] mb-1.5 uppercase">Stock Quantity</label>
                      <input type="number" value={itemForm.stockQuantity} onChange={e => setItemForm({...itemForm, stockQuantity: Number(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
                    </div>
                  )}
                </div>
              </div>

            </form>
            <div className="p-5 border-t bg-gray-50 flex gap-3" style={{ borderColor: COLORS.border }}>
              <button type="button" onClick={() => setIsItemModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-[#E8D5C4] font-bold text-[#2C1810] hover:bg-white transition-colors">Cancel</button>
              <button onClick={(e) => { e.preventDefault(); saveItemMutation.mutate(itemForm) }} className="flex-1 px-4 py-3 rounded-xl text-white font-bold bg-primary hover:bg-primaryDark transition-colors">
                {saveItemMutation.isPending ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#E8D5C4] flex justify-between items-center bg-[#FFF8F0]">
              <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Add Category</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="text-[#8B7355]"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveCatMutation.mutate(catForm) }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Category Name</label>
                <input required value={catForm.categoryName} onChange={e => setCatForm({...catForm, categoryName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B7355] mb-1.5 uppercase">Display Order (e.g. 1)</label>
                <input required type="number" value={catForm.displayOrder} onChange={e => setCatForm({...catForm, displayOrder: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5C4] focus:border-primary outline-none text-sm" />
              </div>
              <button type="submit" className="w-full mt-2 px-4 py-3 rounded-xl text-white font-bold bg-primary hover:bg-primaryDark transition-colors">
                {saveCatMutation.isPending ? 'Saving...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
