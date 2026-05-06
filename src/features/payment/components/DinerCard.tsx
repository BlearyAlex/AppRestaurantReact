// src/features/payment/components/shared/DinerCard.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2, Clock, User, Receipt,
    Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {BillSplitResponse} from "@/features/payment/types/payment";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    '1': 'Efectivo',
    '2': 'Tarjeta',
    '3': 'QR',
    '4': 'Vales',
};

interface DinerCardProps {
    split: BillSplitResponse;
    onPay: (split: BillSplitResponse, amountPaid: number) => Promise<void>;
    onViewInvoice: (billSplitId: number) => Promise<void>;
    isLoading: boolean;
}

function DinerCard({ split, onPay, onViewInvoice, isLoading }: DinerCardProps) {
    const totalDue = split.amountToPay + split.tipAmount;

    const [amountPaid, setAmountPaid] = useState<string>(totalDue.toFixed(2));
    const [isPaying, setIsPaying]     = useState(false);
    const [showItems, setShowItems]   = useState(false);

    const handlePay = async () => {
        setIsPaying(true);
        try {
            await onPay(split, Number(amountPaid));
        } finally {
            setIsPaying(false);
        }
    };

    const isCash    = split.paymentMethod === '1';
    const change    = Number(amountPaid) - totalDue;

    return (
        <Card className={cn(
            'transition-all duration-300 border-2',
            split.isPaid ? 'border-green-200 bg-green-50/50 dark:bg-green-950/10' : 'border-border'
        )}>
            {/* Header */}
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span>
                            {split.dinerLabel
                                ? `${split.dinerLabel} (Comensal ${split.dinerNumber})`
                                : `Comensal ${split.dinerNumber}`
                            }
                        </span>
                    </div>
                    {split.isPaid
                        ? <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30">
                            <CheckCircle2 size={12} className="mr-1" /> Pagado
                        </Badge>
                        : <Badge variant="outline" className="text-amber-600 border-amber-300">
                            <Clock size={12} className="mr-1" /> Pendiente
                        </Badge>
                    }
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Info del split */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-muted-foreground">Método</span>
                        <p className="font-medium">{PAYMENT_METHOD_LABELS[split.paymentMethod] ?? split.paymentMethod}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">División</span>
                        <p className="font-medium">{split.splitType}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Subtotal</span>
                        <p className="font-medium">${split.amountToPay.toFixed(2)}</p>
                    </div>
                    {split.tipAmount > 0 && (
                        <div>
                            <span className="text-muted-foreground">Propina</span>
                            <p className="font-medium">${split.tipAmount.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="flex items-center justify-between font-bold">
                    <span>Total a cobrar</span>
                    <span className="text-lg">${totalDue.toFixed(2)}</span>
                </div>

                {/* Items colapsables */}
                {split.items && split.items.length > 0 && (
                    <div>
                        <button
                            onClick={() => setShowItems(v => !v)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showItems ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {showItems ? 'Ocultar productos' : 'Ver productos'}
                        </button>
                        {showItems && (
                            <div className="mt-2 space-y-1">
                                {split.items.map(item => (
                                    <div key={item.orderDetailId} className="flex justify-between text-xs text-muted-foreground">
                                        <span>{item.quantity}x {item.productName}</span>
                                        <span>${item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Zona de cobro o confirmación */}
                {split.isPaid ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Pagado con</span>
                            <span>${split.amountPaid?.toFixed(2)}</span>
                        </div>
                        {split.change !== undefined && split.change > 0 && (
                            <div className="flex justify-between text-sm font-medium text-green-600">
                                <span>Cambio</span>
                                <span>${split.change.toFixed(2)}</span>
                            </div>
                        )}
                        {split.hasInvoice && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 mt-1"
                                onClick={() => onViewInvoice(split.billSplitId)}
                            >
                                <Receipt size={14} />
                                Ver factura
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 pt-1">
                        {/* Monto recibido — solo editable en efectivo */}
                        {isCash && (
                            <div className="space-y-1">
                                <Label className="text-xs">Monto recibido ($)</Label>
                                <Input
                                    type="number"
                                    min={totalDue}
                                    step={0.50}
                                    value={amountPaid}
                                    onChange={e => setAmountPaid(e.target.value)}
                                    className="h-9"
                                />
                                {change > 0 && (
                                    <p className="text-xs text-green-600 font-medium">
                                        Cambio: ${change.toFixed(2)}
                                    </p>
                                )}
                                {change < 0 && (
                                    <p className="text-xs text-destructive font-medium">
                                        Monto insuficiente
                                    </p>
                                )}
                            </div>
                        )}

                        <Button
                            className="w-full gap-2"
                            onClick={handlePay}
                            disabled={isPaying || isLoading || (isCash && change < 0)}
                        >
                            {isPaying
                                ? <><Loader2 size={16} className="animate-spin" /> Procesando...</>
                                : <>Cobrar ${totalDue.toFixed(2)}</>
                            }
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default DinerCard;