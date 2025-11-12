import useTableForm from '@/hooks/useTableForm';
import useAuthStore from '@/store/authStore'
import { useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import TableForm from './TableForm';

function TableCreateDialog({ open, onClose, onSubmit, submitting, setSubmitting }: any) {
    const { selectedRestaurantId } = useAuthStore();

    const { register, handleSubmit, setValue, watch, errors, reset } = useTableForm(false, {
        name: "",
        restaurantId: selectedRestaurantId || 0,
    });

    useEffect(() => {
        if (selectedRestaurantId) {
            setValue("restaurantId", selectedRestaurantId)
        }
    }, [selectedRestaurantId, setValue]);

    const handleFormSubmit = async (values: any) => {
        try {
            setSubmitting(true);

            const cleanedValues: any = {
                name: values.name,
                restaurantId: values.restaurantId,
            }

            await onSubmit(cleanedValues);
            onClose();
            reset();
        } catch (error) {
            console.log(`Error al crear la mesa: ${error}`)
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear una mesa</DialogTitle>
                    <DialogDescription>Crea una mesa nueva.</DialogDescription>
                </DialogHeader>
                <TableForm
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

export default TableCreateDialog