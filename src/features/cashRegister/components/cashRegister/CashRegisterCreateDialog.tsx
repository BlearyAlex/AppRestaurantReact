import useAuthStore from "@/features/auth/store/authStore";
import type { CreateCashRegisterRequest } from "@/features/cashRegister/types/cashRegister";
import useCashRegisterForm from "../../hooks/useCashRegisterForm";
import type { CreateCashRegisterForm } from "../../schemas/cashRegisterSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import CashRegisterForm from "./CashRegisterForm";

interface CashRegisterCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCashRegisterRequest) => Promise<void>;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}

function CashRegisterCreateDialog({
  open,
  onClose,
  onSubmit,
  submitting,
  setSubmitting,
}: CashRegisterCreateDialogProps) {
  const { selectedRestaurantId } = useAuthStore();

  const { register, handleSubmit, setValue, errors, reset } =
    useCashRegisterForm(false, {
      name: "",
      description: "",
    });

  const handleFormSubmit = async (values: CreateCashRegisterForm) => {
    if (!selectedRestaurantId) {
      console.warn("No se puede crear producto sin restaurante seleccionado");
      return;
    }

    const payload: CreateCashRegisterRequest = {
      name: values.name,
      description: values.description,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      onClose();
      reset();
    } catch (error) {
      console.log(`Error al crear el registro de caja: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear un registro de caja</DialogTitle>
          <DialogDescription>Crea un registro de caja nuevo.</DialogDescription>
        </DialogHeader>
        <CashRegisterForm
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
  );
}

export default CashRegisterCreateDialog;
