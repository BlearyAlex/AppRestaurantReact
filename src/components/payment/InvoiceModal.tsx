import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';
import type {InvoiceResponse} from "@/types/payment";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    '1': 'Efectivo',
    '2': 'Tarjeta',
    '3': 'QR',
    '4': 'Vales',
};

interface InvoiceModalProps {
    invoice: InvoiceResponse | null;
    onClose: () => void;
}

function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt size={20} className="text-primary" />
                        Factura de pago
                    </DialogTitle>
                </DialogHeader>

                {!invoice ? (
                    <p className="text-center text-muted-foreground py-8">Cargando factura...</p>
                ) : (
                    <div className="space-y-4 py-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Folio</span>
                            <Badge variant="secondary" className="font-mono">{invoice.folio}</Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Fecha</span>
                            <span>{new Date(invoice.fecha).toLocaleString('es-MX')}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Método de pago</span>
                            <span>{PAYMENT_METHOD_LABELS[invoice.paymentMethod] ?? invoice.paymentMethod}</span>
                        </div>

                        {invoice.clientRFC && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">RFC</span>
                                <span className="font-mono">{invoice.clientRFC}</span>
                            </div>
                        )}

                        <Separator />

                        {invoice.tipAmount > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Propina</span>
                                <span>${invoice.tipAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${invoice.total.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default InvoiceModal;