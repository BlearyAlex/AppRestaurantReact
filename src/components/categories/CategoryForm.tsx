import { Label } from '../ui/label'
import { Input } from '../ui/input'
import ColorPicker from '../ui/color-picker'
import { DialogClose, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'

function CategoryForm({
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    onSubmit,
    submitting,
    onCancel,
    submitText,
}: any) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="color">Color</Label>
          <ColorPicker
            value={watch("color")}
            onChange={(c) => setValue("color", c, { shouldValidate: true })}
          />
          {errors.color && (
            <span className="text-xs text-red-500">{errors.color.message}</span>
          )}
        </div>
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

export default CategoryForm