import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CurrentConsumptionDetails from './CurrentConsumptionDetails'

function CurrentConsumptionModal({ open, onClose, consumptionDetails }: any) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Consumo Actual</DialogTitle>
                    <DialogDescription>Lista de consumo actual del cliente.</DialogDescription>
                </DialogHeader>
                <CurrentConsumptionDetails
                    consumptionDetails={consumptionDetails}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CurrentConsumptionModal