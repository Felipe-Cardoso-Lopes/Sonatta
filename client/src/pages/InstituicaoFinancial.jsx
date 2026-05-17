import React, { useState, useEffect } from "react";
import axios from "axios";
import InstituicaoSidebar from "../components/InstituicaoSidebar";

function InstituicaoFinancial() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await axios.get(`${API_URL}/api/instituicao/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoices(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar registros financeiros", error);
        setIsLoading(false);
      }
    }
    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <InstituicaoSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Financeiro & Faturamento
            </h1>
            <p className="text-gray-400">
              Monitore o histórico de pagamentos da assinatura mensal da
              plataforma Sonatta.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-gray-200 mb-4">
              Histórico de Faturas SaaS
            </h2>

            {isLoading ? (
              <p className="text-gray-400 text-sm">Carregando extrato...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-sm">
                      <th className="pb-3 font-semibold">Cód. Referência</th>
                      <th className="pb-3 font-semibold">Data de Emissão</th>
                      <th className="pb-3 font-semibold">
                        Valor da Mensalidade
                      </th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="pt-6 text-gray-500 text-sm text-center"
                        >
                          Nenhum lançamento financeiro registrado até o momento.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="border-b border-gray-700/50 text-sm text-gray-200 hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="py-4 font-mono text-xs text-purple-300">
                            #INV-{inv.id.toString().padStart(5, "0")}
                          </td>
                          <td className="py-4 text-gray-400">
                            {new Date(inv.created_at).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="py-4 font-semibold">
                            R$ {parseFloat(inv.amount || 0).toFixed(2)}
                          </td>
                          <td className="py-4 text-center">
                            <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded text-xs font-bold border border-green-500/30 uppercase tracking-wide">
                              {inv.status || "Pago"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstituicaoFinancial;
