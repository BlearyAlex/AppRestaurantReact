import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import CategoryForm from './CategoryForm';
import useCategoryForm from '@/hooks/useCategoryForm';
import type { CategoryResponse } from '@/types/category';
import { useEffect } from 'react';

function CategoryEditDialog({ open, onClose, onSubmit, submitting, setSubmitting, categoryToEdit }: { open: boolean, onClose: () => void, onSubmit: (values: any) => void, submitting: boolean, setSubmitting: (value: boolean) => void, categoryToEdit: CategoryResponse | null }) {
    const { register, handleSubmit, setValue, reset, errors, watch } = useCategoryForm(true, { categoryId: 0, name: "", color: "#ff5733" });

    useEffect(() => {
        if (categoryToEdit) {
            reset({
                categoryId: categoryToEdit.categoryId,
                name: categoryToEdit.name,
                color: categoryToEdit.color
            });
        }
    }, [categoryToEdit]);

    const handleEditSubmit = async (values: any) => {
        setSubmitting(true);
        await onSubmit(values);
        setSubmitting(false);
        onClose();
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Categoría</DialogTitle>
                    <DialogDescription>Actualiza la información de la categoría.</DialogDescription>
                </DialogHeader>
                <CategoryForm
                    register={register}
                    handleSubmit={handleSubmit}
                    setValue={setValue}
                    errors={errors}
                    watch={watch}
                    onSubmit={handleEditSubmit}
                    submitting={submitting}
                    onCancel={onClose}
                    submitText="Guardar Cambios"
                />
            </DialogContent>
        </Dialog>
    )
}

export default CategoryEditDialog