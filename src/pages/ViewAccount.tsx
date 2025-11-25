import ViewProducts from "@/components/orders/ViewProducts"


function ViewAccount() {
    return (
        <div className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Pedidos para llevar</h3>
                    <h1 className="text-2xl font-bold">
                        Administrar <span className="text-primary">Pedidos Para Llevar.</span>
                    </h1>
                </div>
            </div>
            <ViewProducts />
        </div>
    )
}

export default ViewAccount