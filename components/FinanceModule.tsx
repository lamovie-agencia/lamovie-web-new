import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, BarChart3, Briefcase, CheckCircle2, Clock, DollarSign, Plus,
  Receipt, RefreshCcw, Save, Search, ShieldCheck, Target, Trash2, Users, Wallet
} from 'lucide-react';
import { adminService } from '../lib/adminService';
import { useAuth } from '../lib/authService';

const EXCHANGE_RATE = 4000;
const today = () => new Date().toISOString().split('T')[0];

const money = (amountUSD: number, currency: 'USD' | 'COP') => {
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format((Number(amountUSD) || 0) * EXCHANGE_RATE);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amountUSD) || 0);
};

const required = (value: unknown) => String(value ?? '').trim().length > 0;
const FIELD = 'w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-yellow-500 focus:outline-none [color-scheme:dark]';
const BUDGET = 'bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/70';
const BUSINESS_RULE = [
  ['Operacion', 40],
  ['Reinversion', 20],
  ['Impuestos', 15],
  ['Utilidad empresa', 15],
  ['Fondo emergencia', 10]
];
const PERSONAL_RULE = [
  ['Gastos personales', 40],
  ['Inversiones', 25],
  ['Ahorro', 15],
  ['Educacion', 10],
  ['Diversion', 5],
  ['Emergencia', 5]
];
const AREA_MIX = [
  ['Produccion audiovisual', 45],
  ['Marketing digital', 35],
  ['Branding', 10],
  ['Eventos', 10]
];

