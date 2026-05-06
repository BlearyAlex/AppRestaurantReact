import CashRegisterCard from "../components/cashRegister/CashRegisterCard"

function CashRegister() {
  return (
    <div className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Cajas Registradoras</h3>
                    <h1 className="text-2xl font-bold">Administrar{" "} <span className="text-primary">Cajas Registradoras.</span></h1>
                </div>
            </div>
            <CashRegisterCard />
        </div>
  )
}

export default CashRegister