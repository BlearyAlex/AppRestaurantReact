import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProductSchema, updateProductSchema, type CreateProductForm, type UpdateProductForm } from "../schemas/productSchema";

type ProductFormValues = CreateProductForm | UpdateProductForm;

const useProductForm = (isEdit: boolean, initialValues: Partial<ProductFormValues>) => {
    const schema = isEdit ? updateProductSchema : createProductSchema;
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<ProductFormValues>({
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