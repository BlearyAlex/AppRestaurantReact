import CashRegisterSessionView from "../components/cashRegisterSession/CashRegisterSessionView";


function CashRegisterSession() {

  return (
    <div className="px-4 lg:px-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-gray-500">Administrar Cajas Registradoras</h3>
         <h1 className="text-2xl font-bold">Abrir Sesion{" "} <span className="text-primary">Cajas Registradoras.</span></h1>
        </div>
      </div>
      <CashRegisterSessionView />
    </div>
  );
}

export default CashRegisterSession;