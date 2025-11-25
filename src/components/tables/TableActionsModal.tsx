import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { FileText, Eye, CreditCard, RotateCcw, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TableActionsModalProps {
    open: boolean;
    onClose: () => void;
    tableId: number;
    tableName: string;
    tableStatus: "available" | "occupied";
}

function TableActionsModal({ open, onClose, tableId, tableName, tableStatus }: TableActionsModalProps) {
    const navigate = useNavigate();

    const handleCapture = () => {
        navigate(`/dashboard/orders/takeOrder`);
        onClose();
    };

    const handleConsult = () => {
        navigate(`/dashboard/orders/viewAccount`);
        onClose();
    };

    const handlePay = () => {
        navigate(`/dashboard/orders/pay/${tableId}`);
        onClose();
    };

    const handleReopen = () => {
        // TODO: Implementar lógica de reapertura
        console.log('Reabrir cuenta de mesa', tableId);
        onClose();
    };

    const isAvailable = tableStatus === 'available';
    const isOccupied = tableStatus === 'occupied';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UtensilsCrossed className="text-primary" size={24} />
                        Mesa {tableName}
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona una acción para esta mesa
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    {/* Capturar Orden */}
                    <Button
                        onClick={handleCapture}
                        className="w-full justify-start h-auto py-4 px-4"
                        variant="outline"
                    >
                        <div className="flex items-start gap-3 w-full">
                            <FileText className="text-green-600 mt-1" size={24} />
                            <div className="text-left flex-1">
                                <p className="font-semibold text-base">Capturar Orden</p>
                                <p className="text-sm text-muted-foreground font-normal">
                                    {isAvailable
                                        ? 'Crear nueva orden para esta mesa'
                                        : 'Agregar más productos a la cuenta'}
                                </p>
                            </div>
                        </div>
                    </Button>

                    {/* Consultar Cuenta */}
                    <Button
                        onClick={handleConsult}
                        className="w-full justify-start h-auto py-4 px-4"
                        variant="outline"
                        disabled={isAvailable}
                    >
                        <div className="flex items-start gap-3 w-full">
                            <Eye className={`mt-1 ${isAvailable ? 'text-gray-400' : 'text-blue-600'}`} size={24} />
                            <div className="text-left flex-1">
                                <p className="font-semibold text-base">Consultar Cuenta</p>
                                <p className="text-sm text-muted-foreground font-normal">
                                    Ver productos y total de la mesa
                                </p>
                            </div>
                        </div>
                    </Button>

                    {/* Pagar Cuenta */}
                    <Button
                        onClick={handlePay}
                        className="w-full justify-start h-auto py-4 px-4"
                        variant="outline"
                        disabled={isAvailable}
                    >
                        <div className="flex items-start gap-3 w-full">
                            <CreditCard className={`mt-1 ${isAvailable ? 'text-gray-400' : 'text-purple-600'}`} size={24} />
                            <div className="text-left flex-1">
                                <p className="font-semibold text-base">Pagar Cuenta</p>
                                <p className="text-sm text-muted-foreground font-normal">
                                    Procesar pago y cerrar mesa
                                </p>
                            </div>
                        </div>
                    </Button>

                    {/* Reabrir Cuenta */}
                    <Button
                        onClick={handleReopen}
                        className="w-full justify-start h-auto py-4 px-4"
                        variant="outline"
                        disabled={isOccupied || isAvailable}
                    >
                        <div className="flex items-start gap-3 w-full">
                            <RotateCcw className={`mt-1 ${(isOccupied || isAvailable) ? 'text-gray-400' : 'text-orange-600'}`} size={24} />
                            <div className="text-left flex-1">
                                <p className="font-semibold text-base">Reabrir Cuenta</p>
                                <p className="text-sm text-muted-foreground font-normal">
                                    Reactivar mesa recientemente cerrada
                                </p>
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default TableActionsModal;
