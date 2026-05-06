import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CashRegisterSessionResponse } from "../../types/cashRegister";


type Props = {
    register: CashRegisterSessionResponse;
    onClose: (id: number) => void;
};

const fmt = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export default function CashRegisterSessionCard({ register, onClose }: Props) {
    const isOpen = register.status === 'Open';

    return (
        <Card className={isOpen ? 'border-green-500 border' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                        <Landmark size={18} className="text-green-700" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-medium">
                            Caja #{register.cashRegisterId}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{register.openByName}</p>
                    </div>
                </div>
                <Badge variant={isOpen ? 'default' : 'secondary'}>
                    {isOpen ? 'Abierta' : 'Cerrada'}
                </Badge>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                        { label: 'Efectivo', value: register.totalCash },
                        { label: 'Tarjeta', value: register.totalCard },
                        { label: 'QR / Transf.', value: register.totalQr },
                        { label: 'Vales', value: register.totalVouchers },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-muted rounded-md px-3 py-2">
                            <p className="text-[10px] text-muted-foreground">{label}</p>
                            <p className="text-sm font-medium">{fmt(value)}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center border-t pt-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Gran total</p>
                        <p className="text-base font-semibold text-green-600">{fmt(register.grandTotal)}</p>
                    </div>
                    {isOpen && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onClose(register.cashRegisterId)}
                        >
                            Cerrar caja
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
