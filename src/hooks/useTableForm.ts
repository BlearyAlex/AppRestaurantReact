import { createTableSchema, updateTableSchema, type CreateTableForm, type UpdateTableForm } from "@/schemas/tableSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const useTableForm = (isEdit: boolean, initialValues: any) => {
    const schema = isEdit ? updateTableSchema : createTableSchema;
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CreateTableForm | UpdateTableForm>({
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

export default useTableForm;