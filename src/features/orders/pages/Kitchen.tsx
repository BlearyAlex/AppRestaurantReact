import CardOrderKitchen from "@/features/orders/components/CardOrderKitchen";
import { PulseDot } from "@/features/orders/components/PulseDot";
import { useKitchenOrdersStore } from "@/features/orders/store/kitchenOrderStore";

function Kitchen() {
    const isConnected = useKitchenOrdersStore((s) => s.isConnected);

    return (
        <div className="p-4">
            {/* Indicador de conexión */}
            <PulseDot isConnected={isConnected} />
            <CardOrderKitchen filter="pending" />
        </div>
    );
}

export default Kitchen
