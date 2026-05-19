import useTableForm from '../hooks/useTableForm';
import useAuthStore from '@/features/auth/store/authStore';
import type { TableResponse, UpdateTableDto } from '../types/table';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TableForm from './TableForm';
import type { UpdateTableForm } from '../schemas/tableSchema';

interface TableEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: UpdateTableDto) => Promise<void>;
    submitting: boolean;
    tableToEdit: TableResponse | null;
}

function TableEditDialog({
    open,
    onClose,
    onSubmit,
    submitting,
    tableToEdit
}: TableEditDialogProps) {
    const { selectedRestaurantId } = useAuthStore();

    const { register, handleSubmit, setValue, reset, errors } = useTableForm(true, {
        tableId: 0,
        name: "",
        seats: 0,
        location: "",
    });

    useEffect(() => {
        if (tableToEdit) {
            reset({
                tableId: tableToEdit.tableId,
                name: tableToEdit.name,
                seats: tableToEdit.seats,
                location: tableToEdit.location,
            });
        }
    }, [tableToEdit, reset]);

    const handleEditSubmit = async (values: UpdateTableForm) => {
        if (!selectedRestaurantId) {
            console.warn("No se puede editar producto sin restaurante seleccionado");
            return;
        }

        const payload: UpdateTableDto = {
            tableId: values.tableId,
            name: values.name,
            seats: values.seats,
            location: values.location,
        }

        try {
            await onSubmit(payload);
            onClose();
        } catch (error) {
            console.log(`Error al editar la mesa: ${error}`)
        }
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
                    onSubmit={handleEditSubmit as any}
                    submitting={submitting}
                    onCancel={onClose}
                    submitText="Guardar Cambios"
                />
            </DialogContent>
        </Dialog>
    )
}

export default TableEditDialog