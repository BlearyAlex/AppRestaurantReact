import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

function CategoryDeleteDialog({ open, onClose, onConfirm, submitting, setSubmitting, categoryToDelete }: any) {

    const confirmDelete = async () => {
        setSubmitting(true);
        await onConfirm(categoryToDelete?.categoryId);
        setSubmitting(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Eliminar categoría</DialogTitle>
                    <DialogDescription>
                        ¿Seguro que deseas eliminar{" "}
                        {categoryToDelete ? `"${categoryToDelete.name}"` : "esta categoría"}?
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={confirmDelete} disabled={submitting}>
                        {submitting ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryDeleteDialog