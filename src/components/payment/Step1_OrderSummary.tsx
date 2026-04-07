// src/features/payment/components/steps/Step1_OrderSummary.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import PaymentService from "@/api/paymentService.ts";
import {usePaymentStore} from "@/store/paymentStore.ts";

const paymentService = new PaymentService();

// Tipos locales para mostrar órdenes antes de consolidar
interface OrderDetailPreview {
    orderDetailId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface OrderPreview {
    orderId: number;
    details: OrderDetailPreview[];
    subtotal: number;
}

function Step1_OrderSummary() {
    const { tableId, setStep } = usePaymentStore();

    const [orders, setOrders]     = useState<OrderPreview[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError]       = useState<string | null>(null);

    // Cargar órdenes Delivered de la mesa
    useEffect(() => {
        if (!tableId) return;
        fetchOrders();
    }, [tableId]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentService.getDeliveredOrdersByTable(tableId!);
            // extraemos el arreglo de órdenes
            setOrders(response.data.orders);
        } catch {
            setError('No se pudieron cargar las órdenes de esta mesa.');
        } finally {
            setLoading(false);
        }
    };

    const grandTotal = orders.reduce((acc, o) => acc + o.subtotal, 0);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Loader2 className="animate-spin" size={32} />
            <p>Cargando órdenes de la mesa...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-destructive">
            <AlertCircle size={32} />
            <p>{error}</p>
            <Button variant="outline" onClick={fetchOrders}>Reintentar</Button>
        </div>
    );

    if (!orders.length) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <ShoppingBag size={32} />
            <p>No hay órdenes entregadas pendientes de pago.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Resumen de cuenta</h2>
                <p className="text-sm text-muted-foreground">
                    {orders.length} {orders.length === 1 ? 'orden entregada' : 'órdenes entregadas'} pendientes de pago
                </p>
            </div>

            {/* Órdenes */}
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.orderId}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={16} className="text-muted-foreground" />
                                    Orden #{order.orderId}
                                </div>
                                <Badge variant="secondary">
                                    Entregada
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {order.details.map((detail) => (
                                <div
                                    key={detail.orderDetailId}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground w-5 text-center">
                                            {detail.quantity}x
                                        </span>
                                        <span>{detail.productName}</span>
                                    </div>
                                    <span className="font-medium">
                                        ${detail.subtotal.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <Separator className="my-2" />
                            <div className="flex justify-between text-sm font-semibold">
                                <span>Subtotal orden</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Total consolidado */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total consolidado</p>
                            <p className="text-3xl font-bold text-primary">${grandTotal.toFixed(2)}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            <p>{orders.reduce((acc, o) => acc + o.details.length, 0)} productos</p>
                            <p>{orders.length} órdenes</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Acción */}
            <div className="flex justify-end">
                <Button onClick={() => setStep(2)} className="gap-2">
                    Configurar pago
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
}

export default Step1_OrderSummary;