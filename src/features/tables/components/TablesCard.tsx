import useModalState from "@/hooks/useModalState";
import type { TableResponse } from "../types/table";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair, HandPlatter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import TableCreateDialog from "./TableCreateDialog";
import TableEditDialog from "./TableEditDialog";
import TableDeleteDialog from "./TableDeleteDialog";
import { useOrderStore } from "@/features/orders/store/orderStore";
import TableActionsModal from "./TableActionsModal";
import { toast } from "sonner";
import { useCreateTable, useDeleteTable, useTables, useUpdateTable } from "../hooks/useTables";

type TablesCardProps = {
    showCreate?: boolean;
    showActions?: boolean; // editar / eliminar
};

function TablesCard({
    showCreate = true,
    showActions = true,
}: TablesCardProps) {
    const [tableToEdit, setTableToEdit] = useState<TableResponse | null>(null);
    const [tableToDelete, setTableToDelete] = useState<TableResponse | null>(
        null,
    );
    const [selectedTable, setSelectedTable] = useState<TableResponse | null>(
        null,
    );

    const { data = [], isLoading, error } = useTables();

    const createMutation = useCreateTable();
    const updateMutation = useUpdateTable();
    const deleteMutation = useDeleteTable();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();
    const actionsModal = useModalState();

    const setTableId = useOrderStore((s) => s.setTableId);

    if (isLoading) {
        return <Spinner className="size-8 text-primary" />;
    }

    if (error) {
        return <div>Error al cargar productos.</div>;
    }

    const handleEdit = (table: TableResponse) => {
        setTableToEdit(table);
        editModal.openModal();
    };

    const handleDelete = (table: TableResponse) => {
        setTableToDelete(table);
        deleteModal.openModal();
    };

    const handleTableClick = (table: TableResponse) => {
        setTableId(table.tableId);
        setSelectedTable(table);
        actionsModal.openModal();
    };

    const handleCreate = async (data: any) => {
        await toast.promise(createMutation.mutateAsync(data), {
            loading: "Creando mesa...",
            success: "Mesa creada",
            error: "Error al crear mesa",
        });

        createModal.closeModal();
    };

    const handleUpdate = async (data: any) => {
        await toast.promise(updateMutation.mutateAsync(data), {
            loading: "Actualizando mesa...",
            success: "Mesa actualizada",
            error: "Error al actualizar mesa",
        });

        editModal.closeModal();
    };

    const handleConfirmDelete = async (id: number) => {
        await toast.promise(
            deleteMutation.mutateAsync(id),
            {
                loading: "Eliminando mesa...",
                success: "Mesa eliminada",
                error: "Error al eliminar mesa",
            }
        );

        deleteModal.closeModal();
    }

    return (
        <>
            {showCreate && (
                <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm" onClick={createModal.openModal}>
                        <IconPlus />
                        <span className="hidden lg:inline">Agregar Mesa</span>
                    </Button>
                </div>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Mesas</CardTitle>
                </CardHeader>
                <CardContent>
                    {data && data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.map((table: TableResponse) => (
                                <Card key={table.tableId}>
                                    <CardHeader>
                                        <CardTitle>{table.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center">
                                        <HandPlatter
                                            className={`hover:cursor-pointer ${table.isOccupied ? "text-red-500" : "text-green-500"}`}
                                            onClick={() => handleTableClick(table)}
                                        />

                                        <p
                                            className={`text-sm mb-2 font-semibold ${table.isOccupied ? "text-red-500" : "text-green-500"}`}
                                        >
                                            {table.isOccupied ? "Mesa Ocupada" : "Mesa Disponible"}
                                        </p>

                                        <div className="flex gap-4">
                                            <p className="text-sm mb-4 font-semibold flex items-center gap-2">
                                                <Armchair size={20} className="text-primary" />{" "}
                                                {table.seats}
                                            </p>

                                            <p className="text-sm mb-4 font-semibold flex items-center gap-2">
                                                <MapPin size={20} className="text-primary" />{" "}
                                                {table.location}
                                            </p>
                                        </div>

                                        {showActions && (
                                            <div className="flex gap-4">
                                                <Button
                                                    onClick={() => handleEdit(table)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(table)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p>Sin registros de mesas.</p>
                    )}
                </CardContent>
            </Card>

            <TableCreateDialog
                open={createModal.open}
                onClose={createModal.closeModal}
                onSubmit={handleCreate}
                submitting={createMutation.isPending}
            />

            <TableEditDialog
                open={editModal.open}
                onClose={editModal.closeModal}
                onSubmit={handleUpdate}
                submitting={updateMutation.isPending}
                tableToEdit={tableToEdit}
            />

            <TableDeleteDialog
                open={deleteModal.open}
                onClose={deleteModal.closeModal}
                onConfirm={() => handleConfirmDelete(tableToDelete!.tableId)}
                submitting={deleteMutation.isPending}
                tableToDelete={tableToDelete}
            />

            <TableActionsModal
                open={actionsModal.open}
                onClose={actionsModal.closeModal}
                tableId={selectedTable?.tableId ?? 0}
                tableName={selectedTable?.name ?? ""}
                tableStatus={selectedTable?.isOccupied ? "occupied" : "available"}
            />
        </>
    );
}

export default TablesCard;
