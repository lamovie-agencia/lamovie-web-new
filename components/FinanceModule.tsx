import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, FileText, 
  PieChart as PieChartIcon, Activity, Calendar, Download, Plus, Search, Filter,
  ArrowUpRight, ArrowDownRight, RefreshCcw, FileSignature, Wallet,
  Receipt, BarChart3, AlertCircle, CheckCircle2, MoreVertical
} from 'lucide-react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EXCHANGE_RATE = 4000; // 1 USD = 4000 COP

export function FinanceModule() {
  const { token } = useAuth();
  const [subTab, setSubTab] = useState<'overview' | 'contracts' | 'transactions' | 'invoices'>('overview');
  const [currency, setCurrency] = useState<'USD' | 'COP'>('USD');

  const [contracts, setContracts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchFinance = useCallback(async () => {
    if (!token) return;
    try {
      const [c, t] = await Promise.all([
        adminService.getContracts(token),
        adminService.getTransactions(token)
      ]);
      setContracts(c);
      setTransactions(t);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const createContract = async () => {
    if (!token) return;
    try {
      await adminService.createContract({
        client: 'Nuevo Cliente',
        service: 'Nuevos Servicios Estratégicos',
        valueUSD: Math.floor(Math.random() * 5000) + 1000,
        status: 'pending',
        nextBilling: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        autoRenew: false
      }, token);
      fetchFinance();
    } catch(e) {}
  };

  const formatMoney = useCallback((amountUSD: number) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amountUSD);
    } else {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amountUSD * EXCHANGE_RATE);
    }
  }, [currency]);

  const totalIncomeUSD = useMemo(() => transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amountUSD, 0), [transactions]);
  const totalExpenseUSD = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amountUSD, 0), [transactions]);
  const netProfitUSD = totalIncomeUSD - totalExpenseUSD;
  const mrrUSD = useMemo(() => contracts.filter(c => c.status === 'active').reduce((acc, curr) => acc + curr.valueUSD, 0), [contracts]);

  // Group transactions by date for the chart
  const timelineData = useMemo(() => [...transactions].reverse().map(t => ({
    date: t.date.substring(5, 10),
    amount: t.type === 'income' ? t.amountUSD : -t.amountUSD,
    income: t.type === 'income' ? t.amountUSD : 0,
    expense: t.type === 'expense' ? t.amountUSD : 0
  })), [transactions]);

  const pieData = useMemo(() => [
    { name: 'Income', value: totalIncomeUSD, color: '#22c55e' },
    { name: 'Expense', value: totalExpenseUSD, color: '#ef4444' }
  ], [totalIncomeUSD, totalExpenseUSD]);

  return (
    <div className="flex flex-col gap-8 h-full min-h-[80vh]">
      {/* Header & SubNav */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
             <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center border border-yellow-500/30 backdrop-blur-xl">
               <DollarSign size={24} />
             </div>
             LA MOVIE FINANCE
           </h2>
           <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Intelligence Financial System 2026</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
          {/* Currency Toggle */}
          <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              USD
            </button>
            <button 
              onClick={() => setCurrency('COP')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currency === 'COP' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              COP
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md shrink-0">
            {[
              { id: 'overview', label: 'Panorama', icon: Activity },
              { id: 'contracts', label: 'Contratos', icon: FileSignature },
              { id: 'transactions', label: 'Caja', icon: Wallet },
              { id: 'invoices', label: 'Facturación', icon: Receipt },
            ].map(sub => (
              <button
               key={sub.id}
               onClick={() => setSubTab(sub.id as any)}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                 subTab === sub.id 
                   ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                   : 'text-white/40 hover:text-white hover:bg-white/5'
               }`}
              >
               <sub.icon size={16} /> 
               <span className="hidden sm:inline">{sub.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OVERVIEW DASHBOARD */}
      {subTab === 'overview' && (
        <div className="flex flex-col gap-8">
           {/* Top Metric Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* Ingresos Totales */}
             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
               <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                   <TrendingUp size={18} className="text-green-400" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-white/50 border border-white/5">Mes Actual</span>
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Ingresos Brutos</h4>
               <p className="text-3xl font-black tracking-tighter text-white">{formatMoney(totalIncomeUSD)}</p>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                 <span className="text-green-400 flex items-center"><ArrowUpRight size={12}/> 14.5%</span>
                 <span className="text-white/30">vs mes anterior</span>
               </div>
             </div>

             {/* MRR (Monthly Recurring Revenue) */}
             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
               <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                   <RefreshCcw size={18} className="text-blue-400" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-white/50 border border-white/5">Activo</span>
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">MRR (Recurrente)</h4>
               <p className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{formatMoney(mrrUSD)}</p>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                 <span className="text-green-400 flex items-center"><ArrowUpRight size={12}/> 5.2%</span>
                 <span className="text-white/30">Crecimiento constante</span>
               </div>
             </div>

             {/* Gastos */}
             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
               <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                   <TrendingDown size={18} className="text-red-400" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-white/50 border border-white/5">Operación</span>
               </div>
               <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Gastos Totales</h4>
               <p className="text-3xl font-black tracking-tighter text-white">{formatMoney(totalExpenseUSD)}</p>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                 <span className="text-red-400 flex items-center"><ArrowUpRight size={12}/> 2.1%</span>
                 <span className="text-white/30">Aumento operativo</span>
               </div>
             </div>

             {/* Utilidad Neta */}
             <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 p-6 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay"></div>
               <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                   <PieChartIcon size={18} className="text-yellow-400" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-500/20 px-2 py-1 rounded text-yellow-500 border border-yellow-500/20">Profit</span>
               </div>
               <h4 className="text-yellow-500/60 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Margen Neto</h4>
               <p className="text-3xl font-black tracking-tighter text-yellow-400 relative z-10">{formatMoney(netProfitUSD)}</p>
               <div className="mt-4 flex flex-col gap-2 relative z-10 w-full">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/50">
                    <span>Rentabilidad</span>
                    <span className="text-yellow-400">{((netProfitUSD / totalIncomeUSD) * 100).toFixed(1)}%</span>
                 </div>
                 <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" style={{ width: `${(netProfitUSD / totalIncomeUSD) * 100}%` }}></div>
                 </div>
               </div>
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Transactions History */}
             <div className="lg:col-span-2 flex flex-col gap-6">
               <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-[32px] p-8 backdrop-blur-xl h-[300px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                       <Activity size={20} className="text-green-400" /> Flujo de Efectivo
                     </h3>
                  </div>
                  <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="date" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                 <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                     <Wallet size={20} className="text-blue-400" /> Transacciones
                   </h3>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                     Ver Todo
                   </button>
                 </div>
                 <div className="space-y-4">
                   {transactions.map(tx => (
                     <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all gap-4">
                       <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                           tx.type === 'income' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                         }`}>
                           {tx.type === 'income' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                         </div>
                         <div>
                           <h5 className="font-bold text-sm text-white">{tx.description}</h5>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">
                             {tx.date} • {tx.category}
                           </p>
                         </div>
                       </div>
                       <div className={`text-right font-mono font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                         {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amountUSD)}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>

             {/* AI Insights & Alerts */}
             <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-b from-blue-900/40 to-indigo-900/40 border border-blue-500/20 p-8 rounded-[32px]">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                         <BarChart3 size={20} className="text-blue-400" />
                      </div>
                      <h3 className="text-sm font-bold text-blue-300 uppercase tracking-widest">IA Financial Insights</h3>
                   </div>
                   <p className="text-white/80 text-sm leading-relaxed mb-6">
                     El MRR ha crecido un <strong>5.2%</strong>. Recomendamos ajustar el 'Retainer Redes' del cliente <strong>Nike Latam</strong> según la inflación para el próximo trimestre. Tienes $850 en gastos de alquiler equipo que podrían justificar la compra de cámara propia en 4 meses.
                   </p>
                   <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                     Generar Reporte Completo
                   </button>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
                   <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <AlertCircle size={14} className="text-yellow-500" /> Alertas de Renovación
                   </h4>
                   <div className="space-y-3">
                     {contracts.filter(c => c.status === 'pending').map(c => (
                       <div key={c.id} className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-center justify-between">
                         <div>
                           <h5 className="text-xs text-yellow-500 font-bold">{c.client}</h5>
                           <p className="text-[10px] text-white/50 uppercase font-black uppercase tracking-widest mt-1">Vence: {c.nextBilling}</p>
                         </div>
                         <button className="text-[10px] px-3 py-1 bg-yellow-500 text-black font-black uppercase rounded-lg">Renovar</button>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* CONTRACTS / MRR */}
      {subTab === 'contracts' && (
        <div className="flex flex-col h-full bg-white/5 rounded-[40px] border border-white/10 p-8 overflow-hidden backdrop-blur-md min-h-[60vh]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
              <FileSignature size={24} className="text-blue-400" /> CONTRATOS & MRR
            </h3>
            <button onClick={createContract} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Plus size={16} /> Nuevo Contrato
            </button>
          </div>

          <div className="overflow-x-auto border border-white/5 rounded-3xl bg-black/40">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest text-[10px] font-black">
                  <th className="py-5 px-6">Cliente & Servicio</th>
                  <th className="py-5 px-6">Valor Mensual</th>
                  <th className="py-5 px-6 text-center">Auto-Renovación</th>
                  <th className="py-5 px-6">Estado</th>
                  <th className="py-5 px-6">Próx. Facturación</th>
                  <th className="py-5 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">{contract.client}</span>
                        <span className="text-[10px] font-medium text-white/50 mt-1 uppercase tracking-widest">{contract.service}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-mono font-bold text-green-400">
                      {formatMoney(contract.valueUSD)}
                    </td>
                    <td className="py-5 px-6 text-center">
                      {contract.autoRenew ? (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-[9px] uppercase font-black tracking-widest border border-green-500/20"><CheckCircle2 size={10} /> ON</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-white/10 text-white/40 px-2 py-1 rounded-md text-[9px] uppercase font-black tracking-widest border border-white/10"><AlertCircle size={10} /> MANUAL</span>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        contract.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {contract.status === 'active' ? 'Activo' : 'Pendiente Rev.'}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-xs font-bold text-white/60">
                      <div className="flex items-center gap-2">
                         <Calendar size={12} className="text-white/30" />
                         {new Date(contract.nextBilling).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button 
                        onClick={async () => {
                          if (token) {
                            await adminService.deleteContract(contract.id, token);
                            fetchFinance();
                          }
                        }}
                        className="text-white/30 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-lg hover:bg-red-500/20">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVOICES & TRANSACTIONS PLACEHOLDERS */}
      {(subTab === 'invoices' || subTab === 'transactions') && (
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center text-center min-h-[60vh] relative overflow-hidden backdrop-blur-xl">
           <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent mix-blend-overlay"></div>
           <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
              {subTab === 'invoices' && <Receipt size={48} className="text-green-400" />}
              {subTab === 'transactions' && <Wallet size={48} className="text-yellow-400" />}
           </div>
           <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4 relative z-10">Generador Integrado</h3>
           <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed relative z-10 mb-8">
             El módulo de <strong>{subTab === 'invoices' ? 'Facturación PDF Editable' : 'Caja Histórica'}</strong> está conectándose con la pasarela de pagos.
           </p>
        </div>
      )}

    </div>
  );
}
