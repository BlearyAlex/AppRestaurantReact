import { createCategorySchema, updateCategorySchema, type CreateCategoryForm, type UpdateCategoryForm } from "@/schemas/categorySchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const useCategoryForm = (isEdit: boolean, initialValues: any) => {
    const schema = isEdit ? updateCategorySchema : createCategorySchema;
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CreateCategoryForm | UpdateCategoryForm>({
        resolver: zodResolver(schema) as any,
        defaultValues: initialValues,
    });

    return {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        errors
    };
};

export default useCategoryForm;