import type { ProductResponse } from "@/features/products/types/product";
import { useMemo, useState } from "react";

export type SelectedProduct = {
    product: ProductResponse;
    quantity: number;
    notes?: string;
};

export function useSelectedProducts() {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    const addProduct = (product: ProductResponse) => {
        setSelectedProducts((prev: any) => {
            const existing = prev.find((p: any) => p.product.productId === product.productId);

            if (existing) {
                return prev.map((p: any) =>
                    p.product.productId === product.productId
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const increaseQuantity = (productId: number) => {
        setSelectedProducts(prev =>
            prev.map(p =>
                p.product.productId === productId
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            )
        );
    };

    const decreaseQuantity = (productId: number) => {
        setSelectedProducts(prev =>
            prev.map(p =>
                p.product.productId === productId
                    ? { ...p, quantity: Math.max(1, p.quantity - 1) }
                    : p
            )
        );
    };

    const removeProduct = (productId: number) => {
        setSelectedProducts(prev =>
            prev.filter(p => p.product.productId !== productId)
        );
    };

    const totalProducts = useMemo(
        () => selectedProducts.reduce((sum, item) => sum + item.quantity, 0),
        [selectedProducts]
    );

    const totalPrice = useMemo(
        () =>
            selectedProducts.reduce(
                (sum, item) => sum + item.quantity * item.product.price,
                0
            ),
        [selectedProducts]
    );

    const clearOrder = (filteredProducts: ProductResponse[] = []) => {
        if (filteredProducts.length === 0) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(prev =>
                prev.filter(
                    p => !filteredProducts.some(fp => fp.productId === p.product.productId)
                )
            );
        }
    };

    const updateNotes = (productId: number, notes: string) => {
        setSelectedProducts(prev =>
            prev.map(p =>
                p.product.productId === productId
                    ? { ...p, notes }
                    : p
            )
        );
    };

    return {
        selectedProducts,
        addProduct,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        clearOrder,
        updateNotes,
        totalProducts,
        totalPrice
    };
}