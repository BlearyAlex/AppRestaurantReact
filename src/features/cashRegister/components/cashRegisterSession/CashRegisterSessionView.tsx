import useModalState from '@/hooks/useModalState';
import CashRegisterCard from './CashRegisterSessionCard';
import CashRegisterOpenDialog from './CashRegisterSessionOpenDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { IconPlus } from '@tabler/icons-react';
import { Landmark } from 'lucide-react';
import {useEffect, useState} from 'react';
import type { CashRegisterResponse } from '../../types/cashRegister';
import useCashRegisterSession from '../../hooks/useCashRegisterSession';

const fmt = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export default function CashRegisterSessionView() {
    const openModal = useModalState();
    const { dataList, loading, error, fetchCashRegisterSession, openCashRegister, closeCashRegister } = useCashRegisterSession();
    const [cashRegisters, setCashRegisters] = useState<CashRegisterResponse[]>([]);

    useEffect(() => {
        fetchCashRegisterSession();
    }, []);

    const list = Array.isArray(dataList) ? dataList : [];
    const totalCash  = list.reduce((a, r) => a + r.totalCash, 0);
    const totalCard  = list.reduce((a, r) => a + r.totalCard, 0);
    const grandTotal = list.reduce((a, r) => a + r.grandTotal, 0);
    const openCount  = list.filter(r => r.status === 'Open').length;

    if (loading) return <Spinner className="size-8 text-primary" />;
    if (error)   return <div>{error}</div>;

    return (
        <>
            {/* Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Cajas abiertas', value: openCount, green: true },
                    { label: 'Total efectivo', value: fmt(totalCash) },
                    { label: 'Total tarjeta',  value: fmt(totalCard) },
                    { label: 'Gran total hoy', value: fmt(grandTotal), green: true },
                ].map(({ label, value, green }) => (
                    <div key={label} className="bg-muted rounded-lg px-4 py-3">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className={`text-xl font-medium ${green ? 'text-green-600' : ''}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Botón abrir */}
            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={openModal.openModal}>
                    <IconPlus /> <span className="hidden lg:inline">Abrir Caja</span>
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Cajas Registradoras</CardTitle></CardHeader>
                <CardContent>
                    {dataList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dataList.map(r => (
                                <CashRegisterCard
                                    key={r.sessionId}
                                    register={r}
                                    onClose={() => closeCashRegister(r.sessionId)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-12 text-muted-foreground gap-3">
                            <Landmark size={36} />
                            <p className="text-sm">No hay cajas registradas</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <CashRegisterOpenDialog
                open={openModal.open}
                onClose={openModal.closeModal}
                onSubmit={openCashRegister}
                cashRegisters={cashRegisters}
            />
        </>
    );
}