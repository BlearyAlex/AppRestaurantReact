import { useState } from 'react';
import { getProductColumns } from './products-columns';
import { DataTableBase } from '@/components/shared/DataTableBase';
import { Spinner } from '@/components/ui/spinner';
import { IconPlus } from "@tabler/icons-react";
import useModalState from '@/hooks/useModalState';
import ProductCreateDialog from './ProductCreateDialog';
import type { ProductResponse } from '../types/product';
import ProductEditDialog from './ProductEditDialog';
import ProductDeleteDialog from './ProductDeleteDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from '../hooks/useProducts';

function ProductsTable() {
    const [productToEdit, setProductToEdit] = useState<ProductResponse | null>(null);
    const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);

    const { data = [], isLoading, error } = useProducts();

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();

    if (isLoading) {
        return <Spinner className='size-8 text-primary' />;
    }

    if (error) {
        return <div>Error al cargar productos.</div>;
    }

    const handleEdit = (product: ProductResponse) => {
        setProductToEdit(product);
        editModal.openModal();
    };

    const handleDelete = (product: ProductResponse) => {
        setProductToDelete(product);
        deleteModal.openModal();
    };

    const handleCreate = async (data: any) => {
        await toast.promise(
            createMutation.mutateAsync(data),
            {
                loading: "Creando producto...",
                success: "Producto creado",
                error: "Error al crear producto",
            }
        );

        createModal.closeModal();
    }

    const handleUpdate = async (data: any) => {
        await toast.promise(
            updateMutation.mutateAsync(data),
            {
                loading: "Actualizando producto...",
                success: "Producto actualizado",
                error: "Error al actualizar producto",
            }
        );

        editModal.closeModal();
    }

    const handleConfirmDelete = async (id: number) => {
        await toast.promise(
            deleteMutation.mutateAsync(id),
            {
                loading: "Eliminando producto...",
                success: "Producto eliminado",
                error: "Error al eliminar producto",
            }
        );

        deleteModal.closeModal();
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

            <ProductCreateDialog
                open={createModal.open}
                onClose={createModal.closeModal}
                onSubmit={handleCreate}
                submitting={createMutation.isPending}
            />

            <ProductEditDialog
                open={editModal.open}
                onClose={editModal.closeModal}
                onSubmit={handleUpdate}
                submitting={updateMutation.isPending}
                productToEdit={productToEdit}
            />


            <ProductDeleteDialog
                open={deleteModal.open}
                onClose={deleteModal.closeModal}
                onConfirm={() => handleConfirmDelete(productToDelete!.productId)}
                submitting={deleteMutation.isPending}
                productToDelete={productToDelete}
            />
        </div>
    )
}

export default ProductsTable;