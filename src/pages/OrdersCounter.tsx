import { useEffect } from "react";
import { useOrderStore } from "@/store/orderStore.ts";
import { ConciergeBell } from "lucide-react";
import { OrderType } from "@/enums/orderEnum.ts";
import TakeOrder from "@/components/orders/TakeOrder.tsx";

// ── config ───────────────────────────────────────────────────────
const TOTAL_COUNTERS = 5; // adjust to your restaurant setup

// Generates a ticket number: e.g. "T-20240326-0047"
function generateTicketNumber(): string {
    const now    = new Date();
    const date   = now.toISOString().slice(0, 10).replace(/-/g, "");
    const seq    = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    return `T-${date}-${seq}`;
}

// ── component ────────────────────────────────────────────────────
function OrdersCounter() {
    const counter         = useOrderStore((state) => state.counter);
    const setCounterField = useOrderStore((state) => state.setCounterField);
    // const resetCounter    = useOrderStore((state) => state.resetCounter);

    // Auto-generate ticket on mount if not already set
    useEffect(() => {
        if (!counter.ticketNumber) {
            setCounterField("ticketNumber", generateTicketNumber());
        }
    }, []);

    const counterReady = counter.counterNumber !== null;

    // ── empty state: no counter selected ─────────────────────────
    if (!counterReady) {
        return (
            <div className="px-4 lg:px-6">
                <Header ticket={counter.ticketNumber} />

                <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
                    {/* icon badge */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ConciergeBell size={32} className="text-primary" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Selecciona el mostrador</h2>
                        <p className="text-gray-500 max-w-xs mt-1">
                            Elige el mostrador donde se atenderá este pedido para continuar.
                        </p>
                    </div>

                    {/* ticket preview */}
                    {counter.ticketNumber && (
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200
                                        rounded-xl px-4 py-2 text-sm">
                            <span className="text-gray-500">Ticket generado:</span>
                            <span className="font-mono font-semibold text-gray-800">
                                {counter.ticketNumber}
                            </span>
                            <button
                                onClick={() =>
                                    setCounterField("ticketNumber", generateTicketNumber())
                                }
                                className="ml-2 text-xs text-primary hover:underline"
                                title="Regenerar ticket"
                            >
                                Regenerar
                            </button>
                        </div>
                    )}

                    {/* counter grid */}
                    <div className="w-full max-w-sm">
                        <p className="text-sm text-gray-500 mb-3">Mostrador:</p>
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: TOTAL_COUNTERS }, (_, i) => i + 1).map(
                                (num) => (
                                    <button
                                        key={num}
                                        onClick={() => setCounterField("counterNumber", num)}
                                        className={`
                                            aspect-square flex items-center justify-center
                                            rounded-xl border-2 text-lg font-bold transition-all
                                            ${counter.counterNumber === num
                                            ? "border-primary bg-primary text-white shadow-md scale-105"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5"
                                        }
                                        `}
                                    >
                                        {num}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* confirm */}
                    <button
                        disabled={!counterReady}
                        className="mt-2 w-full max-w-sm bg-primary text-white py-2.5 rounded-lg
                                   font-medium hover:bg-primary/90 disabled:opacity-40
                                   disabled:cursor-not-allowed transition-colors"
                    >
                        Continuar con el pedido →
                    </button>
                </div>
            </div>
        );
    }

    // ── ready: show order builder ─────────────────────────────────
    return (
        <div className="px-4 lg:px-6">
            <Header ticket={counter.ticketNumber} />

            {/* counter summary chip */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary
                                text-sm font-medium px-4 py-1.5 rounded-full">
                    <ConciergeBell size={15} />
                    <span>Mostrador {counter.counterNumber}</span>
                    <button
                        onClick={() => setCounterField("counterNumber", null)}
                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors text-xs"
                        title="Cambiar mostrador"
                    >
                        ✕
                    </button>
                </div>

                {counter.ticketNumber && (
                    <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600
                                    text-sm px-3 py-1.5 rounded-full font-mono">
                        🎫 {counter.ticketNumber}
                    </div>
                )}
            </div>

            <TakeOrder orderType={OrderType.ForCounter} />
        </div>
    );
}

// ── shared header ────────────────────────────────────────────────
function Header({ ticket }: { ticket: string }) {
    return (
        <div className="flex justify-between items-center mb-5">
            <div>
                <h3 className="text-gray-500">Vista Ordenes</h3>
                <h1 className="text-2xl font-bold">
                    Tomar{" "}
                    <span className="text-primary">
                        Pedido en Mostrador
                        {ticket ? ` — ${ticket}` : ""}
                    </span>
                </h1>
            </div>
        </div>
    );
}

export default OrdersCounter;
