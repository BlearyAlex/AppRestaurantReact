import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CashRegisterResponse, OpenCashRegisterRequest } from "../../types/cashRegister";


type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (req: OpenCashRegisterRequest) => Promise<void>;
    cashRegisters: CashRegisterResponse[]; // ← lista de cajas activas
};

export default function CashRegisterSessionOpenDialog({ open, onClose, onSubmit, cashRegisters }: Props) {
    const [cashRegisterId, setCashRegisterId] = useState<number>(0);
    const [initialCash, setInitialCash] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!cashRegisterId) return;
        setSubmitting(true);
        try {
            await onSubmit({ cashRegisterId, initialCash });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Abrir caja registradora</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div>
                        <Label>Caja registradora</Label>
                        <select
                            className="w-full border rounded px-3 py-2 text-sm mt-1"
                            value={cashRegisterId}
                            onChange={e => setCashRegisterId(Number(e.target.value))}
                        >
                            <option value={0}>Selecciona una caja</option>
                            {cashRegisters.map(r => (
                                <option key={r.cashRegisterId} value={r.cashRegisterId}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label>Fondo inicial en efectivo</Label>
                        <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={initialCash}
                            onChange={e => setInitialCash(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={submitting || !cashRegisterId}>
                            {submitting ? 'Abriendo...' : 'Confirmar apertura'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}