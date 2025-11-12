import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

function TableDeleteDialog({  open, onClose, onConfirm, submitting, setSubmitting, tableToDelete }: any) {
    const confirmDelete = async () => {
        setSubmitting(true);
        await onConfirm(tableToDelete?.tableId);
        setSubmitting(false);
        onClose();
    }

  return (
    <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar mesa</DialogTitle>
                    <DialogDescription>
                        ¿Seguro que deseas eliminar{" "}
                        {tableToDelete ? `"${tableToDelete.name}"` : "esta mesa"}?
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

export default TableDeleteDialog