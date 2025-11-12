import TablesCard from '@/components/tables/TablesCard'

function Orders() {
    return (
        <div className='px-4 lg:px-6'>
            {/* Encabezado */}
            <div className='flex justify-between items-center mb-5'>
                <div>
                    <h3 className='text-gray-500'>Vista Mesas</h3>
                    <h1 className='text-2xl font-bold'>
                        Administrar{" "}
                        <span className='text-primary'>
                            Mesas.
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

export default Orders
