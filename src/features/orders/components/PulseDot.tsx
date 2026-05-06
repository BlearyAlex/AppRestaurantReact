import {memo} from "react";

export const PulseDot = memo(({isConnected}: { isConnected: boolean }) => {
    const colorClass = isConnected ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50";
    const textClass = isConnected ? "text-green-600" : "text-red-600";

    return (
        <div className="flex items-center mb-4">
            <div className="relative flex items-center justify-center ml-auto mr-2">
                {/* Radar pulsante */}
                <span className={`absolute h-4 w-4 rounded-full ${colorClass} opacity-50 animate-ping`}
                      style={{animationDuration: "2s"}}>

                </span>
                {/* Dot central */}
                <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${colorClass}`}></span>
            </div>
            <span className={`font-semibold text-sm ${textClass}`}>
                {isConnected ? "Conectado" : "Desconectado"}
            </span>
        </div>
    );
});