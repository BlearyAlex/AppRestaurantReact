import CardOrderKitchen from "@/components/orders/CardOrderKitchen";

function Kitchen() {
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
            <CardOrderKitchen />
        </div>
    )
}

export default Kitchen