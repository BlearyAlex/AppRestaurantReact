import useTableForm from '@/hooks/useTableForm';
import useAuthStore from '@/store/authStore'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import TableForm from './TableForm';
import type { CreateTableForm } from "@/schemas/tableSchema.ts";
import type { CreateTableDto } from "@/types/table";

interface TableCreateDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateTableDto) => Promise<void>;
    submitting: boolean;
    setSubmitting: (value: boolean) => void;
}

function TableCreateDialog({ open, onClose, onSubmit, submitting, setSubmitting }: TableCreateDialogProps) {
    const { selectedRestaurantId } = useAuthStore();

    const { register, handleSubmit, setValue, errors, reset } = useTableForm(false, {
        name: "",
        seats: 0,
        location: "",
    });

    const handleFormSubmit = async (values: CreateTableForm) => {
        console.log("CLick")
        if (!selectedRestaurantId) {
            console.warn("No se puede crear producto sin restaurante seleccionado");
            return;
        }

        const payload: CreateTableDto = {
            name: values.name,
            seats: values.seats,
            location: values.location
        }

        try {
            setSubmitting(true);
            await onSubmit(payload);
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