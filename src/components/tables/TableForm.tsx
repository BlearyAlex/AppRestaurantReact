import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DialogClose, DialogFooter } from '../ui/dialog'

function TableForm({
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    submitting,
    onCancel,
    submitText,
}: any) {

    // Convertir el valor del asiento a número
    const handleSeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setValue("seats", value, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Label htmlFor='name' className='mb-4'>Nombre</Label>
                <Input id='name' {...register("name")} className='mb-4' />
                {errors.name && (
                    <span className='text-xs text-red-500'>{errors.name.message}</span>
                )}

                <Label htmlFor='seats' className='mb-4'>Asientos</Label>
                <Input
                    id='seats' 
                    {...register("seats", { valueAsNumber: true })}
                    type='number'
                    onChange={handleSeatChange}
                    className='mb-4'
                />
                {errors.seats && (
                    <span className='text-xs text-red-500'>{errors.seats.message}</span>
                )}

                <Label htmlFor='location' className='mb-4'>Localizacion</Label>
                <Input id='location' {...register("location")} className='mb-4' />
                {errors.location && (
                    <span className='text-xs text-red-500'>{errors.location.message}</span>
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

export default TableForm