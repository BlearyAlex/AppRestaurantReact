import { zodResolver } from "@hookform/resolvers/zod";
import { createCashRegisterSchema, updateCashRegisterSchema, type CreateCashRegisterForm, type UpdateCashRegisterForm } from "../schemas/cashRegisterSchema";
import { useForm } from "react-hook-form";

const useCashRegisterForm = (isEdit: boolean, initialValues: any) => {
    const schema = isEdit ? updateCashRegisterSchema : createCashRegisterSchema;
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CreateCashRegisterForm | UpdateCashRegisterForm>({
        resolver: zodResolver(schema) as any,
        defaultValues: initialValues
    });

    return {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        errors
    }
} 

export default useCashRegisterForm;