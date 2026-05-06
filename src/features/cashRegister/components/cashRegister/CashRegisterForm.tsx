import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type {
  CreateCashRegisterForm,
  UpdateCashRegisterForm,
} from "../../schemas/cashRegisterSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CashRegisterFormValues = CreateCashRegisterForm | UpdateCashRegisterForm;

interface CashRegisterFormProps {
  register: UseFormRegister<CashRegisterFormValues>;
  handleSubmit: UseFormHandleSubmit<CashRegisterFormValues>;
  errors: FieldErrors<CashRegisterFormValues>;
  setValue: UseFormSetValue<CashRegisterFormValues>;
  onSubmit: (values: CashRegisterFormValues) => void | Promise<void>;
  submitting: boolean;
  onCancel: () => void;
  submitText: string;
}

function CashRegisterForm({
  register,
  handleSubmit,
  errors,
  onSubmit,
  submitting,
  onCancel,
  submitText,
}: CashRegisterFormProps) {


     return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Label htmlFor='name' className='mb-4'>Nombre</Label>
                <Input id='name' {...register("name")} className='mb-4' />
                {errors.name && (
                    <span className='text-xs text-red-500'>{errors.name.message}</span>
                )}

                <Label htmlFor='description' className='mb-4'>Localizacion</Label>
                <Input id='description' {...register("description")} className='mb-4' />
                {errors.description && (
                    <span className='text-xs text-red-500'>{errors.description.message}</span>
                )}
            </div>
            
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : submitText}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default CashRegisterForm;