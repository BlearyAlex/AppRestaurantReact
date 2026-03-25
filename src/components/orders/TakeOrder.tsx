import type { ProductResponse } from "@/types/product";
import { ChevronDown, ChevronUp, PackageX, Search, Send, StickyNote, Trash, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import CurrentConsumptionModal from "@/components/orders/CurrentConsumptionModal.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OrderType } from "@/enums/orderEnum.ts";
import type { CreateOrderDto } from "@/types/order";
import useModalState from "@/hooks/useModalState.ts";
import useOrder from "@/hooks/useOrder";
import { useSelectedProducts } from "@/hooks/useSelectedProducts.ts";
import { useOrderStore } from "@/store/orderStore.ts";
import useProducts from "@/hooks/useProducts.ts";

// ─── Utilidades ───────────────────────────────────────────────────────────────
const formatMXN = (amount: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)

// Fallback para productos sin imagen
const PLACEHOLDER = '/placeholder-product.png'

// ─── Sub-componente: tarjeta de producto ──────────────────────────────────────

interface ProductCardProps {
    product: ProductResponse
    quantity: number   // 0 = no está en la orden
    onAdd: () => void
}

function ProductCard({ product, quantity, onAdd }: ProductCardProps) {
    const inOrder = quantity > 0

    // Producto sin stock disponible
    const outOfStock = product.hasStock && (product.stockQuantity ?? 0) <= 0
    const inactive = !product.isActive

    const disabled = outOfStock || inactive

    return (
        <button
            type="button"
            onClick={onAdd}
            disabled={disabled}
            title={
                inactive ? 'Producto inactivo'
                    : outOfStock ? 'Sin stock disponible'
                        : undefined
            }
            className={[
                'relative flex flex-col text-left rounded-xl border transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                disabled
                    ? 'opacity-50 cursor-not-allowed border-border bg-muted'
                    : inOrder
                        ? 'border-primary bg-primary/5 hover:shadow-md active:scale-95 cursor-pointer'
                        : 'border-border bg-card hover:border-primary/40 hover:shadow-md active:scale-95 cursor-pointer',
            ].join(' ')}
        >
            {/* Badge de cantidad en orden */}
            {inOrder && !disabled && (
                <span className="absolute -top-2 -right-2 z-10 min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-primary text-white text-[11px] font-semibold px-1.5 shadow">
                    ×{quantity}
                </span>
            )}

            {/* Badge de sin stock */}
            {outOfStock && (
                <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-destructive/90 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                    <PackageX size={10} /> Sin stock
                </span>
            )}

            {/* Imagen */}
            <div className="w-full aspect-square overflow-hidden rounded-t-xl bg-muted">
                <img
                    src={product.imageUrl ? `http://localhost:8080/${product.imageUrl}` : PLACEHOLDER}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
                />
            </div>

            {/* Info */}
            <div className="w-full px-2 py-2">
                <p className="text-sm font-medium leading-snug line-clamp-2">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatMXN(product.price)}</p>
                {/* Stock bajo — aviso sutil */}
                {product.hasStock && (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) <= 5 && (
                    <p className="text-[10px] text-amber-500 font-medium mt-0.5">
                        Quedan {product.stockQuantity}
                    </p>
                )}
            </div>
        </button>
    )
}

// ─── Sub-componente: fila de item en la orden ─────────────────────────────────

interface OrderItemRowProps {
    item: {
        product: ProductResponse
        quantity: number
        notes?: string
    }
    onIncrease: () => void
    onDecrease: () => void
    onRemove: () => void
    onNoteChange: (value: string) => void
}

