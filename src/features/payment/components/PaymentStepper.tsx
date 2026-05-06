import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {usePaymentStore} from "@/features/payment/store/paymentStore";
import Step1_OrderSummary from './Step1_OrderSummary';
import Step2_SplitConfig from './Step2_SplitConfig';
import Step3_RegisterPayments from './Step3_RegisterPayments';

const STEPS = [
    { number: 1, label: 'Resumen' },
    { number: 2, label: 'División' },
    { number: 3, label: 'Cobro' },
];

function PaymentStepper() {
    const { currentStep } = usePaymentStore();

    return (
        <div className="space-y-8">
            {/* Stepper visual */}
            <div className="flex items-center justify-center gap-0">
                {STEPS.map((step, idx) => {
                    const isCompleted = currentStep > step.number;
                    const isActive    = currentStep === step.number;

                    return (
                        <div key={step.number} className="flex items-center">
                            {/* Círculo */}
                            <div className="flex flex-col items-center gap-1">
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300',
                                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                                    isActive    && 'bg-background border-primary text-primary',
                                    !isCompleted && !isActive && 'bg-background border-muted text-muted-foreground'
                                )}>
                                    {isCompleted
                                        ? <Check size={16} />
                                        : step.number
                                    }
                                </div>
                                <span className={cn(
                                    'text-xs font-medium',
                                    isActive     && 'text-primary',
                                    isCompleted  && 'text-primary',
                                    !isCompleted && !isActive && 'text-muted-foreground'
                                )}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Línea conectora */}
                            {idx < STEPS.length - 1 && (
                                <div className={cn(
                                    'h-0.5 w-24 mx-2 mb-5 transition-all duration-300',
                                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Contenido del paso activo */}
            <div className="transition-all duration-300">
                {currentStep === 1 && <Step1_OrderSummary />}
                {currentStep === 2 && <Step2_SplitConfig />}
                {currentStep === 3 && <Step3_RegisterPayments />}
            </div>
        </div>
    );
}

export default PaymentStepper;