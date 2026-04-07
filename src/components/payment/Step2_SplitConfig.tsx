import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {AlertCircle, ChevronLeft, ChevronRight, CreditCard, List, Loader2, Sliders, Users} from 'lucide-react';
import {cn} from '@/lib/utils';
import {type SplitType, usePaymentStore} from "@/store/paymentStore.ts";
import type {DinerRequest} from "@/types/payment";
import {DinerConfigRow} from "@/components/payment/DinerConfigRow.tsx";

const SPLIT_OPTIONS: { type: SplitType; label: string; description: string; icon: React.ReactNode }[] = [
    {
        type: 'NoSplit',
        label: 'Cuenta completa',
        description: 'Un solo pago por el total',
        icon: <CreditCard size={20} />,
    },
    {
        type: 'Equal',
        label: 'Partes iguales',
        description: 'Dividir entre N comensales',
        icon: <Users size={20} />,
    },
    {
        type: 'ByItems',
        label: 'Por productos',
        description: 'Cada quien paga lo que pidió',
        icon: <List size={20} />,
    },
    {
        type: 'Custom',
        label: 'Personalizado',
        description: 'Definir montos manualmente',
        icon: <Sliders size={20} />,
    },
];

const PAYMENT_METHODS = [
    { id: 1, label: 'Efectivo' },
    { id: 2, label: 'Tarjeta' },
    { id: 3, label: 'QR' },
    { id: 4, label: 'Vales' },
];

function Step2_SplitConfig() {
    const {
        tableId, splitType, setSplitType,
        dinerCount, setDinerCount,
        initializeBill, setStep,
        isLoading, error,
    } = usePaymentStore();

    // Estado local para configuración de comensales
    const [diners, setDiners] = useState<DinerRequest[]>([
        { dinerNumber: 1, tipAmount: 0, paymentMethodId: 1 }
    ]);

    // Sincronizar comensales al cambiar tipo o cantidad
    const handleSplitTypeChange = (type: SplitType) => {
        setSplitType(type);
        if (type === 'NoSplit') {
            setDiners([{ dinerNumber: 1, tipAmount: 0, paymentMethodId: 1 }]);
        } else if (type === 'Equal') {
            rebuildDiners(dinerCount);
        }
    };

    const handleDinerCountChange = (count: number) => {
        const n = Math.max(2, Math.min(20, count));
        setDinerCount(n);
        rebuildDiners(n);
    };

    const rebuildDiners = (n: number) => {
        setDiners(Array.from({ length: n }, (_, i) => ({
            dinerNumber: i + 1,
            tipAmount: 0,
            paymentMethodId: 1,
        })));
    };

    const updateDiner = (index: number, patch: Partial<DinerRequest>) => {
        setDiners(prev => prev.map((d, i) => i === index ? { ...d, ...patch } : d));
    };

    const handleSubmit = async () => {
        await initializeBill({
            tableId: tableId!,
            splitType,
            dinerCount: splitType === 'Equal' ? dinerCount : undefined,
            diners: splitType === 'NoSplit' ? undefined : diners,
        });
        // El store avanza al paso 3 si todo sale bien
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div>
                <h2 className="text-lg font-semibold">Configurar división de cuenta</h2>
                <p className="text-sm text-muted-foreground">
                    Elige cómo quieres dividir el pago entre los comensales
                </p>
            </div>

            {/* Selector de tipo */}
            <div className="grid grid-cols-2 gap-3">
                {SPLIT_OPTIONS.map((option) => (
                    <button
                        key={option.type}
                        onClick={() => handleSplitTypeChange(option.type)}
                        className={cn(
                            'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all',
                            splitType === option.type
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/40'
                        )}
                    >
                        <span className={cn(
                            'mt-0.5',
                            splitType === option.type ? 'text-primary' : 'text-muted-foreground'
                        )}>
                            {option.icon}
                        </span>
                        <div>
                            <p className="font-semibold text-sm">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            <Separator />

            {/* Configuración dinámica según tipo */}

            {/* NoSplit */}
            {splitType === 'NoSplit' && (
                <DinerConfigRow
                    diner={diners[0]}
                    index={0}
                    onChange={updateDiner}
                    showLabel={false}
                />
            )}

            {/* Equal */}
            {splitType === 'Equal' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Label>Número de comensales</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline" size="icon"
                                onClick={() => handleDinerCountChange(dinerCount - 1)}
                                disabled={dinerCount <= 2}
                            >−</Button>
                            <span className="w-8 text-center font-bold">{dinerCount}</span>
                            <Button
                                variant="outline" size="icon"
                                onClick={() => handleDinerCountChange(dinerCount + 1)}
                            >+</Button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {diners.map((diner, idx) => (
                            <DinerConfigRow
                                key={diner.dinerNumber}
                                diner={diner}
                                index={idx}
                                onChange={updateDiner}
                                showLabel
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ByItems y Custom — aviso */}
            {(splitType === 'ByItems' || splitType === 'Custom') && (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-amber-800 dark:text-amber-400">
                            Configuración avanzada
                        </CardTitle>
                        <CardDescription className="text-amber-700 dark:text-amber-500">
                            {splitType === 'ByItems'
                                ? 'Cada comensal selecciona los productos que consumió. Podrás asignarlos en el siguiente paso.'
                                : 'Definirás el monto exacto de cada comensal en el siguiente paso.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Label>Número de comensales</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => handleDinerCountChange(dinerCount - 1)}
                                    disabled={dinerCount <= 2}
                                >−</Button>
                                <span className="w-8 text-center font-bold">{dinerCount}</span>
                                <Button
                                    variant="outline" size="icon"
                                    onClick={() => handleDinerCountChange(dinerCount + 1)}
                                >+</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    <p>{error}</p>
                </div>
            )}

            {/* Acciones */}
            <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                    <ChevronLeft size={16} />
                    Atrás
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                    {isLoading
                        ? <><Loader2 size={16} className="animate-spin" /> Inicializando...</>
                        : <>Inicializar cobro <ChevronRight size={16} /></>
                    }
                </Button>
            </div>
        </div>
    );
}

export default Step2_SplitConfig;