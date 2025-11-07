import CategoriesTable from '@/components/categories/CategoriesTable'

function Categories() {
    return (
        <div className="px-4 lg:px-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Categorias</h3>
                    <h1 className="text-2xl font-bold">
                        Administrar{" "}
                        <span className="text-primary">
                            Categorias
                        </span>
                    </h1>
                </div>
            </div>

            <div>
                <CategoriesTable/>
            </div>
        </div>
    )
}

export default Categories
