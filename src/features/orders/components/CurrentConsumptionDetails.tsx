import { BadgeCheck } from "lucide-react";

function CurrentConsumptionDetails({ consumptionDetails }: any) {

    const total = consumptionDetails.reduce((sum: number, item: any) => {
        return sum + item.product.price * item.quantity;
    }, 0);

    return (
        <div>
            {consumptionDetails.length === 0 ? (
                <p>No hay productos en el consumo actual.</p>
            ) : (
                <div className="space-y-4">
                    {consumptionDetails.map((item: any) => (
                        <div
                            key={item.product.productId}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div className="flex gap-2 justify-start">
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="flex items-center gap-1">
                                        <BadgeCheck size={14} strokeWidth={3} color="#fcc800" />{' '}
                                        {item.product.category.name}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500">x{item.quantity}</p>
                            </div>
                            <p className="font-semibold">
                                {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                }).format(item.product.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                    <div className="mt-4 flex justify-between items-center font-semibold text-lg pt-4">
                        <p>Total:</p>
                        <p className="font-bold text-primary">
                            {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                            }).format(total)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CurrentConsumptionDetails