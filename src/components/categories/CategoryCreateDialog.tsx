import useCategoryForm from '@/hooks/useCategoryForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import CategoryForm from './CategoryForm';

function CategoryCreateDialog({ open, onClose, onSubmit, submitting, setSubmitting }: any) {
    const { register, handleSubmit, setValue, reset, errors, watch } = useCategoryForm(false, { name: "", color: "#ff5733" });

    const handleFormSubmit = async (values: any) => {
      setSubmitting(true);
      await onSubmit(values);
      setSubmitting(false);
      onClose();
      reset();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Crear Categoria</DialogTitle>
                    <DialogDescription>Crea una nueva categoria para tus productos.</DialogDescription>
                </DialogHeader>
                <CategoryForm
                    register={register}
                    handleSubmit={handleSubmit}
                    setValue={setValue}
                    errors={errors}
                    watch={watch}
                    onSubmit={handleFormSubmit}
                    submitting={submitting}
                    onCancel={onClose}
                    submitText="Guardar Cambios"
                />
            </DialogContent>
        </Dialog>
    )
}

export default CategoryCreateDialog