function OrderItemRow({ item, onIncrease, onDecrease, onRemove, onNoteChange }: OrderItemRowProps) {
    const [showNotes, setShowNotes] = useState(!!item.notes)

    return (
        <div className="flex flex-col gap-1 py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-2">
                {/* Imagen miniatura */}
                <img
                    src={item.product.imageUrl ? `http://localhost:8080/${item.product.imageUrl}` : PLACEHOLDER}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-muted"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
                />

                {/* Nombre + categoría */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">{item.product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.product.category?.name}</p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onDecrease}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-base hover:bg-muted transition-colors"
                    >
                        −
                    </button>
                    <span className="text-sm font-semibold w-5 text-center tabular-nums">
                        {item.quantity}
                    </span>
                    <button
                        type="button"
                        onClick={onIncrease}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-base hover:bg-muted transition-colors"
                    >
                        +
                    </button>
                </div>

                {/* Precio + eliminar */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-sm font-semibold text-primary w-16 text-right tabular-nums">
                        {formatMXN(item.product.price * item.quantity)}
                    </span>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Eliminar ${item.product.name}`}
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>

            {/* Notas colapsables */}
            <div className="pl-12">
                {/* Resumen de nota si está cerrada */}
                {!showNotes && item.notes && (
                    <p className="text-[11px] text-muted-foreground italic truncate mb-0.5">
                        📝 {item.notes}
                    </p>
                )}
                <button
                    type="button"
                    onClick={() => setShowNotes(s => !s)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                    <StickyNote size={11} />
                    {showNotes ? 'Cerrar nota' : item.notes ? 'Editar nota' : 'Agregar nota'}
                    {showNotes ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
                {showNotes && (
                    <textarea
                        placeholder="ej: sin cebolla, término medio, extra salsa..."
                        value={item.notes || ''}
                        onChange={(e) => onNoteChange(e.target.value)}
                        className="mt-1.5 w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        rows={2}
                        autoFocus
                    />
                )}
            </div>
        </div>
    )
}

// ─── Componente principal ──────────────────────────────────────────────────────

function TakeOrder({ orderType }: { orderType: OrderType }) {
    // ✅ Todos los hooks SIEMPRE antes de cualquier return condicional
    const tableId = useOrderStore((state) => state.tableId)
    const { data: productsData, fetchProducts } = useProducts()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)

    const {
        selectedProducts,
        addProduct,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        clearOrder,
        updateNotes,
        totalProducts,
        totalPrice,
    } = useSelectedProducts()

    const openModal = useModalState()
    const { createOrder } = useOrder()

    useEffect(() => {
        if (productsData.length === 0) fetchProducts()
    }, [])

    // Mapa rápido productId → cantidad actual en la orden
    const quantityMap = useMemo(() => {
        const map = new Map<number, number>()
        selectedProducts.forEach((item) => map.set(item.product.productId, item.quantity))
        return map
    }, [selectedProducts])

    // Categorías únicas derivadas de los productos cargados
    const categories = useMemo(() => {
        const map = new Map()
        productsData.forEach((p) => {
            if (p.category) map.set(p.category.categoryId, p.category)
        })
        return Array.from(map.values())
    }, [productsData])

    // Productos filtrados por categoría + búsqueda — solo activos
    const filteredProducts = useMemo(() => {
        let result = productsData.filter((p) => p.isActive)
        if (selectedCategory !== 'all') {
            result = result.filter(
                (p) => p.category?.categoryId.toString() === selectedCategory
            )
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            result = result.filter((p) => p.name.toLowerCase().includes(q))
        }
        return result
    }, [selectedCategory, productsData, searchQuery])

    const handleCategoryChange = useCallback((catId: string) => {
        setSelectedCategory(catId)
        setSearchQuery('')
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedProducts.length === 0) return
        setLoading(true)
        try {
            const order: CreateOrderDto = {
                orderType,
                products: selectedProducts.map((item) => ({
                    productId: item.product.productId,
                    quantity: item.quantity,
                    unitPrice: item.product.price,
                    notes: item.notes,
                })),
            }
            if (orderType === OrderType.ForTable && tableId) order.tableId = tableId
            console.log(order)
            await createOrder(order)
            clearOrder() // sin args = limpia todo
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 items-start">

                    {/* ── Catálogo de productos ── */}
                    <Card className="flex-[60%] p-4">

                        {/* Barra de búsqueda */}
                        <div className="relative mb-3">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label="Limpiar búsqueda"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Pills de categoría */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('all')}
                                className={[
                                    'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                                    selectedCategory === 'all'
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/40',
                                ].join(' ')}
                            >
                                Todos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.categoryId}
                                    type="button"
                                    onClick={() => handleCategoryChange(cat.categoryId.toString())}
                                    className={[
                                        'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                                        selectedCategory === cat.categoryId.toString()
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-border text-muted-foreground hover:border-primary/40',
                                    ].join(' ')}
                                >
                                    {cat.color && (
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ background: cat.color }}
                                        />
                                    )}
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Grid de productos */}
                        {filteredProducts.length === 0 ? (
                            <div className="py-16 text-center text-sm text-muted-foreground">
                                {searchQuery
                                    ? `Sin resultados para "${searchQuery}"`
                                    : 'No hay productos en esta categoría.'}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {filteredProducts.map((product: ProductResponse) => (
                                    <ProductCard
                                        key={product.productId}
                                        product={product}
                                        quantity={quantityMap.get(product.productId) ?? 0}
                                        onAdd={() => addProduct(product)}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* ── Panel de orden ── */}
                    <Card className="flex-[40%] p-4 flex flex-col max-h-[620px]">
                        {selectedProducts.length > 0 ? (
                            <>
                                {/* Encabezado */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-sm">Pedido actual</h3>
                                    <span className="bg-primary text-white text-xs font-semibold rounded-full px-2.5 py-0.5">
                                        {totalProducts} {totalProducts === 1 ? 'item' : 'items'}
                                    </span>
                                </div>

                                {/* Lista scrollable */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    {selectedProducts.map((item) => (
                                        <OrderItemRow
                                            key={item.product.productId}
                                            item={item}
                                            onIncrease={() => increaseQuantity(item.product.productId)}
                                            onDecrease={() => decreaseQuantity(item.product.productId)}
                                            onRemove={() => removeProduct(item.product.productId)}
                                            onNoteChange={(val) => updateNotes(item.product.productId, val)}
                                        />
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="pt-3 mt-2 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-sm">Total</span>
                                        <span className="text-xl font-bold text-primary tabular-nums">
                                            {formatMXN(totalPrice)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        IVA no incluido
                                    </p>
                                </div>

                                {/* Botones */}
                                <div className="mt-3 flex flex-col gap-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-500 text-white gap-2"
                                        disabled={selectedProducts.length === 0 || loading}
                                    >
                                        {loading ? (
                                            'Enviando...'
                                        ) : orderType === OrderType.ForTable ? (
                                            <><Send size={15} /> Enviar a cocina</>
                                        ) : (
                                            <><Send size={15} /> Proseguir</>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                        onClick={() => clearOrder()}
                                    >
                                        <Trash size={14} /> Limpiar pedido
                                    </Button>
                                </div>
                            </>
                        ) : (
                            /* Estado vacío */
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-3xl">
                                    🛒
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Sin productos</p>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[160px]">
                                        Toca un producto del catálogo para agregarlo al pedido.
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </form>

            <CurrentConsumptionModal
                open={openModal.open}
                onClose={openModal.closeModal}
                consumptionDetails={selectedProducts}
            />
        </>
    )
}

export default TakeOrder

