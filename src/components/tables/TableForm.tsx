import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DialogClose, DialogFooter } from '../ui/dialog'

function TableForm({
    register,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    onCancel,
    submitText,
}: any) {

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Label htmlFor='name' className='mb-4'>Nombre</Label>
                <Input id='name' {...register("name")} className='mb-4'/>
                {errors.name && (
                    <span className='text-xs text-red-500'>{errors.name.message}</span>
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