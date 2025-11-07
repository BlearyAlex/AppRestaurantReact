import { useEffect, useState } from 'react';
import { getCategoryColumns } from './categories-columns';
import { DataTableBase } from '../DataTableBase';
import { Spinner } from '../ui/spinner';
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import useCategories from '@/hooks/useCategories';
import useModalState from '@/hooks/useModalState';
import CategoryCreateDialog from './CategoryCreateDialog';
import CategoryEditDialog from './CategoryEditDialog';
import CategoryDeleteDialog from './CategoryDeleteDialog';
import type { CategoryResponse } from '@/types/category';

function CategoriesTable() {
    const [submitting, setSubmitting] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);

    // Usamos el hook para manejar categorías
    const {
        data,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchCategories
    } = useCategories();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();

    // Cargar las categorías al inicio
    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return <div>
            <Spinner className='size-8 text-primary' />
        </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = (category: CategoryResponse) => {
        setCategoryToEdit(category);
        editModal.openModal();
    };

    const handleDelete = (category: CategoryResponse) => {
        setCategoryToDelete(category);
        deleteModal.openModal();
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
                onSubmit={createCategory}
                submitting={submitting}
                setSubmitting={setSubmitting}
            />

            <CategoryEditDialog
                open={editModal.open}
                onClose={editModal.closeModal}
                onSubmit={updateCategory}
                submitting={submitting}
                setSubmitting={setSubmitting}
                categoryToEdit={categoryToEdit}
            />

            <CategoryDeleteDialog
                open={deleteModal.open}
                onClose={deleteModal.closeModal}
                onConfirm={deleteCategory}
                submitting={submitting}
                setSubmitting={setSubmitting}
                categoryToDelete={categoryToDelete}
            />
        </div>
    )
}

export default CategoriesTable