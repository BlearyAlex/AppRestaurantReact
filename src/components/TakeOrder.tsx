import useProducts from '@/hooks/useProducts'
import { Card } from './ui/card'
import { useEffect, useMemo, useState } from 'react'
import type { ProductResponse } from '@/types/product';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { BadgeCheck, NotepadText, Send, ShoppingCart, Trash } from 'lucide-react';
import { useSelectedProducts } from '@/hooks/useSelectedProducts';
import useModalState from '@/hooks/useModalState';
import CurrentConsumptionModal from './orders/CurrentConsumptionModal';

function TakeOrder() {
    const { data: productsData, fetchProducts } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState("all");

    const {
        selectedProducts,
        addProduct,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        clearOrder,
        totalProducts,
        totalPrice,
    } = useSelectedProducts();

    const openModal = useModalState();

    useEffect(() => {
        if (productsData.length === 0) {
            fetchProducts();
        }
    }, []);

    // Obtener categorías únicas
    const categories = useMemo(() => {
        const map = new Map();
        productsData.forEach((p) => {
            if (p.category) map.set(p.category.categoryId, p.category);
        });
        return Array.from(map.values());
    }, [productsData]);

    // Filtrar productos por categoría
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "all") return productsData;
        return productsData.filter(
            (p) => p.category.categoryId.toString() === selectedCategory
        );
    }, [selectedCategory, productsData]);

    return (
        <div className="flex gap-4 items-start">
            {/* 🔹 Tarjeta principal con productos */}
            <Card className="flex-[60%] p-4 overflow-auto">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="mb-4 flex flex-wrap gap-2">
                        <TabsTrigger value="all">Todos</TabsTrigger>

                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat.categoryId}
                                value={cat.categoryId.toString()}
                                style={{ borderBottomColor: cat.color }}
                            >
                                {cat.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div>
                    {filteredProducts.length === 0 && (
                        <p>No hay productos para mostrar.</p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredProducts.map((product: ProductResponse) => (
                            <div
                                key={product.productId}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => addProduct(product)}
                            >
                                <img
                                    src={`http://localhost:8080/${product.imageUrl}`}
                                    alt={product.name}
                                    className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                />

                                <p className="text-sm font-medium mt-2 text-center">
                                    {product.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Tarjeta de productos seleccionados */}
            <Card className="flex-[40%] p-4 overflow-hidden max-h-[550px]">
                {selectedProducts.length > 0 ? (
                    <>
                        {/* Consumo Actual */}
                        <div>
                            <Button className="w-full items-center" onClick={openModal.openModal}>
                                <NotepadText /> Ver Consumo Actual
                            </Button>
                        </div>

                        {/* Producto Totales */}
                        <div className="flex font-semibold border-b pb-2 justify-between items-center">
                            <div className="flex gap-2">
                                <ShoppingCart />
                                <h3>Pedidos</h3>
                            </div>
                            <span className="px-3 py-1 rounded bg-primary text-white">
                                {totalProducts}
                            </span>
                        </div>

                        {/* Tarjeta de Productos Seleccionados */}
                        <div
                            className={`space-y-6 ${selectedProducts.length >= 3 ? 'max-h-[400px] overflow-y-scroll' : ''
                                }`}
                        >
                            {selectedProducts.map((item) => (
                                <div
                                    key={item.product.productId}
                                    className="pb-4 flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg"
                                >
                                    {/* Barra de color en el contorno izquierdo */}
                                    <div className="w-4 h-full bg-primary rounded-l-xl" />

                                    <div className="flex flex-col justify-center flex-1">
                                        <h3 className="font-semibold">{item.product.name}</h3>
                                        <p className="flex items-center gap-1">
                                            <BadgeCheck size={14} strokeWidth={3} color="#fcc800" />{' '}
                                            {item.product.category.name}
                                        </p>
                                    </div>

                                    {/* Controles de cantidad + eliminar */}
                                    <div className="flex gap-1 items-center">
                                        <div className="flex items-center gap-2">
                                            <p className="text-md font-semibold text-primary">
                                                {new Intl.NumberFormat('es-MX', {
                                                    style: 'currency',
                                                    currency: 'MXN',
                                                }).format(item.product.price * item.quantity)}
                                            </p>
                                            <Button
                                                className="px-3"
                                                onClick={() => decreaseQuantity(item.product.productId)}
                                            >
                                                -
                                            </Button>
                                            <span className="px-3 py-1 rounded">{item.quantity}</span>
                                            <Button
                                                className="px-3"
                                                onClick={() => increaseQuantity(item.product.productId)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <Button
                                            className="px-3"
                                            variant="destructive"
                                            onClick={() => removeProduct(item.product.productId)}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="pt-4 flex justify-between items-center border-t">
                            <p className="text-lg font-semibold">Total:</p>
                            <p className="text-xl font-bold text-primary">
                                {new Intl.NumberFormat('es-Mx', {
                                    style: 'currency',
                                    currency: 'MXN',
                                }).format(totalPrice)}
                            </p>
                        </div>

                        {/* Botones Formulario */}
                        <div className="block space-y-2">
                            <Button className="w-full bg-green-500 text-white hover:bg-green-400">
                                <Send /> Enviar a Cocina
                            </Button>
                            <Button
                                onClick={() => clearOrder(filteredProducts)}
                                className="text-white w-full"
                                variant="destructive"
                            >
                                <Trash /> Limpiar Pedido
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-[40%] p-4 flex items-center justify-center">
                        <p className="text-gray-500 text-center">No hay productos seleccionados.</p>
                    </div>
                )}
            </Card>

            <CurrentConsumptionModal
                open={openModal.open}
                onClose={openModal.closeModal}
                consumptionDetails={selectedProducts}
            />

        </div>
    );
}

export default TakeOrder;
