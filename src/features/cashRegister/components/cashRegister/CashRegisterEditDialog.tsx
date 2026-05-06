import useAuthStore from "@/features/auth/store/authStore";
import type { CashRegisterResponse, EditCashRegisterRequest } from "../../types/cashRegister";

interface CashRegisterEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: EditCashRegisterRequest) => Promise<void>;
    submitting: boolean;
    setSubmitting: (value: boolean) => void;
    cashRegisterToEdit: CashRegisterResponse | null;
}

function CashRegisterEditDialog({
    open,
    onClose,
    onSubmit,
    submitting,
    setSubmitting,
    cashRegisterToEdit
}: CashRegisterEditDialogProps) {
     const { selectedRestaurantId } = useAuthStore();

}