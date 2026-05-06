import {useState} from "react";
import {toast} from "sonner";
import api from "@/api/api.ts";
import CashRegisterSessionService from "../api/cashRegisterSessionService";
import type { CashRegisterSessionResponse, OpenCashRegisterRequest } from "../types/cashRegister";

const cashRegisterSession = new CashRegisterSessionService();

const useCashRegisterSession = () => {
    const [data, setData] = useState<CashRegisterSessionResponse>();
    const [dataList, setDataList] = useState<CashRegisterSessionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchCashRegisterSession = async () => {
        setLoading(true);
        try {
    const response = await api.get('/CashRegisterSession')
            setDataList(response.data)
            setError(null)
        } catch (error){
            setError(`No se pudieron obtener las sesiones de las cajas. ${error}`);
        }
        finally {
            setLoading(false);
        }
    }

    const openCashRegister = async (request: OpenCashRegisterRequest) => {
        setLoading(true);
        try {
            const response = await cashRegisterSession.openRegister(request);
            setData(response.data);
            await toast.success("Cash register session successfully.");
            setError(null);
        } catch (error) {
            setError(`No se pudo abrir la caja. ${error}`);
        }
        finally {
            setLoading(false);
        }
    }

    const closeCashRegister = async (sessionId: number) => {
        setLoading(true);
        try {
        const response = await cashRegisterSession.closeRegister(sessionId);
        setData(response.data);
        await toast.success("Cash register session successfully.");
        setError(null);
        } catch (error) {
            setError(`No se pudo cerrar la caja. ${error}`);
        }
        finally {
            setLoading(false);
        }
    }

    const getActiveCashRegisters = async () => {
        setLoading(true);
        try {
            const response = await cashRegisterSession.fetchActiveCashRegisters();
            setDataList(response.data)
            setError(null)
        } catch (error) {
            setError(`No se pudo cerrar la caja. ${error}`);
        }
        finally {
            setLoading(false);
        }
    }

    return {data, dataList, error, loading, fetchCashRegisterSession, openCashRegister, closeCashRegister, getActiveCashRegisters};
}

export default useCashRegisterSession;