import { motion } from "framer-motion";
import { memo } from "react";

export const PulseDot = memo(({ isConnected }: { isConnected: boolean }) => {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="relative flex items-center justify-center w-3 h-3">
                <motion.span
                    className={`absolute w-3 h-3 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"
                        }`}
                    initial={false}
                    animate={{
                        scale: isConnected ? [1, 2] : 1,
                        opacity: isConnected ? [0.6, 0] : 0.6,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: isConnected ? Infinity : 0,
                        ease: "linear",
                    }}
                />

                <span
                    className={`relative w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                />
            </div>

            <span className="text-sm text-gray-600">
                {isConnected ? "Tiempo real activo" : "Desconectado"}
            </span>
        </div>
    );
});