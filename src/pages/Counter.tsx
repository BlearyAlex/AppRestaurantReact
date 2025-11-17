import TablesCard from '@/components/tables/TablesCard'
import TakeOrder from '@/components/TakeOrder'

function Counter() {
    return (
        <div className='px-4 lg:px-6'>
            {/* Encabezado */}
            <div className='flex justify-between items-center mb-5'>
                <div>
                    <h3 className='text-gray-500'>Vista Pedidos Mostrador</h3>
                    <h1 className='text-2xl font-bold'>
                        Administrar{" "}
                        <span className='text-primary'>
                            Mostrador.
                        </span>
                    </h1>
                </div>
            </div>

            <div>
                <TakeOrder />
            </div>
        </div>
    )
}

export default Counter