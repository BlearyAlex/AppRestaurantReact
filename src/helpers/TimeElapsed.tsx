import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

function TimeElapsed({ createdAt }: { createdAt: string }) {
    const [elapsed, setElapsed] = useState('0m')
    const [urgency, setUrgency] = useState<'normal' | 'warning' | 'urgent'>('normal');

    useEffect(() => {
        const updateElapsed = () => {
            const now = new Date();
            const created = new Date(createdAt);
            const diffMs = now.getTime() - created.getTime();
            const diffMins = Math.floor(diffMs / 60000);

            console.log('⏰ Actualizando tiempo:', { createdAt, diffMins, elapsed: `${diffMins}m` });

            // Si el tiempo es negativo, mostrar 0m
            if (diffMins < 0) {
                setElapsed('0m');
                setUrgency('normal');
                return;
            }

            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;

            // Formatear tiempo
            if (hours > 0) {
                setElapsed(`${hours}h ${mins}m`);
            } else {
                setElapsed(`${mins}m`);
            }

            // Determinar urgencia
            if (diffMins < 10) setUrgency('normal');
            else if (diffMins < 20) setUrgency('warning');
            else setUrgency('urgent');
        };

        updateElapsed();
        const interval = setInterval(updateElapsed, 60000); // Actualizar cada minuto

        return () => clearInterval(interval);
    }, [createdAt]);

    const urgencyColors = {
        normal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return (
        <Badge className={urgencyColors[urgency]}>
            <Timer /> {elapsed}
        </Badge>
    );
}

export default TimeElapsed