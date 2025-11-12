import useTableForm from '@/hooks/useTableForm';
import useAuthStore from '@/store/authStore';
import type { TableResponse } from '@/types/table';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import TableForm from './TableForm';

function TableEditDialog({
    open,
    onClose,
    onSubmit,
    submitting,
    setSubmitting,
    tableToEdit
}: {
    open: boolean,
    onClose: () => void,
    onSubmit: (values: any) => void;
    submitting: boolean;
    setSubmitting: (value: boolean) => void;
    tableToEdit: TableResponse | null;
}) {
    const { selectedRestaurantId } = useAuthStore();

    const { register, handleSubmit, setValue, reset, errors, watch } = useTableForm(true, {
        tableId: 0,
        name: "",
        restaurantId: selectedRestaurantId || 0,
    });

    useEffect(() => {
        if (tableToEdit) {
            reset({
                tableId: tableToEdit.tableId,
                name: tableToEdit.name,
                restaurantId: tableToEdit.restaurantId || selectedRestaurantId || 0
            });
        }
    }, [tableToEdit, reset, selectedRestaurantId]);

    useEffect(() => {
        if (selectedRestaurantId) {
            setValue("restaurantId", selectedRestaurantId);
        }
    }, [selectedRestaurantId, setValue]);

    const handleEditSubmit = async (values: any) => {
        setSubmitting(true);

        await onSubmit(values);
        setSubmitting(false);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Mesa</DialogTitle>
                    <DialogDescription>Actualiza la información de la mesa.</DialogDescription>
                </DialogHeader>
                <TableForm
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

export default TableEditDialog