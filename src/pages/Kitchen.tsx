import CardOrderKitchen from "@/components/orders/CardOrderKitchen";
import { PulseDot } from "@/components/PulseDot";
import { useKitchenOrdersStore } from "@/store/kitchenOrderStore";

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
