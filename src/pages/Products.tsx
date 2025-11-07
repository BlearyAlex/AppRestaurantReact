import ProductsTable from '@/components/products/ProductsTable'

function Products() {
    return (
        <div className="px-4 lg:px-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-5">
            <div>
                <h3 className="text-gray-500">Vista Productos</h3>
                <h1 className="text-2xl font-bold">
                    Administrar{" "}
                    <span className="text-primary">
                        Productos
                    </span>
                </h1>
            </div>
        </div>

        <div>
            <ProductsTable/>
        </div>
    </div>
    )
}

export default Products
