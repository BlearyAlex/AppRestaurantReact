import { useEffect, useState } from 'react';
import { getProductColumns } from './products-columns';
import { DataTableBase } from '../DataTableBase';
import { Spinner } from '../ui/spinner';
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import useProducts from '@/hooks/useProducts';
import useModalState from '@/hooks/useModalState';
import ProductCreateDialog from './ProductCreateDialog';
import type { ProductResponse } from '@/types/product';
import ProductEditDialog from './ProductEditDialog';
import ProductDeleteDialog from './ProductDeleteDialog';

function ProductsTable() {
    const [submitting, setSubmitting] = useState(false);
    const [productToEdit, setProductToEdit] = useState<ProductResponse | null>(null);
    const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);

    const {
        data,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
    } = useProducts();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading && data.length === 0) {
        return <div>
            <Spinner className='size-8 text-primary' />
        </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = (product: ProductResponse) => {
        setProductToEdit(product);
        editModal.openModal();
    };

    const handleDelete = (product: ProductResponse) => {
        setProductToDelete(product);
        deleteModal.openModal();
    };

    return (
        <div className="p-6">
            <DataTableBase
                columns={getProductColumns({
                    onEdit: handleEdit,
                    onDelete: handleDelete,
                })}
                data={data}
                filterColumn="name"
                filterPlaceholder="Buscar Productos..."
                toolbarActions={
                    <Button variant="outline" size="sm" onClick={createModal.openModal}>
                        <IconPlus />
                        <span className="hidden lg:inline">Agregar Producto</span>
                    </Button>
                }
            />

            {/* Opcional: indicador sutil de recarga */}
            {loading && data.length > 0 && (
                <div className="flex justify-center mt-2">
                    <Spinner className='size-4 text-primary' />
                </div>
            )}

            <ProductCreateDialog
                open={createModal.open}
                onClose={createModal.closeModal}
                onSubmit={createProduct}
                submitting={submitting}
                setSubmitting={setSubmitting}
            />

            <ProductEditDialog
                open={editModal.open}
                onClose={editModal.closeModal}
                onSubmit={updateProduct}
                submitting={submitting}
                setSubmitting={setSubmitting}
                productToEdit={productToEdit}
            />

            <ProductDeleteDialog
                open={deleteModal.open}
                onClose={deleteModal.closeModal}
                onConfirm={deleteProduct}
                submitting={submitting}
                setSubmitting={setSubmitting}
                productToDelete={productToDelete}
            />
        </div>
    )
}

export default ProductsTable;