export function FinanceModule() {
  const { token } = useAuth();
  const [subTab, setSubTab] = useState<'overview' | 'contracts' | 'transactions' | 'team' | 'personal' | 'automations'>('overview');
  const [currency, setCurrency] = useState<'USD' | 'COP'>('USD');
  const [contracts, setContracts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [crmClients, setCrmClients] = useState<any[]>([]);
  const [notice, setNotice] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [contractSearch, setContractSearch] = useState('');
  const [contractStatus, setContractStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [transactionSearch, setTransactionSearch] = useState('');

  const [contractForm, setContractForm] = useState({
    client: '',
    service: '',
    valueUSD: '',
    expectedCostUSD: '',
    billingCycle: 'monthly',
    startDate: today(),
    endDate: '',
    nextBilling: today(),
    status: 'pending',
    autoRenew: true,
    reinvestPercent: '20',
    savingsPercent: '10',
    payrollPercent: '30',
    ownerProfitPercent: '40',
    notes: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    date: today(),
    activityDate: today(),
    description: '',
    type: 'expense',
    amountUSD: '',
    category: 'Operacion',
    scope: 'company',
    paymentMethod: 'Transferencia',
    workType: '',
    collaboratorId: '',
    contractId: '',
    notes: ''
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    rateUSD: '',
    rateCycle: 'project',
    active: true,
    notes: ''
  });

  const fetchFinance = useCallback(async () => {
    if (!token) return;
    try {
      const [c, t, members, clients] = await Promise.all([
        adminService.getContracts(token),
        adminService.getTransactions(token),
        adminService.getTeamMembers(token),
        adminService.getCrmClients(token)
      ]);
      setContracts(Array.isArray(c) ? c : []);
      setTransactions(Array.isArray(t) ? t : []);
      setTeam(Array.isArray(members) ? members : []);
      setCrmClients(Array.isArray(clients) ? clients : []);
      setNotice({ type: 'ok', text: 'Datos sincronizados con PostgreSQL.' });
    } catch (error: any) {
      setNotice({ type: 'error', text: error?.message || 'No se pudo sincronizar finanzas.' });
    }
  }, [token]);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const companyExpense = transactions.filter(t => t.type === 'expense' && t.scope === 'company').reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const personalExpense = transactions.filter(t => t.type === 'expense' && t.scope === 'personal').reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const investment = transactions.filter(t => t.type === 'investment').reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const transfer = transactions.filter(t => t.type === 'transfer').reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const mrr = contracts.filter(c => c.status === 'active' && c.billingCycle === 'monthly').reduce((acc, c) => acc + Number(c.valueUSD || 0), 0);
    const grossContracts = contracts.reduce((acc, c) => acc + Number(c.valueUSD || 0), 0);
    const receivable = contracts.filter(c => c.status !== 'active').reduce((acc, c) => acc + Number(c.valueUSD || 0), 0);
    const projected = mrr + receivable;
    const adSpend = transactions.filter(t => String(t.category || '').toLowerCase().includes('publicidad') || String(t.workType || '').toLowerCase().includes('ads')).reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const marketingIncome = transactions.filter(t => t.type === 'income' && (String(t.category || '').toLowerCase().includes('marketing') || String(t.workType || '').toLowerCase().includes('ads'))).reduce((acc, t) => acc + Number(t.amountUSD || 0), 0);
    const roas = adSpend > 0 ? marketingIncome / adSpend : 0;
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const retention = contracts.length > 0 ? (activeContracts / contracts.length) * 100 : 0;
    const productivity = team.length > 0 ? Math.min(100, (transactions.length / Math.max(team.length, 1)) * 12) : 0;
    return {
      income, companyExpense, personalExpense, investment, transfer, mrr, grossContracts,
      receivable, projected, adSpend, marketingIncome, roas, retention, productivity,
      net: income - companyExpense - personalExpense - investment
    };
  }, [transactions, contracts]);

  const billingSchedule = useMemo(() => {
    const now = new Date();
    return contracts
      .filter(c => c.nextBilling)
      .map(c => ({
        ...c,
        dueDate: new Date(c.nextBilling),
        daysUntil: Math.ceil((new Date(c.nextBilling).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = `${contract.client || ''} ${contract.service || ''}`.toLowerCase().includes(contractSearch.toLowerCase());
      const matchesStatus = contractStatus === 'all' || contract.status === contractStatus;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, contractSearch, contractStatus]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const haystack = `${transaction.description || ''} ${transaction.category || ''} ${transaction.paymentMethod || ''} ${transaction.workType || ''}`.toLowerCase();
      return haystack.includes(transactionSearch.toLowerCase());
    });
  }, [transactions, transactionSearch]);

  const alerts = useMemo(() => {
    const now = new Date();
    const inSeven = new Date();
    inSeven.setDate(now.getDate() + 7);
    const endingContracts = contracts.filter(c => c.endDate && new Date(c.endDate) <= inSeven);
    const billingDue = billingSchedule.filter(item => item.daysUntil >= 0 && item.daysUntil <= 7);
    const cashLow = totals.net < Math.max(totals.companyExpense * 0.25, 500);
    const campaignLow = totals.adSpend > 0 && totals.roas > 0 && totals.roas < 1.5;
    return { endingContracts, billingDue, cashLow, campaignLow };
  }, [billingSchedule, contracts, totals]);

  const automationRegister = useMemo(() => {
    const events = [
      {
        title: 'Pago recibido',
        rule: 'Genera factura, activa contrato/proyecto y crea tarea de kickoff',
        status: 'Activo',
        level: 'success'
      },
      {
        title: 'Campana baja rendimiento',
        rule: alerts.campaignLow ? 'ROAS bajo: pausar anuncios y revisar creativo' : 'ROAS estable o sin datos de pauta',
        status: alerts.campaignLow ? 'Alerta' : 'Monitoreando',
        level: alerts.campaignLow ? 'danger' : 'normal'
      },
      {
        title: 'Flujo de caja bajo',
        rule: alerts.cashLow ? 'Activar alerta financiera y revisar cobros/gastos' : 'Caja dentro del rango operativo',
        status: alerts.cashLow ? 'Alerta' : 'OK',
        level: alerts.cashLow ? 'danger' : 'success'
      }
    ];
    return events;
  }, [alerts]);

  const validateBudget = () => {
    const totalPercent = ['reinvestPercent', 'savingsPercent', 'payrollPercent', 'ownerProfitPercent']
      .reduce((acc, key) => acc + Number((contractForm as any)[key] || 0), 0);
    if (!required(contractForm.client) || !required(contractForm.service) || !required(contractForm.valueUSD) || !required(contractForm.startDate)) {
      return 'Cliente, servicio, valor e inicio de contrato son obligatorios.';
    }
    if (Number(contractForm.valueUSD) <= 0) return 'El valor del servicio debe ser mayor a cero.';
    if (contractForm.endDate && contractForm.endDate < contractForm.startDate) return 'La fecha de cierre no puede ser anterior al inicio.';
    if (Math.round(totalPercent) !== 100) return 'Los porcentajes de presupuesto deben sumar 100%.';
    return '';
  };

  const syncContractFormFromClient = useCallback((clientId: string) => {
    const client = crmClients.find(item => String(item.id) === clientId);
    if (!client) return;
    setContractForm(prev => ({
      ...prev,
      client: client.name || prev.client,
      service: client.service || prev.service,
      valueUSD: client.value || client.service_value || prev.valueUSD,
      startDate: client.contract_start || prev.startDate,
      endDate: client.contract_end || prev.endDate,
      billingCycle: client.billing_cycle || prev.billingCycle,
      notes: [prev.notes, `CRM: ${client.name}`].filter(Boolean).join('\n')
    }));
  }, [crmClients]);

  const syncTransactionFromContract = useCallback((contractId: string) => {
    const contract = contracts.find(item => String(item.id) === contractId);
    if (!contract) return;
    setTransactionForm(prev => ({
      ...prev,
      contractId,
      description: prev.description || `${contract.client} - ${contract.service}`,
      amountUSD: prev.amountUSD || contract.valueUSD || '',
      type: prev.type || 'income',
      category: prev.category || 'Operacion'
    }));
  }, [contracts]);

  const saveContract = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    const error = validateBudget();
    if (error) return setNotice({ type: 'error', text: error });
    setSaving(true);
    try {
      await adminService.createContract({
        ...contractForm,
        valueUSD: Number(contractForm.valueUSD),
        expectedCostUSD: Number(contractForm.expectedCostUSD) || 0,
        reinvestPercent: Number(contractForm.reinvestPercent),
        savingsPercent: Number(contractForm.savingsPercent),
        payrollPercent: Number(contractForm.payrollPercent),
        ownerProfitPercent: Number(contractForm.ownerProfitPercent)
      }, token);
      setContractForm(prev => ({ ...prev, client: '', service: '', valueUSD: '', expectedCostUSD: '', notes: '' }));
      await fetchFinance();
    } catch (error: any) {
      setNotice({ type: 'error', text: error?.message || 'No se pudo guardar el contrato.' });
    } finally {
      setSaving(false);
    }
  };

  const saveTransaction = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    if (!required(transactionForm.description) || !required(transactionForm.amountUSD) || Number(transactionForm.amountUSD) <= 0) {
      return setNotice({ type: 'error', text: 'Descripcion y valor mayor a cero son obligatorios.' });
    }
    setSaving(true);
    try {
      await adminService.createTransaction({
        ...transactionForm,
        amountUSD: Number(transactionForm.amountUSD),
        collaboratorId: transactionForm.collaboratorId || null,
        contractId: transactionForm.contractId || null
      }, token);
      setTransactionForm(prev => ({ ...prev, description: '', amountUSD: '', notes: '' }));
      await fetchFinance();
    } catch (error: any) {
      setNotice({ type: 'error', text: error?.message || 'No se pudo guardar el movimiento.' });
    } finally {
      setSaving(false);
    }
  };

  const saveTeamMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    if (!required(teamForm.name) || !required(teamForm.role)) {
      return setNotice({ type: 'error', text: 'Nombre y rol del colaborador son obligatorios.' });
    }
    setSaving(true);
    try {
      await adminService.createTeamMember({ ...teamForm, rateUSD: Number(teamForm.rateUSD) || 0 }, token);
      setTeamForm({ name: '', role: '', email: '', phone: '', rateUSD: '', rateCycle: 'project', active: true, notes: '' });
      await fetchFinance();
    } catch (error: any) {
      setNotice({ type: 'error', text: error?.message || 'No se pudo guardar el colaborador.' });
    } finally {
      setSaving(false);
    }
  };

  const contractBudget = (contract: any) => {
    const value = Number(contract.valueUSD || 0);
    const cost = Number(contract.expectedCostUSD || 0);
    const base = Math.max(value - cost, 0);
    return {
      base,
      reinvest: base * (Number(contract.reinvestPercent || 0) / 100),
      savings: base * (Number(contract.savingsPercent || 0) / 100),
      payroll: base * (Number(contract.payrollPercent || 0) / 100),
      owner: base * (Number(contract.ownerProfitPercent || 0) / 100)
    };
  };

  return (
    <div className="flex flex-col gap-8 min-h-[80vh]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center border border-yellow-500/30">
              <DollarSign size={24} />
            </div>
            Finanzas Reales
          </h2>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 ml-16">Empresa, personal, contratos, equipo y caja sincronizada</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setCurrency(currency === 'USD' ? 'COP' : 'USD')} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase">{currency}</button>
          <button onClick={fetchFinance} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase flex items-center gap-2"><RefreshCcw size={14} /> Sync</button>
          {(['overview', 'contracts', 'transactions', 'team', 'personal', 'automations'] as const).map(tab => (
            <button key={tab} onClick={() => setSubTab(tab)} className={`px-4 py-3 rounded-xl text-xs font-black uppercase border ${subTab === tab ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-white/50 border-white/10'}`}>
              {tab === 'overview' ? 'Panel' : tab === 'contracts' ? 'Contratos' : tab === 'transactions' ? 'Caja' : tab === 'team' ? 'Equipo' : tab === 'personal' ? 'Personal' : 'Automatizaciones'}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-xs font-bold uppercase tracking-widest ${notice.type === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {notice.type === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {notice.text}
        </div>
      )}

      {subTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {[
              ['Ingresos', totals.income, Wallet],
              ['Gastos empresa', totals.companyExpense, Briefcase],
              ['Gastos personales', totals.personalExpense, Receipt],
              ['Utilidad neta', totals.net, DollarSign],
              ['MRR contratos', totals.mrr, RefreshCcw]
            ].map(([label, value, Icon]: any) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                <Icon size={20} className="text-yellow-400 mb-4" />
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-2">{label}</p>
                <p className="text-2xl font-black">{money(value, currency)}</p>
              </div>
            ))}
          </div>

          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><BarChart3 className="text-yellow-400" /> KPIs ejecutivos</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  ['Ventas mensuales', totals.income, 'Crecimiento'],
                  ['Rentabilidad', totals.income > 0 ? (totals.net / totals.income) * 100 : 0, 'Beneficio %'],
                  ['ROAS', totals.roas, 'Publicidad'],
                  ['Retencion clientes', totals.retention, 'Fidelizacion %'],
                  ['Productividad', totals.productivity, 'Eficiencia %'],
                  ['Cuentas por cobrar', totals.receivable, 'Cobranza']
                ].map(([label, value, goal]: any) => (
                  <div key={label} className="bg-black/30 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">{label}</p>
                    <p className="text-2xl font-black mt-2">
                      {label === 'ROAS' ? `${Number(value).toFixed(2)}x` : String(goal).includes('%') ? `${Number(value).toFixed(1)}%` : money(value, currency)}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-yellow-400 mt-2">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><Target className="text-blue-400" /> Areas del negocio</h3>
              <div className="space-y-4">
                {AREA_MIX.map(([label, pct]: any) => (
                  <div key={label}>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 font-black mb-2">
                      <span>{label}</span><span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><ShieldCheck className="text-green-400" /> Distribucion inteligente empresa</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {BUSINESS_RULE.map(([label, pct]: any) => (
                  <div key={label} className="bg-black/30 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">{label} - {pct}%</p>
                    <p className="text-xl font-black mt-2">{money(Math.max(totals.net, 0) * pct / 100, currency)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><Wallet className="text-purple-400" /> Flujo de caja</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <span className={BUDGET}>Disponible {money(totals.net, currency)}</span>
                <span className={BUDGET}>Proyectado {money(totals.projected, currency)}</span>
                <span className={BUDGET}>Por cobrar {money(totals.receivable, currency)}</span>
                <span className={BUDGET}>Deudas/Gastos {money(totals.companyExpense + totals.personalExpense, currency)}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><AlertCircle className="text-yellow-400" /> Alertas</h3>
              {[...alerts.endingContracts.map(c => ({ ...c, kind: 'Cierre de contrato' })), ...alerts.billingDue.map(c => ({ ...c, kind: 'Facturacion proxima' }))].length === 0 && !alerts.cashLow && !alerts.campaignLow ? (
                <p className="text-white/40 text-sm">No hay vencimientos criticos en los proximos 7 dias.</p>
              ) : (
                <div className="space-y-3">
                  {alerts.cashLow && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                      <p className="text-red-400 text-xs font-black uppercase tracking-widest">Flujo de caja bajo</p>
                      <p className="text-white font-bold mt-1">Revisar cobros pendientes y pausar gastos variables.</p>
                    </div>
                  )}
                  {alerts.campaignLow && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                      <p className="text-red-400 text-xs font-black uppercase tracking-widest">Campana con bajo rendimiento</p>
                      <p className="text-white font-bold mt-1">ROAS {totals.roas.toFixed(2)}x. Sugerencia: pausar anuncios y revisar oferta/creativo.</p>
                    </div>
                  )}
                  {[...alerts.endingContracts.map(c => ({ ...c, kind: 'Cierre de contrato' })), ...alerts.billingDue.map(c => ({ ...c, kind: 'Facturacion proxima' }))].map((item, index) => (
                    <div key={`${item.id}-${item.kind}-${index}`} className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-widest">
                        <Clock size={14} />
                        {item.kind}
                      </div>
                      <p className="text-white font-bold mt-2">{item.client} - {item.service}</p>
                      <p className="text-white/60 text-xs mt-1">
                        {item.nextBilling ? `Vence: ${new Date(item.nextBilling).toLocaleDateString('es-CO')} • Restan ${item.daysUntil ?? 'N/A'} días` : 'Sin fecha de cobro registrada'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><Users className="text-blue-400" /> Equipo activo</h3>
              <div className="space-y-3">
                {team.filter(member => member.active).slice(0, 6).map(member => (
                  <div key={member.id} className="flex justify-between items-center bg-black/30 rounded-2xl p-4">
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">{member.role}</p>
                    </div>
                    <span className="text-xs font-bold text-green-400">{money(member.rate_usd, currency)} / {member.rate_cycle}</span>
                  </div>
                ))}
                {team.length === 0 && <p className="text-white/40 text-sm">Aun no hay colaboradores registrados.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'contracts' && (
        <div className="grid xl:grid-cols-12 gap-8">
          <form onSubmit={saveContract} className="xl:col-span-4 bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><Save className="text-yellow-400" /> Nuevo contrato</h3>
            <select value={contractForm.client ? '__selected__' : ''} onChange={(e) => {
              if (e.target.value === '__selected__') return;
              syncContractFormFromClient(e.target.value);
            }} className={FIELD}>
              <option value="__selected__">Seleccionar cliente CRM</option>
              {crmClients.map(client => (
                <option key={client.id} value={client.id}>{client.name} - {client.service}</option>
              ))}
            </select>
            <input required placeholder="Cliente" value={contractForm.client} onChange={e => setContractForm({ ...contractForm, client: e.target.value })} className={FIELD} />
            <input required placeholder="Servicio contratado" value={contractForm.service} onChange={e => setContractForm({ ...contractForm, service: e.target.value })} className={FIELD} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" min="0" placeholder="Valor USD" value={contractForm.valueUSD} onChange={e => setContractForm({ ...contractForm, valueUSD: e.target.value })} className={FIELD} />
              <input type="number" min="0" placeholder="Costo USD" value={contractForm.expectedCostUSD} onChange={e => setContractForm({ ...contractForm, expectedCostUSD: e.target.value })} className={FIELD} />
            </div>
            <select value={contractForm.billingCycle} onChange={e => setContractForm({ ...contractForm, billingCycle: e.target.value })} className={FIELD}>
              <option value="daily">Diario</option>
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
              <option value="unique">Unico</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input required type="date" value={contractForm.startDate} onChange={e => setContractForm({ ...contractForm, startDate: e.target.value })} className={FIELD} />
              <input type="date" value={contractForm.endDate} onChange={e => setContractForm({ ...contractForm, endDate: e.target.value })} className={FIELD} />
            </div>
            <input type="date" value={contractForm.nextBilling} onChange={e => setContractForm({ ...contractForm, nextBilling: e.target.value })} className={FIELD} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min="0" max="100" placeholder="% Reinvertir" value={contractForm.reinvestPercent} onChange={e => setContractForm({ ...contractForm, reinvestPercent: e.target.value })} className={FIELD} />
              <input type="number" min="0" max="100" placeholder="% Ahorro" value={contractForm.savingsPercent} onChange={e => setContractForm({ ...contractForm, savingsPercent: e.target.value })} className={FIELD} />
              <input type="number" min="0" max="100" placeholder="% Equipo" value={contractForm.payrollPercent} onChange={e => setContractForm({ ...contractForm, payrollPercent: e.target.value })} className={FIELD} />
              <input type="number" min="0" max="100" placeholder="% Ganancia" value={contractForm.ownerProfitPercent} onChange={e => setContractForm({ ...contractForm, ownerProfitPercent: e.target.value })} className={FIELD} />
            </div>
            <textarea placeholder="Notas" value={contractForm.notes} onChange={e => setContractForm({ ...contractForm, notes: e.target.value })} className={`${FIELD} min-h-[90px]`} />
            <button disabled={saving} className="w-full bg-yellow-500 text-black rounded-2xl py-4 text-xs font-black uppercase tracking-widest flex justify-center gap-2"><Plus size={16} /> Guardar contrato</button>
          </form>

          <div className="xl:col-span-8 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-4 flex flex-col md:flex-row gap-3 md:items-center">
              <div className="flex items-center gap-2 flex-1 bg-black/30 border border-white/10 rounded-2xl px-4 py-3">
                <Search size={16} className="text-white/40" />
                <input value={contractSearch} onChange={e => setContractSearch(e.target.value)} placeholder="Buscar cliente o servicio" className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-full" />
              </div>
              <select value={contractStatus} onChange={e => setContractStatus(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white">
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="pending">Pendientes</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            {filteredContracts.map(contract => {
              const budget = contractBudget(contract);
              return (
                <div key={contract.id} className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-black uppercase">{contract.client}</h4>
                      <p className="text-white/50 text-sm">{contract.service}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Inicio {contract.startDate || 'sin fecha'} - Cierre {contract.endDate || 'abierto'} - {contract.billingCycle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-400">{money(contract.valueUSD, currency)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Base utilidad {money(budget.base, currency)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    <span className={BUDGET}>Reinvertir {money(budget.reinvest, currency)}</span>
                    <span className={BUDGET}>Ahorro {money(budget.savings, currency)}</span>
                    <span className={BUDGET}>Equipo {money(budget.payroll, currency)}</span>
                    <span className={BUDGET}>Ganancia {money(budget.owner, currency)}</span>
                  </div>
                </div>
              );
            })}
            {filteredContracts.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-white/10 p-10 text-center text-white/40 text-sm">
                No hay contratos que coincidan con el filtro.
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'transactions' && (
        <div className="grid xl:grid-cols-12 gap-8">
          <form onSubmit={saveTransaction} className="xl:col-span-4 bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><Wallet className="text-green-400" /> Movimiento</h3>
            <input required placeholder="Descripcion" value={transactionForm.description} onChange={e => setTransactionForm({ ...transactionForm, description: e.target.value })} className={FIELD} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" min="0" placeholder="Valor USD" value={transactionForm.amountUSD} onChange={e => setTransactionForm({ ...transactionForm, amountUSD: e.target.value })} className={FIELD} />
              <select value={transactionForm.type} onChange={e => setTransactionForm({ ...transactionForm, type: e.target.value })} className={FIELD}>
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
                <option value="investment">Inversion</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={transactionForm.date} onChange={e => setTransactionForm({ ...transactionForm, date: e.target.value })} className={FIELD} />
              <input type="date" value={transactionForm.activityDate} onChange={e => setTransactionForm({ ...transactionForm, activityDate: e.target.value })} className={FIELD} />
            </div>
            <select value={transactionForm.scope} onChange={e => setTransactionForm({ ...transactionForm, scope: e.target.value })} className={FIELD}>
              <option value="company">Empresa</option>
              <option value="personal">Personal</option>
            </select>
            <input placeholder="Categoria" value={transactionForm.category} onChange={e => setTransactionForm({ ...transactionForm, category: e.target.value })} className={FIELD} />
            <input placeholder="Metodo: transferencia, efectivo, tarjeta..." value={transactionForm.paymentMethod} onChange={e => setTransactionForm({ ...transactionForm, paymentMethod: e.target.value })} className={FIELD} />
            <input placeholder="Tipo de trabajo / actividad" value={transactionForm.workType} onChange={e => setTransactionForm({ ...transactionForm, workType: e.target.value })} className={FIELD} />
            <select value={transactionForm.collaboratorId} onChange={e => setTransactionForm({ ...transactionForm, collaboratorId: e.target.value })} className={FIELD}>
              <option value="">Sin colaborador</option>
              {team.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
            <select value={transactionForm.contractId} onChange={(e) => {
              setTransactionForm({ ...transactionForm, contractId: e.target.value });
              syncTransactionFromContract(e.target.value);
            }} className={FIELD}>
              <option value="">Sin contrato</option>
              {contracts.map(contract => <option key={contract.id} value={contract.id}>{contract.client} - {contract.service}</option>)}
            </select>
            <textarea placeholder="Notas" value={transactionForm.notes} onChange={e => setTransactionForm({ ...transactionForm, notes: e.target.value })} className={`${FIELD} min-h-[90px]`} />
            <button disabled={saving} className="w-full bg-green-500 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest flex justify-center gap-2"><Save size={16} /> Registrar</button>
          </form>

          <div className="xl:col-span-8 space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-4 flex items-center gap-2">
              <Search size={16} className="text-white/40" />
              <input value={transactionSearch} onChange={e => setTransactionSearch(e.target.value)} placeholder="Buscar movimiento, categoría o método" className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-full" />
            </div>
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{tx.description}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{tx.date} - {tx.category} - {tx.scope} - {tx.paymentMethod || 'sin metodo'}</p>
                  {(tx.collaboratorName || tx.workType || tx.notes) && <p className="text-xs text-white/50 mt-2">{tx.collaboratorName || ''} {tx.workType ? `- ${tx.workType}` : ''} {tx.notes ? `- ${tx.notes}` : ''}</p>}
                </div>
                <span className={`text-xl font-black ${tx.type === 'income' ? 'text-green-400' : tx.scope === 'personal' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}{money(tx.amountUSD, currency)}
                </span>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-white/10 p-10 text-center text-white/40 text-sm">
                No hay movimientos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'team' && (
        <div className="grid xl:grid-cols-12 gap-8">
          <form onSubmit={saveTeamMember} className="xl:col-span-4 bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4">
            <h3 className="text-xl font-black uppercase flex items-center gap-3"><Users className="text-blue-400" /> Colaborador</h3>
            <input required placeholder="Nombre" value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} className={FIELD} />
            <input required placeholder="Rol / cargo" value={teamForm.role} onChange={e => setTeamForm({ ...teamForm, role: e.target.value })} className={FIELD} />
            <input type="email" placeholder="Email" value={teamForm.email} onChange={e => setTeamForm({ ...teamForm, email: e.target.value })} className={FIELD} />
            <input placeholder="Telefono" value={teamForm.phone} onChange={e => setTeamForm({ ...teamForm, phone: e.target.value })} className={FIELD} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min="0" placeholder="Tarifa USD" value={teamForm.rateUSD} onChange={e => setTeamForm({ ...teamForm, rateUSD: e.target.value })} className={FIELD} />
              <select value={teamForm.rateCycle} onChange={e => setTeamForm({ ...teamForm, rateCycle: e.target.value })} className={FIELD}>
                <option value="hour">Hora</option>
                <option value="day">Dia</option>
                <option value="project">Proyecto</option>
                <option value="month">Mes</option>
              </select>
            </div>
            <textarea placeholder="Notas" value={teamForm.notes} onChange={e => setTeamForm({ ...teamForm, notes: e.target.value })} className={`${FIELD} min-h-[90px]`} />
            <button disabled={saving} className="w-full bg-blue-500 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest flex justify-center gap-2"><Plus size={16} /> Guardar colaborador</button>
          </form>

          <div className="xl:col-span-8 grid md:grid-cols-2 gap-4">
            {team.map(member => (
              <div key={member.id} className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-black uppercase">{member.name}</h4>
                    <p className="text-white/50">{member.role}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">{member.email || 'sin email'} - {member.phone || 'sin telefono'}</p>
                  </div>
                  <button onClick={async () => { if (token && confirm('Eliminar colaborador?')) { await adminService.deleteTeamMember(member.id, token); fetchFinance(); } }} className="text-white/30 hover:text-red-400"><Trash2 size={18} /></button>
                </div>
                <p className="mt-5 text-green-400 font-black">{money(member.rate_usd, currency)} / {member.rate_cycle}</p>
                {member.notes && <p className="text-sm text-white/50 mt-3">{member.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'personal' && (
        <div className="grid xl:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><Wallet className="text-purple-400" /> Portal personal del dueño</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Patrimonio neto operativo</p>
                <p className="text-3xl font-black mt-2">{money(Math.max(totals.net, 0), currency)}</p>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Flujo personal mensual</p>
                <p className="text-3xl font-black mt-2">{money(totals.personalExpense * -1, currency)}</p>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Inversiones registradas</p>
                <p className="text-3xl font-black mt-2">{money(totals.investment, currency)}</p>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Deudas/gastos personales</p>
                <p className="text-3xl font-black mt-2">{money(totals.personalExpense, currency)}</p>
              </div>
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Fuentes personales recomendadas</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Salario fijo', 40],
                ['Dividendos', 30],
                ['Inversiones', 20],
                ['Otros', 10]
              ].map(([label, pct]: any) => (
                <span key={label} className={BUDGET}>{label} {pct}% - {money(Math.max(totals.net, 0) * pct / 100, currency)}</span>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3"><ShieldCheck className="text-green-400" /> Metodo CEO financiero</h3>
            <div className="space-y-4">
              {PERSONAL_RULE.map(([label, pct]: any) => (
                <div key={label} className="bg-black/30 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 font-black mb-2">
                    <span>{label}</span><span>{pct}%</span>
                  </div>
                  <p className="text-xl font-black">{money(Math.max(totals.net, 0) * pct / 100, currency)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'automations' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {automationRegister.map(item => (
            <div key={item.title} className={`rounded-[32px] p-8 border ${
              item.level === 'danger' ? 'bg-red-500/10 border-red-500/20' : item.level === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center mb-6">
                {item.level === 'danger' ? <AlertCircle className="text-red-400" /> : <CheckCircle2 className="text-green-400" />}
              </div>
              <h3 className="text-xl font-black uppercase mb-3">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{item.rule}</p>
              <span className="inline-flex px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-[10px] font-black uppercase tracking-widest">{item.status}</span>
            </div>
          ))}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-black uppercase mb-6">Comprobaciones importantes del sistema</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <span className={BUDGET}>Contratos sincronizados: {contracts.length}</span>
              <span className={BUDGET}>Movimientos en caja: {transactions.length}</span>
              <span className={BUDGET}>Colaboradores activos: {team.filter(m => m.active).length}</span>
              <span className={BUDGET}>Facturacion por cobrar: {money(totals.receivable, currency)}</span>
              <span className={BUDGET}>ROAS actual: {totals.roas.toFixed(2)}x</span>
              <span className={BUDGET}>Caja disponible: {money(totals.net, currency)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
