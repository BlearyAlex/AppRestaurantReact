import type { DinerRequest } from "@/types/payment";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Badge} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

interface DinerConfigRowProps {
    diner: DinerRequest;
    index: number;
    onChange: (index: number, patch: Partial<DinerRequest>) => void;
    showLabel: boolean;
}

export function DinerConfigRow({ diner, index, onChange, showLabel }: DinerConfigRowProps) {
    return (
        <Card>
            <CardContent className="pt-4 space-y-3">
                {showLabel && (
                    <div className="flex items-center gap-2">
                        <Badge>Comensal {diner.dinerNumber}</Badge>
                        <Input
                            placeholder="Nombre (opcional)"
                            value={diner.dinerLabel ?? ''}
                            onChange={e => onChange(index, { dinerLabel: e.target.value })}
                            className="h-7 text-sm"
                        />
                    </div>
                )}

                {/* resto del contenido igual */}
            </CardContent>
        </Card>
    );
}