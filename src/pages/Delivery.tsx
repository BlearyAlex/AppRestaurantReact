import TablesCard from '@/components/tables/TablesCard'

function Delivery() {
    return (
        <div className='px-4 lg:px-6'>
            {/* Encabezado */}
            <div className='flex justify-between items-center mb-5'>
                <div>
                    <h3 className='text-gray-500'>Vista Pedidos para llevar</h3>
                    <h1 className='text-2xl font-bold'>
                        Administrar{" "}
                        <span className='text-primary'>
                            Pedidos Para Llevar.
                        </span>
                    </h1>
                </div>
            </div>

            <div>
                <TablesCard />
            </div>
        </div>
    )
}

export default Delivery