import TablesCard from '@/features/tables/components/TablesCard'

function Tables() {
    return (
        <div className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Mesas</h3>
                    <h1 className="text-2xl font-bold">Administrar{" "} <span className="text-primary">Mesas.</span></h1>
                </div>
            </div>
            <TablesCard />
        </div>
    )
}

export default Tables
