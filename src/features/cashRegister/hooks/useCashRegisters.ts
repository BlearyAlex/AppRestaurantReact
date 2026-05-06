import CashRegisterService from "../api/cashRegisterService";
import type { CashRegisterResponse, CreateCashRegisterRequest } from "../types/cashRegister";
import { useState } from "react";

const cashRegisterService = new CashRegisterService();

const useCashRegisters = () => {
  const [data, setData] = useState<CashRegisterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCashRegisters = async () => {
    setLoading(true);
    try {
      const response = await cashRegisterService.fetchAll();
      setData(response.data);
    } catch (error) {
      setError(`Error al cargar las cajas. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createCashRegister = async (req: CreateCashRegisterRequest) => {
    setLoading(true);
    try {
      const response = await cashRegisterService.createCashRegister(req);
      setData((prev) => [...prev, response.data]);
    } catch (error) {
      setError(`Error al crear la caja. ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetchCashRegisters, createCashRegister };
};

export default useCashRegisters;
