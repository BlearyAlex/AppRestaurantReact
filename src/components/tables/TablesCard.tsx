import useModalState from '@/hooks/useModalState';
import useTables from '@/hooks/useTables';
import type { TableResponse } from '@/types/table';
import React, { useEffect, useState } from 'react'
import { Spinner } from '../ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { HandPlatter } from 'lucide-react';
import { Button } from '../ui/button';
import { IconPlus } from '@tabler/icons-react';
import TableCreateDialog from './TableCreateDialog';
import TableEditDialog from './TableEditDialog';
import TableDeleteDialog from './TableDeleteDialog';

function TablesCard() {
    const [submitting, setSubmitting] = useState(false);
    const [tableToEdit, setTableToEdit] = useState<TableResponse | null>(null);
    const [tableToDelete, setTableToDelete] = useState<TableResponse | null>(null);

    const {
        data,
        loading,
        error,
        createTable,
        updateTable,
        deleteTable,
        fetchTables,
    } = useTables();

    const createModal = useModalState();
    const editModal = useModalState();
    const deleteModal = useModalState();

    useEffect(() => {
        fetchTables();
    }, []);

    if (loading) {
        return <div>
            <Spinner className='size-8 text-primary' />
        </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = (table: TableResponse) => {
        setTableToEdit(table);
        editModal.openModal();
    };

    const handleDelete = (table: TableResponse) => {
        setTableToDelete(table);
        deleteModal.openModal();
    };

    return (
        <>
            <div className='flex justify-end mb-4'>
                <Button variant="outline" size="sm" onClick={createModal.openModal}>
                    <IconPlus />
                    <span className="hidden lg:inline">Agregar Mesa</span>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Mesas</CardTitle>
                </CardHeader>
                <CardContent>
                    {data && data.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {data.map((table: TableResponse) => (
                                <Card key={table.tableId}>
                                    <CardHeader>
                                        <CardTitle>{table.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex flex-col items-center justify-center'>
                                        <HandPlatter className={`${table.isOccupied ? 'text-red-500' : 'text-green-500'}`} />
                                        <p className={`text-sm mb-4 font-semibold ${table.isOccupied ? 'text-red-500' : 'text-green-500'}`}>
                                            {table.isOccupied ? 'Mesa Ocupada' : 'Mesa Disponible'}
                                        </p>

                                        <div className='flex gap-4'>
                                            <Button onClick={() => handleEdit(table)} variant="outline" size="sm">Editar</Button>
                                            <Button onClick={() => handleDelete(table)} variant="destructive" size="sm">Eliminar</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p>No tables available</p>
                    )}
                </CardContent>
            </Card>

            <TableCreateDialog
                open={createModal.open}
                onClose={createModal.closeModal}
                onSubmit={createTable}
                submitting={submitting}
                setSubmitting={setSubmitting}
            />

            <TableEditDialog
                open={editModal.open}
                onClose={editModal.closeModal}
                onSubmit={updateTable}
                submitting={submitting}
                setSubmitting={setSubmitting}
                tableToEdit={tableToEdit}
            />

            <TableDeleteDialog
                open={deleteModal.open}
                onClose={deleteModal.closeModal}
                onConfirm={deleteTable}
                submitting={submitting}
                setSubmitting={setSubmitting}
                tableToDelete={tableToDelete}
            />
        </>
    )
}

export default TablesCard