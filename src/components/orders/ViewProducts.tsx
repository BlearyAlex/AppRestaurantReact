import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BadgeCheck, Receipt, Printer, X, Minus, Plus, Trash2, Save } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import useTables from '@/hooks/useTables';

interface ViewAccountProps {
    onClose?: () => void;
}

function ViewProducts({ onClose }: ViewAccountProps) {
    const tableId = useOrderStore((state) => state.tableId);

    // useTables para obtener las órdenes de la mesa
    const { dataOrderByTable, loading, error: errorTables, getOrdersByTable, updateProductQuantities } = useTables();

    const [quantityChanges, setQuantityChanges] = useState<Record<string, number>>({});

    useEffect(() => {
        if (tableId) {
            getOrdersByTable(tableId);
        }
    }, [tableId]);

    // Aplicar cambios de cantidad locales
    const ordersWithChanges = Array.isArray(dataOrderByTable)
        ? dataOrderByTable.map(order => ({
            ...order,
            products: order.products.map((product: any) => {
                const key = `${order.orderId}-${product.productId}`;
                return {
                    ...product,
                    originalQuantity: product.quantity,
                    quantity: quantityChanges[key] ?? product.quantity,
                    totalPrice: (quantityChanges[key] ?? product.quantity) * product.unitPrice
                };
            })
        }))
        : [];

    const handleIncreaseQuantity = (orderId: number, productId: number, originalQuantity: number) => {
        const key = `${orderId}-${productId}`;
        const current = quantityChanges[key] ?? originalQuantity;
        if (current < originalQuantity) {
            setQuantityChanges(prev => ({ ...prev, [key]: current + 1 }));
        }
    };

    const handleDecreaseQuantity = (orderId: number, productId: number, originalQuantity: number) => {
        const key = `${orderId}-${productId}`;
        const current = quantityChanges[key] ?? originalQuantity;
        if (current > 0) {
            setQuantityChanges(prev => ({ ...prev, [key]: current - 1 }));
        }
    };

    const handleRemoveProduct = (orderId: number, productId: number) => {
        const key = `${orderId}-${productId}`;
        setQuantityChanges(prev => ({ ...prev, [key]: 0 }));
    };

    const handleSaveChanges = async () => {
        if (!tableId || Object.keys(quantityChanges).length === 0) return;

        const orderGroups: Record<number, { productId: number; newQuantity: number }[]> = {};

        Object.entries(quantityChanges).forEach(([key, newQuantity]) => {
            const [orderIdStr, productIdStr] = key.split('-');
            const orderId = parseInt(orderIdStr);
            const productId = parseInt(productIdStr);

            if (!orderGroups[orderId]) orderGroups[orderId] = [];
            orderGroups[orderId].push({ productId, newQuantity });
        });

        await updateProductQuantities({
            tableId,
            ordersToUpdate: Object.entries(orderGroups).map(([orderIdStr, productUpdates]) => ({
                orderId: parseInt(orderIdStr),
                productUpdates
            }))
        });

        setQuantityChanges({});
    };

    const hasChanges = Object.keys(quantityChanges).length > 0;

    // Guards
    if (!tableId) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">No hay mesa seleccionada.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Cargando cuenta...</p>
            </div>
        );
    }

    if (errorTables) {
        return (
            <div className="p-6">
                <div className="bg-card text-card-foreground p-6 rounded-lg border">
                    <p className="text-center">No se encontraron órdenes para esta mesa.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Receipt className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl font-bold">Cuenta de Mesa {tableId}</h2>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                {ordersWithChanges.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No hay productos en esta cuenta.</p>
                    </div>
                ) : (
                    <div className="space-y-6 mb-6">
                        {ordersWithChanges.map((order) => (
                            <div key={`order-${order.orderId}`} className="space-y-2">
                                {/* Header de la orden */}
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Receipt className="w-4 h-4 text-primary" />
                                        <span className="font-semibold text-sm">Orden #{order.orderId}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleString('es-MX', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                {/* Productos */}
                                {order.products.map((product: any, productIndex: any) => {
                                    const key = `${order.orderId}-${product.productId}`;
                                    const productHasChanges = quantityChanges[key] !== undefined;
                                    const isAtZero = product.quantity === 0;
                                    const isAtMax = product.quantity >= product.originalQuantity;

                                    return (
                                        <div
                                            key={`${order.orderId}-${product.productId}-${productIndex}`}
                                            className={`flex justify-between items-start p-4 rounded-lg transition-all ml-4 ${isAtZero
                                                ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 opacity-60'
                                                : productHasChanges
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500'
                                                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex gap-4 flex-1">
                                                <img
                                                    src={product.imageUrl ? `http://localhost:8080${product.imageUrl}` : '/placeholder-product.png'}
                                                    alt={product.productName}
                                                    className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{product.productName}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.unitPrice)} c/u
                                                        </span>
                                                        {isAtZero && (
                                                            <span className="text-xs font-semibold text-red-600 dark:text-red-400">• ELIMINADO</span>
                                                        )}
                                                    </div>
                                                    {product.notes && (
                                                        <p className="text-sm text-gray-500 mt-1 italic">Nota: {product.notes}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-1 border">
                                                    <Button
                                                        size="icon" variant="ghost" className="h-8 w-8"
                                                        onClick={() => handleDecreaseQuantity(order.orderId, product.productId, product.originalQuantity)}
                                                        disabled={isAtZero}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className={`min-w-8 text-center font-semibold ${isAtZero ? 'text-red-600' : ''}`}>
                                                        {product.quantity}
                                                    </span>
                                                    <Button
                                                        size="icon" variant="ghost" className="h-8 w-8"
                                                        onClick={() => handleIncreaseQuantity(order.orderId, product.productId, product.originalQuantity)}
                                                        disabled={isAtMax}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="text-right min-w-[100px]">
                                                    <p className={`text-lg font-bold ${isAtZero ? 'text-red-600 line-through' : 'text-primary'}`}>
                                                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.totalPrice)}
                                                    </p>
                                                </div>

                                                <Button
                                                    size="icon" variant="ghost"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleRemoveProduct(order.orderId, product.productId)}
                                                    disabled={isAtZero}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Botones de acción */}
                        <div className="flex gap-3 mt-6">
                            {hasChanges && (
                                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveChanges}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cambios ({Object.keys(quantityChanges).length})
                                </Button>
                            )}
                            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => window.print()}>
                                <Printer className="w-4 h-4 mr-2" />
                                Imprimir Cuenta
                            </Button>
                            <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                                <BadgeCheck className="w-4 h-4 mr-2" />
                                Procesar Pago
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default ViewProducts;