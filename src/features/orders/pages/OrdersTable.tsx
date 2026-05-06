import {useOrderStore} from "@/features/orders/store/orderStore";
import {Armchair} from "lucide-react";
import {Link} from "react-router";
import {OrderType} from "@/enums/orderEnum.ts";
import TakeOrder from "@/features/orders/components/TakeOrder.tsx";

function OrdersTable() {
    const tableId = useOrderStore((state) => state.tableId)

    if (!tableId) {
        return (
            <div className="px-4 lg:px-6">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-gray-500">Vista Ordenes</h3>
                        <h1 className="text-2xl font-bold">
                            Tomar <span className="text-primary">Pedido para Mesa</span>
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Armchair size={32} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Ninguna mesa seleccionada</h2>
                    <p className="text-gray-500 max-w-xs">
                        Para tomar un pedido primero selecciona una mesa disponible.
                    </p>
                    <Link
                        to="/dashboard/orders/tables"
                        className="mt-2 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Ir a Mesas
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Ordenes</h3>
                    <h1 className="text-2xl font-bold">
                        Tomar <span className="text-primary">Pedido — Mesa {tableId}</span>
                    </h1>
                </div>
            </div>
            <TakeOrder orderType={OrderType.ForTable} />
        </div>
    )
}

export default OrdersTable