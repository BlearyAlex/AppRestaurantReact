import {useNavigate, useParams} from "react-router";
import {usePaymentStore} from "@/features/payment/store/paymentStore";
import {useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft} from "lucide-react";
import PaymentStepper from "../components/PaymentStepper";

function PayPage() {
    const {tableId} = useParams<{ tableId: string }>();
    const navigate = useNavigate();
    const {setTable, reset} = usePaymentStore();

    useEffect(() => {
        if (!tableId) {
            navigate('/dashboard');
            return;
        }
        setTable(Number(tableId), `Mesa ${tableId}`);

        // Limpiar store al salir
        return () => reset();
    }, [tableId]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="shrink-0"
                >
                    <ArrowLeft size={20}/>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">Cobro de Mesa</h1>
                    <p className="text-sm text-muted-foreground">Mesa {tableId}</p>
                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <PaymentStepper/>
            </div>
        </div>
    );
}

export default PayPage;