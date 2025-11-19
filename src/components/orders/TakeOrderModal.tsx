import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import TakeOrder from './TakeOrder'
import type { OrderType } from '@/enums/orderEnum';

type TakeOrderProps = {
    orderType: OrderType;
    tableId?: number;
    open: any;
    onClose: any;
}

function TakeOrderModal({ orderType, tableId, open, onClose }: TakeOrderProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] md:max-w-[800px] lg:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>Tomar Orden</DialogTitle>
                </DialogHeader>
                <TakeOrder
                    orderType={orderType}
                    tableId={tableId}
                />
            </DialogContent>
        </Dialog>
    )
}

export default TakeOrderModal