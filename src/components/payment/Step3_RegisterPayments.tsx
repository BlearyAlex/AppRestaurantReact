import {useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {CheckCircle2} from 'lucide-react';
import {useNavigate} from 'react-router';
import {usePaymentStore} from "@/store/paymentStore.ts";
import type {BillSplitResponse} from "@/types/payment";
import InvoiceModal from "@/components/payment/InvoiceModal.tsx";
import DinerCard from "@/components/payment/DinerCard.tsx";

function Step3_RegisterPayments() {
    const navigate = useNavigate();
    const {billStatus, registerPayment, fetchInvoice, invoices, isLoading} = usePaymentStore();

    const [invoiceModalSplitId, setInvoiceModalSplitId] = useState<number | null>(null);

    if (!billStatus) return null;

    const {splits, subtotal, totalTips, grandTotal, totalPaid, pending, isFullyPaid} = billStatus;

    const handlePay = async (split: BillSplitResponse, amountPaid: number) => {
        await registerPayment(split.billSplitId, amountPaid);
    };

    const handleViewInvoice = async (billSplitId: number) => {
        if (!invoices[billSplitId]) {
            await fetchInvoice(billSplitId);
        }
        setInvoiceModalSplitId(billSplitId);
    };

    const handleFinish = () => {
        navigate('/dashboard');
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Registrar pagos</h2>
                    <p className="text-sm text-muted-foreground">
                        {splits.filter(s => s.isPaid).length} de {splits.length} comensales han pagado
                    </p>
                </div>
                {isFullyPaid && (
                    <div
                        className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                        <CheckCircle2 size={18}/>
                        Mesa cerrada
                    </div>
                )}
            </div>

            {/* Resumen financiero */}
            <Card>
                <CardContent className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {totalTips > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                            <span>Propinas</span>
                            <span>${totalTips.toFixed(2)}</span>
                        </div>
                    )}
                    <Separator/>
                    <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Pagado</span>
                        <span>${totalPaid.toFixed(2)}</span>
                    </div>
                    {pending > 0 && (
                        <div className="flex justify-between text-amber-600 font-medium">
                            <span>Pendiente</span>
                            <span>${pending.toFixed(2)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cards de comensales */}
            <div className="space-y-4">
                {splits.map((split) => (
                    <DinerCard
                        key={split.billSplitId}
                        split={split}
                        onPay={handlePay}
                        onViewInvoice={handleViewInvoice}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            {/* Botón de cierre */}
            {isFullyPaid && (
                <div className="flex justify-center pt-4">
                    <Button onClick={handleFinish} size="lg" className="gap-2 px-12">
                        <CheckCircle2 size={18}/>
                        Finalizar y cerrar
                    </Button>
                </div>
            )}

            {/* Modal de factura */}
            {invoiceModalSplitId !== null && (
                <InvoiceModal
                    invoice={invoices[invoiceModalSplitId] ?? null}
                    onClose={() => setInvoiceModalSplitId(null)}
                />
            )}
        </div>
    );
}

export default Step3_RegisterPayments;