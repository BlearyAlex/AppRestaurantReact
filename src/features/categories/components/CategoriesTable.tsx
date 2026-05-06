import { useState } from 'react';
import { getCategoryColumns } from './categories-columns';
import { DataTableBase } from '@/components/shared/DataTableBase';
import { Spinner } from '@/components/ui/spinner';
import { IconPlus } from "@tabler/icons-react";
import useModalState from '@/hooks/useModalState';
import CategoryCreateDialog from './CategoryCreateDialog';
import CategoryEditDialog from './CategoryEditDialog';
import CategoryDeleteDialog from './CategoryDeleteDialog';
import type { CategoryResponse } from '../types/category';
import { Button } from '@/components/ui/button';
import {useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory} from "@/features/categories/hooks/useCategories.ts";
import {toast} from "sonner";

function CategoriesTable() {
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);

    // Queries
    const { data = [], isLoading, error } = useCategories();

    // Mutations
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();

    if (isLoading) {
        return <Spinner className='size-8 text-primary' />;
    }

    if (error) {
        return <div>Error al cargar categorías</div>;
    }

    // Handlers
    const handleEdit = (category: CategoryResponse) => {
        setCategoryToEdit(category);
        editModal.openModal();
    };

    const handleDelete = (category: CategoryResponse) => {
        setCategoryToDelete(category);
        deleteModal.openModal();
    };

    const handleCreate = async (data: any) => {
        await toast.promise(
            createMutation.mutateAsync(data),
            {
                loading: "Creando categoría...",
                success: "Categoría creada",
                error: "Error al crear categoría",
            }
        );
        createModal.closeModal();
    };

    const handleUpdate = async (data: any) => {
        await toast.promise(
            updateMutation.mutateAsync(data),
            {
                loading: "Actualizando categoría...",
                success: "Categoría actualizada",
                error: "Error al actualizar",
            }
        );
        editModal.closeModal();
    };

    const handleConfirmDelete = async (id: number) => {
        await toast.promise(
            deleteMutation.mutateAsync(id),
            {
                loading: "Eliminando...",
                success: "Eliminado",
                error: "Error al eliminar",
            }
        );
        deleteModal.closeModal();
    };

    return (
        <div className="p-6">
            <DataTableBase
                columns={getCategoryColumns({
                    onEdit: handleEdit,
                    onDelete: handleDelete,
                })}
                data={data}
                filterColumn="name"
                filterPlaceholder="Buscar Categoria..."
                toolbarActions={
                    <Button variant="outline" size="sm" onClick={createModal.openModal}>
                        <IconPlus />
                        <span className="hidden lg:inline">Agregar Categoria</span>
                    </Button>
                }
            />

            <CategoryCreateDialog
                open={createModal.open}
                onClose={createModal.closeModal}
                onSubmit={handleCreate}
                submitting={createMutation.isPending}
            />

            <CategoryEditDialog
                open={editModal.open}
                onClose={editModal.closeModal}
                onSubmit={handleUpdate}
                submitting={updateMutation.isPending}
                categoryToEdit={categoryToEdit}
            />

            <CategoryDeleteDialog
                open={deleteModal.open}
                onClose={deleteModal.closeModal}
                onConfirm={() => handleConfirmDelete(categoryToDelete!.categoryId)}
                submitting={deleteMutation.isPending}
                categoryToDelete={categoryToDelete}
            />
        </div>
    )
}

export default CategoriesTable