import { useState } from "react";
import { useOrderStore } from "@/store/orderStore.ts";
import { ShoppingBag } from "lucide-react";
import { OrderType } from "@/enums/orderEnum.ts";
import TakeOrder from "@/components/orders/TakeOrder.tsx";

// ── helpers ──────────────────────────────────────────────────────
function isValidAddress(address: string) {
    return address.trim().length >= 5;
}

// ── component ────────────────────────────────────────────────────
function OrdersTakeAway() {
    const takeAway         = useOrderStore((state) => state.takeAway);
    const setTakeAwayField = useOrderStore((state) => state.setTakeAwayField);
    const clearTakeAway    = useOrderStore((state) => state.clearTakeAway);

    const [confirmed, setConfirmed] = useState(false);

    const addressReady = isValidAddress(takeAway.deliveryAddress);
    const showOrder    = confirmed && addressReady;

    // ── empty state: no address confirmed yet ────────────────────
    if (!showOrder) {
        return (
            <div className="px-4 lg:px-6">
                <Header />

                <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
                    {/* icon badge */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ShoppingBag size={32} className="text-primary" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Ingresa los datos de entrega</h2>
                        <p className="text-gray-500 max-w-xs mt-1">
                            Completa la dirección y el tiempo estimado antes de tomar el pedido.
                        </p>
                    </div>

                    {/* form card */}
                    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-left space-y-4 dark:text-black">
                        {/* address */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Dirección de entrega <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Ej. Calle Morelos 45, Col. Centro, Guadalajara"
                                value={takeAway.deliveryAddress}
                                onChange={(e) =>
                                    setTakeAwayField("deliveryAddress", e.target.value)
                                }
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                                           placeholder:text-gray-400 transition"
                            />
                            {takeAway.deliveryAddress.trim().length > 0 &&
                                !addressReady && (
                                    <p className="text-xs text-red-500">
                                        La dirección debe tener al menos 5 caracteres.
                                    </p>
                                )}
                        </div>

                        {/* estimated delivery time */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Tiempo estimado de entrega
                            </label>
                            <input
                                type="time"
                                value={takeAway.estimatedDeliveryTime}
                                onChange={(e) =>
                                    setTakeAwayField("estimatedDeliveryTime", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                                           transition"
                            />
                            <p className="text-xs text-gray-400">
                                Opcional — hora estimada de llegada al cliente.
                            </p>
                        </div>

                        {/* confirm button */}
                        <button
                            disabled={!addressReady}
                            onClick={() => {
                                setTakeAwayField("deliveryAddress", takeAway.deliveryAddress.trim());
                                setConfirmed(true);
                            }}
                            className="w-full mt-2 bg-primary text-white py-2.5 rounded-lg font-medium
                                       hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed
                                       transition-colors"
                        >
                            Continuar con el pedido →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── ready: show order builder ─────────────────────────────────
    return (
        <div className="px-4 lg:px-6">
            <Header />

            {/* delivery summary chip */}
            <div className="mb-5 inline-flex items-center gap-2 bg-primary/10 text-primary
                            text-sm font-medium px-4 py-1.5 rounded-full">
                <ShoppingBag size={15} />
                <span className="truncate max-w-[260px]">{takeAway.deliveryAddress}</span>
                {takeAway.estimatedDeliveryTime && (
                    <span className="text-gray-500">· {takeAway.estimatedDeliveryTime}</span>
                )}
                <button
                    onClick={() => {
                        clearTakeAway();
                        setConfirmed(false);
                    }}
                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors text-xs"
                    title="Cambiar dirección"
                >
                    ✕
                </button>
            </div>

            <TakeOrder orderType={OrderType.ForTakeAway} />
        </div>
    );
}

// ── shared header ────────────────────────────────────────────────
function Header() {
    return (
        <div className="flex justify-between items-center mb-5">
            <div>
                <h3 className="text-gray-500">Vista Ordenes</h3>
                <h1 className="text-2xl font-bold">
                    Tomar <span className="text-primary">Pedido para Llevar</span>
                </h1>
            </div>
        </div>
    );
}

export default OrdersTakeAway;
