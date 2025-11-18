import TablesCard from '@/components/tables/TablesCard'
import TakeOrder from '@/components/TakeOrder';
import { useState } from 'react';

function Tables() {
    const [selectedTableId, setSelectedTableId] = useState<number | string | null>(null);

    const handleTableSelect = (tableId: number | string) => {
        setSelectedTableId(tableId);
    };

    return (
        <div className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Mesas</h3>
                    <h1 className="text-2xl font-bold">Administrar{" "} <span className="text-primary">Mesas.</span></h1>
                </div>
            </div>

            {/* Aquí puedes pasar el tableId al componente TakeOrder */}
            {selectedTableId ? (
                <TakeOrder tableId={selectedTableId} />
            ) : (
                <p>Selecciona una mesa para realizar un pedido.</p>
            )}

            <TablesCard onSelectTable={handleTableSelect} />
        </div>
    )
}

export default Tables
