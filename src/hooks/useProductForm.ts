import { createProductSchema, updateProductSchema, type CreateProductForm, type UpdateProductForm } from "@/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const useProductForm = (isEdit: boolean, initialValues: any) => {
    const schema = isEdit ? updateProductSchema : createProductSchema;
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CreateProductForm | UpdateProductForm>({
        resolver: zodResolver(schema) as any,
        defaultValues: initialValues
    });

    return {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        errors,
    }
}

export default useProductForm;