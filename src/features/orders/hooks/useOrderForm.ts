import { createOrderSchema, updateOrderSchema, type CreateOrderForm, type UpdateOrderForm } from "@/schemas/orderSchemas"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const useOrderForm = (isEdit: boolean, initialValues: any) => {
    const schema = isEdit ? updateOrderSchema : createOrderSchema;
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CreateOrderForm | UpdateOrderForm>({
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

export default useOrderForm;