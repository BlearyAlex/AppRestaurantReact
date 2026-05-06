import useModalState from "@/hooks/useModalState";
import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Box, HandCoins } from "lucide-react";
import type { CashRegisterResponse } from "../../types/cashRegister";
import useCashRegisters from "../../hooks/useCashRegisters";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashRegisterCreateDialog from "./CashRegisterCreateDialog";

function CashRegisterCard() {
    const [submitting, setSubmitting] = useState(false);
    const [cashRegisterToEdit, setCashRegisterToEdit] = useState<CashRegisterResponse | null>(null);
    const [cashRegisterToDelete, setCashRegisterToDelete] = useState<CashRegisterResponse | null>(null);
    const [selectedCashRegister, setSelectedCashRegister] = useState<CashRegisterResponse | null>(null);

    const { data, loading, error, fetchCashRegisters, createCashRegister } = useCashRegisters();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();
    const actionsModal = useModalState();

    useEffect(() => {
        fetchCashRegisters();
    }, []);

    if (loading) {
        return (
            <div>
                <Spinner className="size-8 text-primary" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = (cashRegister: CashRegisterResponse) => {
        setCashRegisterToEdit(cashRegister);
        editModal.openModal();
    };

    const handleDelete = (cashRegister: CashRegisterResponse) => {
        setCashRegisterToDelete(cashRegister);
        deleteModal.openModal();
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={createModal.openModal}>
                    <IconPlus />
                    <span className="hidden lg:inline">Agregar Caja Registradora</span>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cajas Registradoras</CardTitle>
                </CardHeader>
                <CardContent>
                    {data && data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.map((cashRegister: CashRegisterResponse) => (
                                <Card key={cashRegister.cashRegisterId}>
                                    <CardHeader>
                                        <CardTitle>{cashRegister.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center">
                                        <HandCoins
                                            className={`hover:cursor-pointer ${cashRegister.isActive ? "text-green-500" : "text-red-500"}`}
                                        />

                                        <p className={`text-sm mb-2 font-semibold ${cashRegister.isActive ? "text-green-500" : "text-red-500"}`}>
                                            {cashRegister.isActive
                                                ? "Caja Activa"
                                                : "Caja Inactiva"}
                                        </p>

                                        <div className="flex gap-4">
                                            <p className="text-sm mb-4 font-semibold flex items-center gap-2">
                                                <Box size={20} className="text-primary" />{" "}
                                                {cashRegister.name}
                                            </p>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() => handleEdit(cashRegister)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(cashRegister)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p>Sin registros de cajas registradoras.</p>
                    )}
                </CardContent>
            </Card>

            <CashRegisterCreateDialog
                open={createModal.open}
                onClose={createModal.closeModal}
                onSubmit={createCashRegister}
                submitting={submitting}
                setSubmitting={setSubmitting}
            />
        </>
    );
}

export default CashRegisterCard;
