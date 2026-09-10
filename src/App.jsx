/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  FileText,
  Fingerprint,
  FolderKanban,
  Gauge,
  HardDrive,
  LogOut,
  Mail,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  UserRound,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ADMIN_TOKEN_KEY = 'spilight_admin_access_token';

const ADMIN_USER_KEY = 'spilight_admin_user';
const normalizeApiUrl = (url) => {
  if (!url) return 'http://localhost:8082/api';
  const trimmedUrl = url.replace(/\/$/, '');
  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const API_BASE_URL = normalizeApiUrl(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_URL);

const getStoredAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
const setStoredAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
const clearStoredAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);
const setStoredAdmin = (admin) => localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
const clearStoredAdmin = () => localStorage.removeItem(ADMIN_USER_KEY);

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = getStoredAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: Gauge },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Billing', path: '/billing', icon: CreditCard, children: [
    { name: 'Rev&Inv', path: '/billing' },
    { name: 'Receipts', path: '/billing/receipts' },
  ] },
  { name: 'Invoice / Receipt', path: '/invoice-receipt', icon: FileText },
  { name: 'Infrastructure', path: '/infrastructure', icon: Server },
  { name: 'Audit logs', path: '/audit-logs', icon: Shield },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const users = [
  { name: 'Henry Douglas', email: 'henry@acme.com', workspace: 'Acme Production', plan: 'Team', status: 'Active', spend: '$428' },
  { name: 'Maya Chen', email: 'maya@northstar.io', workspace: 'Northstar Labs', plan: 'Enterprise', status: 'Active', spend: '$2,840' },
  { name: 'Ife Ade', email: 'ife@paycore.africa', workspace: 'Paycore', plan: 'Team', status: 'Review', spend: '$916' },
  { name: 'Lena Brooks', email: 'lena@orbit.dev', workspace: 'Orbit Dev', plan: 'Launch', status: 'Active', spend: '$0' },
  { name: 'Samir Khan', email: 'samir@stackline.co', workspace: 'Stackline', plan: 'Team', status: 'Suspended', spend: '$188' },
];

const infrastructure = [
  { region: 'fra1', services: 184, cpu: '62%', memory: '71%', status: 'Healthy' },
  { region: 'iad1', services: 142, cpu: '48%', memory: '57%', status: 'Healthy' },
  { region: 'lhr1', services: 97, cpu: '76%', memory: '82%', status: 'Watch' },
  { region: 'sin1', services: 51, cpu: '34%', memory: '41%', status: 'Healthy' },
];

const auditEvents = [
  { actor: 'admin@spilight.app', action: 'Suspended workspace Stackline', time: '8 minutes ago', severity: 'High' },
  { actor: 'billing@spilight.app', action: 'Retried failed invoice INV-1045', time: '22 minutes ago', severity: 'Medium' },
  { actor: 'system', action: 'Scaled fra1 capacity pool by 12 nodes', time: '1 hour ago', severity: 'Info' },
  { actor: 'maya@northstar.io', action: 'Enabled SAML for Northstar Labs', time: '3 hours ago', severity: 'Info' },
  { actor: 'admin@spilight.app', action: 'Updated enterprise credit limit', time: '5 hours ago', severity: 'Medium' },
];

const chartData = [
  { day: 'Mon', revenue: 4200, compute: 580 },
  { day: 'Tue', revenue: 5100, compute: 620 },
  { day: 'Wed', revenue: 4800, compute: 760 },
  { day: 'Thu', revenue: 6200, compute: 810 },
  { day: 'Fri', revenue: 7100, compute: 940 },
  { day: 'Sat', revenue: 6900, compute: 880 },
  { day: 'Sun', revenue: 8200, compute: 1040 },
];

const operationalAlerts = [
  { text: 'Failed deployment', tone: 'text-red-300' },
  { text: 'Receipt successfully sent', tone: 'text-emerald-300' },
  { text: 'Pending support', tone: 'text-amber-300' },
  { text: 'Discontinued account', tone: 'text-red-300' },
  { text: 'Reminder subscription sent', tone: 'text-emerald-300' },
];

const StatCard = ({ label, value, detail, icon: Icon, compact = false }) => (
  <article className={`rounded-lg border border-black/10 bg-white ${compact ? 'p-4' : 'p-5'}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-black/48">{label}</p>
        <p className={`${compact ? 'mt-1.5 text-2xl' : 'mt-3 text-3xl'} font-semibold tracking-[-0.04em] text-black`}>{value}</p>
        <p className={`${compact ? 'mt-1' : 'mt-2'} text-xs text-black/42`}>{detail}</p>
      </div>
      <span className={`grid place-items-center rounded-md bg-black text-white ${compact ? 'h-9 w-9' : 'h-10 w-10'}`}>
        <Icon size={18} />
      </span>
    </div>
  </article>
);

const StatusBadge = ({ status }) => {
  const active = ['Active', 'Paid', 'Healthy', 'Info'];
  const warning = ['Open', 'Review', 'Watch', 'Medium'];
  const className = active.includes(status)
    ? 'bg-black text-white'
    : warning.includes(status)
      ? 'border border-black/15 bg-white text-black'
      : 'bg-[#f2f2f2] text-black/58 border border-black/10';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>{status}</span>;
};

const AdminModal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
      <button className="absolute inset-0 bg-black/55" onClick={onClose} aria-label="Close modal" />
      <section className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 p-5">
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-black/10 hover:bg-black hover:text-white" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const invoiceStatuses = ['draft', 'open', 'paid', 'overdue', 'void'];

const emptyInvoiceForm = {
  userId: '',
  title: '',
  amount: '',
  currency: 'USD',
  status: 'open',
  issuedDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  notes: '',
};

const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).replaceAll('_', ' ') : '';

const formatMoney = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(amount || 0));

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [formState, setFormState] = useState({
    loading: false,
    error: '',
  });

  const updateField = (field) => (event) => {
    setCredentials((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setFormState({ loading: true, error: '' });

    try {
      const response = await adminApi.post('/admin-auth/login', credentials);
      const { accessToken, admin } = response.data.data;
      setStoredAdminToken(accessToken);
      setStoredAdmin(admin);
      navigate('/dashboard');
    } catch (error) {
      setFormState({
        loading: false,
        error: getErrorMessage(error, 'Unable to sign in'),
      });
    }
  };

  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        <Link to="/" className="relative flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-sm font-black text-black">S</span>
          <span className="text-lg font-semibold tracking-[-0.03em]">spilight admin</span>
        </Link>
        <div className="relative max-w-xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Internal operations</p>
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.04em]">Monitor users, billing, and infrastructure from one console.</h1>
          <p className="mt-6 text-base leading-7 text-white/56">Built for the team running Spilight: support, finance, infrastructure, and security.</p>
        </div>
        <p className="relative text-sm text-white/38">Private administrative surface. Authorized staff only.</p>
      </section>

      <main className="flex items-center justify-center px-5 py-12">
        <form
          onSubmit={submitLogin}
          className="w-full max-w-md"
        >
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-sm font-black text-black">S</span>
            <span className="text-lg font-semibold tracking-[-0.03em]">spilight admin</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Sign in</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Admin access.</h2>
          <p className="mt-3 text-sm leading-6 text-white/52">Use your assigned Spilight administrator credentials.</p>
          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Admin email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={updateField('email')}
                className="h-12 w-full rounded-md border border-white/12 bg-white/[0.04] px-4 text-sm outline-none focus:border-white/40"
                placeholder="admin@spilight.app"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={updateField('password')}
                className="h-12 w-full rounded-md border border-white/12 bg-white/[0.04] px-4 text-sm outline-none focus:border-white/40"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            {formState.error && (
              <p className="rounded-md border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white">
                {formState.error}
              </p>
            )}
            <button
              disabled={formState.loading}
              className="h-12 w-full rounded-md bg-white text-sm font-bold text-black hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/55"
            >
              {formState.loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const billingRouteActive = location.pathname.startsWith('/billing');
  const [billingMenuOpen, setBillingMenuOpen] = useState(billingRouteActive);

  useEffect(() => {
    if (billingRouteActive) setBillingMenuOpen(true);
  }, [billingRouteActive]);

  const signOut = async () => {
    try {
      await adminApi.post('/admin-auth/logout');
    } catch (error) {
      // Local sign out still matters if the API is unavailable.
    } finally {
      clearStoredAdminToken();
      clearStoredAdmin();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black lg:grid lg:grid-cols-[280px_1fr]">
      {sidebarOpen && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-black text-white transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-sm font-black text-black">S</span>
            <span className="text-lg font-semibold tracking-[-0.03em]">spilight admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={18} /></button>
        </div>
        <div className="border-b border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/34">Environment</p>
          <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-sm font-semibold">Production</p>
            <p className="mt-1 text-xs text-white/42">All regions monitored</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ name, path, icon: Icon, children: childItems }) => childItems ? (
            <div key={path}>
              <button
                type="button"
                onClick={() => setBillingMenuOpen((open) => !open)}
                aria-expanded={billingMenuOpen}
                aria-controls="billing-submenu"
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${billingRouteActive ? 'bg-white/10 text-white' : 'text-white/56'}`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{name}</span>
                <ChevronRight size={15} className={`text-white/40 transition-transform duration-200 ${billingMenuOpen ? 'rotate-90' : ''}`} />
              </button>
              {billingMenuOpen && (
                <div id="billing-submenu" className="ml-6 mt-1 space-y-1 border-l border-white/15 pl-3">
                  {childItems.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end={child.path === '/billing'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) => `flex items-center rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${isActive ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-white text-black' : 'text-white/56 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-md border border-white/12 px-3 py-2 text-sm font-semibold text-white/62 hover:bg-white/10 hover:text-white">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-md border border-black/10 lg:hidden" aria-label="Open sidebar">
              <Server size={18} />
            </button>
            <div>
              <p className="text-sm font-semibold">Operations console</p>
              <p className="text-xs text-black/42">Spilight platform administration</p>
            </div>
          </div>
          <div className="hidden w-full max-w-md items-center rounded-md border border-black/10 bg-[#f7f7f7] px-3 py-2 md:flex">
            <Search size={16} className="mr-2 text-black/34" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-black/34" placeholder="Search users, invoices, regions, audit events" />
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white text-black/58 hover:text-black" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-md bg-black text-sm font-bold text-white">AD</div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

const Overview = () => {
  const [dashboard, setDashboard] = useState({
    metrics: {
      totalUsers: 0,
      activeUsers: 0,
      totalInvoices: 0,
      openInvoiceCount: 0,
      openRevenue: 0,
      paidInvoiceCount: 0,
      paidRevenue: 0,
      overdueInvoiceCount: 0,
      overdueRevenue: 0,
    },
    accountTypes: {
      personal: 0,
      business: 0,
    },
    latestAccounts: [],
    alerts: [],
  });
  const [accountsPage, setAccountsPage] = useState(1);
  const [dashboardState, setDashboardState] = useState({
    loading: true,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setDashboardState({ loading: true, error: '' });

      try {
        const [dashboardResponse, usersResponse] = await Promise.all([
          adminApi.get('/admin-billing/dashboard'),
          adminApi.get('/admin-auth/users'),
        ]);

        if (isMounted) {
          const dashboardData = dashboardResponse.data?.data || dashboard;
          const users = usersResponse.data?.data?.users || [];
          const personalAccounts = users.filter((user) => ['personal', 'creator'].includes(String(user.userType).toLowerCase())).length;
          const businessAccounts = users.filter((user) => ['business', 'brand'].includes(String(user.userType).toLowerCase())).length;

          setDashboard({
            ...dashboardData,
            accountTypes: {
              personal: personalAccounts,
              business: businessAccounts,
            },
            latestAccounts: users,
          });
        }
      } catch (error) {
        if (isMounted) {
          setDashboardState({
            loading: false,
            error: getErrorMessage(error, 'Unable to load dashboard data'),
          });
        }
        return;
      }

      if (isMounted) {
        setDashboardState({ loading: false, error: '' });
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const { metrics } = dashboard;
  const accountsPerPage = 3;
  const totalAccountPages = Math.max(1, Math.ceil((dashboard.latestAccounts?.length || 0) / accountsPerPage));
  const visibleAccounts = (dashboard.latestAccounts || []).slice(
    (accountsPage - 1) * accountsPerPage,
    accountsPage * accountsPerPage,
  );

  return (
    <AdminLayout>
      <div className="space-y-2">
        <PageHeader compact title="Good Evening Simi," body="Here's what's happening across your platform." />
        {dashboardState.error && <div className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-black">{dashboardState.error}</div>}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px_390px]">
          <section className="rounded-lg border border-black/10 bg-white p-4">
            <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.03em]">Personal and business accounts</h2>
                <p className="mt-1 text-sm text-black/46">Account distribution across the platform</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-black/58">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-black" />Personal</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-black/35" />Business</span>
              </div>
            </div>
            <div className="h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: 'Personal', accounts: dashboard.accountTypes?.personal || 0, color: '#000000' },
                    { name: 'Business', accounts: dashboard.accountTypes?.business || 0, color: '#a3a3a3' },
                  ]}
                  margin={{ top: 16, right: 48, bottom: 16, left: 8 }}
                  barCategoryGap="38%"
                >
                  <CartesianGrid stroke="#e5e5e5" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={72} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f5f5f5' }} formatter={(value) => [value, 'Accounts']} />
                  <Bar dataKey="accounts" name="Accounts" radius={[0, 5, 5, 0]} minPointSize={4} label={{ position: 'right', fill: '#525252', fontSize: 12 }}>
                    {['#000000', '#a3a3a3'].map((color) => <Cell key={color} fill={color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded-lg border border-black/10 bg-white p-4">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Revenue status</h2>
              <p className="mt-1 text-sm text-black/46">Paid revenue and open invoices</p>
            </div>
            <div className="relative mt-1 h-[145px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Paid revenue', value: Number(metrics.paidRevenue) || 0, color: '#000000' },
                      { name: 'Open invoices', value: Number(metrics.openRevenue) || 0, color: '#a3a3a3' },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={3}
                  >
                    {['#000000', '#a3a3a3'].map((color) => <Cell key={color} fill={color} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [formatMoney(value), name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">Total</p>
                  <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-black">
                    {dashboardState.loading ? '...' : formatMoney((Number(metrics.paidRevenue) || 0) + (Number(metrics.openRevenue) || 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 border-t border-black/10 pt-3">
              {[
                { label: 'Paid revenue', value: metrics.paidRevenue, color: 'bg-black' },
                { label: 'Open invoices', value: metrics.openRevenue, color: 'bg-black/35' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-black/58">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-semibold text-black">{dashboardState.loading ? '...' : formatMoney(item.value)}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-white/10 bg-[#111111] shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-white">
                  <AlertTriangle size={14} />
                </span>
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Operational alerts</h2>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">
                {operationalAlerts.length} updates
              </span>
            </div>
            <div className="space-y-1.5 px-4 pb-4">
              {operationalAlerts.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-md bg-white/[0.045] px-3 py-2 transition-colors hover:bg-white/[0.075]"
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current ${item.tone}`} />
                  <p className={`text-sm font-medium leading-5 ${item.tone}`}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard compact label="Customers" value={dashboardState.loading ? '...' : String(metrics.totalUsers)} detail="Total registered customers" icon={Users} />
          <StatCard compact label="Active users" value={dashboardState.loading ? '...' : String(metrics.activeUsers)} detail="Currently active users" icon={Users} />
          <StatCard compact label="Paid Revenue" value={dashboardState.loading ? '...' : formatMoney(metrics.paidRevenue)} detail={`${metrics.paidInvoiceCount} paid invoices`} icon={CreditCard} />
          <StatCard compact label="Open Invoices" value={dashboardState.loading ? '...' : formatMoney(metrics.openRevenue)} detail={`${metrics.openInvoiceCount} invoices pending`} icon={Activity} />
        </div>
        <section className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <div className="flex flex-col justify-between gap-2 border-b border-black/10 px-4 py-2.5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Latest Accounts</h2>
            </div>
            {!dashboardState.loading && dashboard.latestAccounts.length > 0 && (
              <p className="text-xs font-medium text-black/42">
                Showing {(accountsPage - 1) * accountsPerPage + 1}–{Math.min(accountsPage * accountsPerPage, dashboard.latestAccounts.length)} of {dashboard.latestAccounts.length}
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-[0.12em] text-black/40">
                <tr>
                  {['ID', 'Customer Name', 'Account Type', 'Subscription Type', 'Status'].map((column) => (
                    <th key={column} className="px-4 py-2 font-bold">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {dashboardState.loading && (
                  <tr><td colSpan={5} className="px-4 py-5 text-center text-sm text-black/46">Loading latest accounts...</td></tr>
                )}
                {!dashboardState.loading && visibleAccounts.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-5 text-center text-sm text-black/46">No accounts found.</td></tr>
                )}
                {!dashboardState.loading && visibleAccounts.map((account) => {
                  const accountType = ['business', 'brand'].includes(String(account.userType).toLowerCase()) ? 'Business' : 'Personal';
                  const subscriptionType = account.subscriptionType || account.plan || 'Hobby';
                  const status = String(account.status).toLowerCase() === 'active' ? 'Active' : 'Inactive';

                  return (
                    <tr key={account.id}>
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-black/58" title={String(account.id)}>
                        {String(account.id).slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-sm font-medium text-black">{account.name || account.email}</p>
                        <p className="mt-0.5 text-xs text-black/42">{account.email}</p>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-black/62">{accountType}</td>
                      <td className="px-4 py-2.5 text-sm text-black/62">{subscriptionType}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalAccountPages > 1 && (
            <div className="flex items-center justify-between gap-4 border-t border-black/10 px-4 py-2.5">
              <button
                type="button"
                onClick={() => setAccountsPage((page) => Math.max(1, page - 1))}
                disabled={accountsPage === 1}
                className="inline-flex h-8 items-center gap-2 rounded-md border border-black/10 px-3 text-xs font-bold transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-black"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalAccountPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setAccountsPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={accountsPage === page ? 'page' : undefined}
                    className={`grid h-8 w-8 place-items-center rounded-md text-xs font-bold ${accountsPage === page ? 'bg-black text-white' : 'border border-black/10 text-black/58 hover:border-black hover:text-black'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAccountsPage((page) => Math.min(totalAccountPages, page + 1))}
                disabled={accountsPage === totalAccountPages}
                className="inline-flex h-8 items-center gap-2 rounded-md border border-black/10 px-3 text-xs font-bold transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-black"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

const PageHeader = ({ eyebrow, title, body, action, compact = false }) => (
  <div className={`flex flex-col justify-between lg:flex-row lg:items-end ${compact ? 'gap-2' : 'gap-5'}`}>
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/42">{eyebrow}</p>}
      <h1 className={`${compact ? (eyebrow ? 'mt-1 text-3xl' : 'text-3xl') : (eyebrow ? 'mt-3 text-4xl' : 'text-4xl')} font-semibold tracking-[-0.04em] text-black`}>{title}</h1>
      <p className={`${compact ? 'mt-1 leading-5' : 'mt-2 leading-6'} max-w-2xl text-sm text-black/54`}>{body}</p>
    </div>
    {action}
  </div>
);

const UsersPage = () => {
  const navigate = useNavigate();
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setLoadingUsers(true);
      setUsersError('');

      try {
        const response = await adminApi.get('/admin-auth/users');
        if (isMounted) {
          setAdminUsers(response.data?.data?.users || []);
        }
      } catch (error) {
        if (isMounted) {
          setUsersError(error.response?.data?.message || 'Unable to load users');
        }
      } finally {
        if (isMounted) {
          setLoadingUsers(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const rows = adminUsers.map((user) => [
    <div key={`${user.email}-profile`}>
      <p className="font-medium text-black">{user.name}</p>
      <p className="mt-1 text-xs text-black/42">{user.email}</p>
    </div>,
    user.userType,
    user.subscriptionPlan || 'Hobby',
    new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    <StatusBadge key={`${user.email}-status`} status={user.status === 'active' ? 'Active' : user.status} />,
    user.verified ? 'Verified' : 'Unverified',
    <button key={`${user.email}-view`} onClick={() => navigate(`/users/${user.id}`)} className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white">View</button>,
  ]);
  const normalizedUserStatuses = adminUsers.map((user) => String(user.status || '').toLowerCase());
  const now = new Date();
  const newUsersThisMonth = adminUsers.filter((user) => {
    const registeredAt = new Date(user.createdAt);
    return !Number.isNaN(registeredAt.getTime())
      && registeredAt.getFullYear() === now.getFullYear()
      && registeredAt.getMonth() === now.getMonth();
  }).length;
  const userMetrics = [
    { label: 'Total', value: adminUsers.length, detail: 'All registered accounts', icon: Users },
    { label: 'Active', value: normalizedUserStatuses.filter((status) => status === 'active').length, detail: 'Currently active accounts', icon: Activity },
    { label: 'Deactivated', value: normalizedUserStatuses.filter((status) => ['deactivated', 'inactive', 'disabled'].includes(status)).length, detail: 'Deactivated accounts', icon: AlertTriangle },
    { label: 'New', value: newUsersThisMonth, detail: 'Registered this month', icon: Clock },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader eyebrow="Users" title="User and workspace management" body="Review accounts, workspace plans, risk status, and support actions." action={<button className="h-10 rounded-md bg-black px-4 text-sm font-bold text-white">Export users</button>} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {userMetrics.map((metric) => (
            <StatCard
              key={metric.label}
              compact
              label={metric.label}
              value={loadingUsers ? '...' : String(metric.value)}
              detail={metric.detail}
              icon={metric.icon}
            />
          ))}
        </div>
        {usersError && <div className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-black">{usersError}</div>}
        {loadingUsers ? (
          <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/54">Loading users...</div>
        ) : (
          <DataTable
            columns={['User', 'Type', 'Plan', 'Date joined', 'Status', 'Email', '']}
            rows={rows}
            columnWidths={['26%', '10%', '12%', '15%', '12%', '12%', '13%']}
          />
        )}
      </div>
    </AdminLayout>
  );
};

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [pageState, setPageState] = useState({ loading: true, error: '', user: null, invoices: [] });
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([adminApi.get('/admin-auth/users'), adminApi.get('/admin-billing/invoices')])
      .then(([usersResponse, invoicesResponse]) => {
        if (!isMounted) return;
        const user = (usersResponse.data?.data?.users || []).find((item) => item.id === userId);
        setPageState({ loading: false, error: user ? '' : 'User not found', user: user || null, invoices: (invoicesResponse.data?.data?.invoices || []).filter((invoice) => invoice.userId === userId) });
      })
      .catch((error) => {
        if (isMounted) setPageState({ loading: false, error: getErrorMessage(error, 'Unable to load user'), user: null, invoices: [] });
      });
    return () => { isMounted = false; };
  }, [userId]);

  if (pageState.loading) return <AdminLayout><div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/54">Loading user...</div></AdminLayout>;
  if (!pageState.user) return <AdminLayout><div className="rounded-lg border border-black/10 bg-white p-6"><p className="font-semibold">{pageState.error}</p><Link to="/users" className="mt-4 inline-flex text-sm font-bold underline">Back to users</Link></div></AdminLayout>;

  const user = pageState.user;
  const initials = user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const joined = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const paidInvoices = pageState.invoices.filter((invoice) => invoice.status === 'paid');
  const totalPaid = paidInvoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const billingCurrency = paidInvoices[0]?.currency || pageState.invoices[0]?.currency || 'USD';
  const nextBillingInvoice = pageState.invoices
    .filter((invoice) => invoice.status === 'open' && invoice.dueDate)
    .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))[0];
  const nextBillingDate = nextBillingInvoice
    ? new Date(`${nextBillingInvoice.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not scheduled';
  const deactivateAccount = async () => {
    if (!window.confirm(`Deactivate ${user.name}'s account? They will no longer be able to use the account.`)) return;
    setDeactivating(true);
    try {
      await adminApi.patch(`/admin-auth/users/${user.id}/status`, { status: 'inactive' });
      setPageState((current) => ({ ...current, user: { ...current.user, status: 'inactive' } }));
    } catch (error) {
      setPageState((current) => ({ ...current, error: getErrorMessage(error, 'Unable to deactivate account') }));
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link to="/users" className="inline-flex items-center gap-2 text-sm font-bold text-black/55 hover:text-black"><ChevronLeft size={16} /> Back to users</Link>
        <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-black text-xl font-bold text-white">{initials}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-[-0.04em]">{user.name}</h1>
                {user.status === 'active'
                  ? <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span>
                  : <StatusBadge status={user.status} />}
              </div>
              <p className="mt-1 text-sm text-black/48">{user.email}</p>
              <p className="mt-2 text-xs text-black/42">Joined {joined} · {user.subscriptionPlan || 'Hobby'} plan</p>
            </div>
          </div>
          <div className="flex gap-8 border-t border-black/10 px-6">
            {[['profile', 'Profile'], ['billing', 'Billing history']].map(([value, label]) => <button key={value} type="button" onClick={() => setActiveTab(value)} className={`border-b-2 py-4 text-sm font-bold ${activeTab === value ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'}`}>{label}</button>)}
          </div>
        </section>
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {pageState.error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{pageState.error}</div>}
            <section className="rounded-xl border border-black/10 bg-white p-6">
              <h2 className="text-lg font-semibold">Profile</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['Name', user.name, UserRound],
                  ['Email', user.email, Mail],
                  ['User ID', user.id, Fingerprint],
                  ['Account type', formatStatus(user.userType), Building2],
                  ['Current plan', user.subscriptionPlan || 'Hobby', BadgeDollarSign],
                  ['Next billing date', nextBillingDate, CalendarDays],
                  ['Storage used', user.storageUsed || 'Not available', HardDrive],
                  ['Bandwidth', user.bandwidth || 'Not available', Wifi],
                  ['Projects', user.projectCount ?? 'Not available', FolderKanban],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="flex min-w-0 items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-black/[0.05] text-black/55"><Icon size={17} /></span>
                    <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-black/35">{label}</p><p className="mt-1.5 break-words text-sm font-semibold">{value}</p></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="flex flex-col justify-between gap-4 rounded-xl border border-red-200 bg-red-50/60 p-6 sm:flex-row sm:items-center">
              <div><h2 className="font-semibold text-red-800">Deactivate account</h2><p className="mt-1 text-sm text-red-700/70">Prevent this user from accessing their account.</p></div>
              <button type="button" onClick={deactivateAccount} disabled={deactivating || user.status === 'inactive'} className="h-10 shrink-0 rounded-md bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300">{user.status === 'inactive' ? 'Account deactivated' : deactivating ? 'Deactivating...' : 'Deactivate account'}</button>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <div className="w-full sm:max-w-xs">
                <StatCard compact label="Total paid" value={formatMoney(totalPaid, billingCurrency)} detail={`${paidInvoices.length} paid invoice${paidInvoices.length === 1 ? '' : 's'}`} icon={CreditCard} />
              </div>
            </div>
            <DataTable columns={['Invoice', 'Description', 'Amount', 'Status', 'Issued']} rows={pageState.invoices.map((invoice) => [invoice.invoiceNumber, invoice.title, formatMoney(invoice.amount, invoice.currency), <StatusBadge key={invoice.id} status={formatStatus(invoice.status)} />, invoice.issuedDate])} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const BillingPage = () => {
  const navigate = useNavigate();
  const [billingUsers, setBillingUsers] = useState([]);
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm);
  const [billingState, setBillingState] = useState({
    loading: true,
    saving: false,
    error: '',
  });

  const loadBilling = async () => {
    setBillingState((current) => ({ ...current, loading: true, error: '' }));

    try {
      const [usersResponse, invoicesResponse, receiptsResponse] = await Promise.all([
        adminApi.get('/admin-auth/users'),
        adminApi.get('/admin-billing/invoices'),
        adminApi.get('/admin-billing/receipts'),
      ]);

      setBillingUsers(usersResponse.data?.data?.users || []);
      const receipts = receiptsResponse.data?.data?.receipts || [];
      const receiptInvoiceIds = new Set(receipts.map((receipt) => receipt.sourceInvoiceId).filter(Boolean));
      const receiptInvoiceNumbers = new Set(receipts
        .map((receipt) => receipt.receiptNumber?.startsWith('RCT-') ? receipt.receiptNumber.slice(4) : null)
        .filter(Boolean));
      setBillingInvoices((invoicesResponse.data?.data?.invoices || []).map((invoice) => ({
        ...invoice,
        receiptSent: invoice.receiptSent
          || receiptInvoiceIds.has(invoice.id)
          || receiptInvoiceNumbers.has(invoice.invoiceNumber),
      })));
    } catch (error) {
      setBillingState((current) => ({
        ...current,
        error: getErrorMessage(error, 'Unable to load billing data'),
      }));
    } finally {
      setBillingState((current) => ({ ...current, loading: false }));
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const openCreateInvoice = () => {
    setInvoiceForm({
      ...emptyInvoiceForm,
      userId: billingUsers[0]?.id || '',
      issuedDate: new Date().toISOString().slice(0, 10),
    });
  };

  const closeInvoiceModal = () => {
    setInvoiceForm(emptyInvoiceForm);
  };

  const updateInvoiceField = (field) => (event) => {
    setInvoiceForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const saveInvoice = async (event) => {
    event.preventDefault();
    setBillingState((current) => ({ ...current, saving: true, error: '' }));

    try {
      await adminApi.post('/admin-billing/invoices', invoiceForm);

      await loadBilling();
      closeInvoiceModal();
    } catch (error) {
      setBillingState((current) => ({
        ...current,
        error: getErrorMessage(error, 'Unable to save invoice'),
      }));
    } finally {
      setBillingState((current) => ({ ...current, saving: false }));
    }
  };

  const updateInvoiceStatus = async (invoice, status) => {
    setBillingState((current) => ({ ...current, error: '' }));

    try {
      const response = await adminApi.patch(`/admin-billing/invoices/${invoice.id}/status`, { status });
      const updatedInvoice = response.data?.data?.invoice;
      setBillingInvoices((current) => current.map((item) => item.id === updatedInvoice.id ? updatedInvoice : item));
      setPendingStatusUpdate(null);
    } catch (error) {
      setBillingState((current) => ({
        ...current,
        error: getErrorMessage(error, 'Unable to update invoice status'),
      }));
    }
  };

  const generateReceipt = (invoice) => {
    navigate('/invoice-receipt', { state: { receiptInvoice: invoice } });
  };

  const openInvoices = billingInvoices.filter((invoice) => ['open', 'overdue'].includes(invoice.status));
  const paidInvoices = billingInvoices.filter((invoice) => invoice.status === 'paid');
  const openTotal = openInvoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const paidTotal = paidInvoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const overdueInvoices = billingInvoices.filter((invoice) => invoice.status === 'overdue');
  const modalOpen = invoiceForm !== emptyInvoiceForm;

  const rows = billingInvoices.map((invoice) => [
    <div key={`${invoice.id}-invoice`}>
      <p className="font-medium text-black">{invoice.invoiceNumber}</p>
      <p className="mt-1 text-xs text-black/42">{invoice.title}</p>
    </div>,
    <div key={`${invoice.id}-customer`}>
      <p className="font-medium text-black">{invoice.customerName}</p>
      <p className="mt-1 text-xs text-black/42">{invoice.customerEmail}</p>
    </div>,
    formatMoney(invoice.amount, invoice.currency),
    <select
      key={`${invoice.id}-status`}
      value={invoice.status}
      onChange={(event) => {
        if (event.target.value !== invoice.status) setPendingStatusUpdate({ invoice, status: event.target.value });
      }}
      className="h-9 rounded-md border border-black/10 bg-white px-2 text-xs font-bold outline-none focus:border-black"
    >
      {invoiceStatuses.map((status) => (
        <option key={status} value={status}>{formatStatus(status)}</option>
      ))}
    </select>,
    invoice.dueDate || 'No due date',
    invoice.status === 'paid' && invoice.receiptSent ? (
      <span key={`${invoice.id}-receipt-sent`} className="text-xs font-bold text-emerald-600">Sent</span>
    ) : invoice.status === 'paid' ? (
      <button key={`${invoice.id}-receipt`} onClick={() => generateReceipt(invoice)} className="rounded-md bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-black/75">Generate receipt</button>
    ) : null,
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Billing"
          title="Revenue and invoices"
          body="Create invoices for Spilight users, edit billing details, and update payment status from the admin console."
          action={<button onClick={openCreateInvoice} className="h-10 rounded-md bg-black px-4 text-sm font-bold text-white">Create invoice</button>}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Collected" value={formatMoney(paidTotal)} detail={`${paidInvoices.length} paid invoices`} icon={CreditCard} />
          <StatCard label="Open invoices" value={formatMoney(openTotal)} detail={`${openInvoices.length} invoices pending`} icon={Activity} />
          <StatCard label="Overdue" value={String(overdueInvoices.length)} detail="Invoices requiring follow-up" icon={AlertTriangle} />
          <StatCard label="Total invoices" value={String(billingInvoices.length)} detail="Created in Spilight" icon={Database} />
        </div>
        {billingState.error && <div className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-black">{billingState.error}</div>}
        {billingState.loading ? (
          <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/54">Loading invoices...</div>
        ) : (
          <DataTable
            columns={['Invoice', 'Customer', 'Amount', 'Status', 'Due date', '']}
            rows={rows}
          />
        )}
        <AdminModal open={modalOpen} onClose={closeInvoiceModal} title="Create invoice">
          <form onSubmit={saveInvoice} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">User</label>
                <select value={invoiceForm.userId} onChange={updateInvoiceField('userId')} className="h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-black" required>
                  <option value="">Select user</option>
                  {billingUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} · {user.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">Status</label>
                <select value={invoiceForm.status} onChange={updateInvoiceField('status')} className="h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-black">
                  {invoiceStatuses.map((status) => (
                    <option key={status} value={status}>{formatStatus(status)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">Title</label>
              <input value={invoiceForm.title} onChange={updateInvoiceField('title')} className="h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black" placeholder="Monthly platform access" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">Amount</label>
                <input type="number" min="0" step="0.01" value={invoiceForm.amount} onChange={updateInvoiceField('amount')} className="h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">Currency</label>
                <input value={invoiceForm.currency} onChange={updateInvoiceField('currency')} maxLength={3} className="h-11 w-full rounded-md border border-black/10 px-3 text-sm uppercase outline-none focus:border-black" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">Issued date</label>
                <input type="date" value={invoiceForm.issuedDate} onChange={updateInvoiceField('issuedDate')} className="h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black" required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">Due date</label>
              <input type="date" value={invoiceForm.dueDate} onChange={updateInvoiceField('dueDate')} className="h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/70">Notes</label>
              <textarea value={invoiceForm.notes} onChange={updateInvoiceField('notes')} rows={4} className="w-full rounded-md border border-black/10 px-3 py-3 text-sm outline-none focus:border-black" placeholder="Optional internal note or invoice memo" />
            </div>
            <div className="flex justify-end gap-3 border-t border-black/10 pt-5">
              <button type="button" onClick={closeInvoiceModal} className="h-10 rounded-md border border-black/10 px-4 text-sm font-bold hover:bg-black hover:text-white">Cancel</button>
              <button disabled={billingState.saving} className="h-10 rounded-md bg-black px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-black/40">
                {billingState.saving ? 'Saving...' : 'Save invoice'}
              </button>
            </div>
          </form>
        </AdminModal>
        <AdminModal open={Boolean(pendingStatusUpdate)} onClose={() => setPendingStatusUpdate(null)} title="Confirm status change">
          {pendingStatusUpdate && (
            <div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-semibold text-black">Please confirm this action</p>
                    <p className="mt-1 text-sm leading-6 text-black/58">
                      You are changing invoice <span className="font-semibold text-black">{pendingStatusUpdate.invoice.invoiceNumber}</span> from <span className="font-semibold text-black">{formatStatus(pendingStatusUpdate.invoice.status)}</span> to <span className="font-semibold text-black">{formatStatus(pendingStatusUpdate.status)}</span>. Make sure this is intentional.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-5">
                <button type="button" onClick={() => setPendingStatusUpdate(null)} className="h-10 rounded-md border border-black/10 px-4 text-sm font-bold hover:bg-black hover:text-white">Cancel</button>
                <button type="button" onClick={() => updateInvoiceStatus(pendingStatusUpdate.invoice, pendingStatusUpdate.status)} className="h-10 rounded-md bg-black px-4 text-sm font-bold text-white hover:bg-black/75">Confirm change</button>
              </div>
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

const ReceiptsPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [pageState, setPageState] = useState({ loading: true, error: '' });

  useEffect(() => {
    let isMounted = true;
    adminApi.get('/admin-billing/receipts')
      .then((response) => {
        if (isMounted) {
          setReceipts(response.data?.data?.receipts || []);
          setPageState({ loading: false, error: '' });
        }
      })
      .catch((error) => {
        if (isMounted) setPageState({ loading: false, error: getErrorMessage(error, 'Unable to load receipts') });
      });
    return () => { isMounted = false; };
  }, []);

  const rows = receipts.map((receipt) => [
    <div key={`${receipt.id}-receipt`}><p className="font-mono font-medium">{receipt.receiptNumber}</p><p className="mt-1 text-xs text-black/42">{receipt.description}</p></div>,
    <div key={`${receipt.id}-customer`}><p className="font-medium">{receipt.customerName}</p><p className="mt-1 text-xs text-black/42">{receipt.customerEmail}</p></div>,
    formatMoney(receipt.amount, receipt.currency),
    receipt.paidDate,
    <button key={`${receipt.id}-view`} onClick={() => setSelectedReceipt(receipt)} className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white">View</button>,
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader eyebrow="Billing" title="Receipts" body="Review every successful receipt sent to Spilight customers." />
        {pageState.error && <div className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium">{pageState.error}</div>}
        {pageState.loading ? (
          <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/54">Loading receipts...</div>
        ) : rows.length ? (
          <DataTable columns={['Receipt', 'Customer', 'Amount', 'Paid date', 'View']} rows={rows} />
        ) : (
          <div className="rounded-lg border border-black/10 bg-white p-8 text-center text-sm text-black/50">No successful receipts have been sent yet.</div>
        )}
        <AdminModal open={Boolean(selectedReceipt)} onClose={() => setSelectedReceipt(null)} title={selectedReceipt ? `Receipt ${selectedReceipt.receiptNumber}` : 'Receipt'}>
          {selectedReceipt && (
            <div className="space-y-5">
              <div className="grid gap-5 rounded-lg bg-[#f7f7f7] p-5 sm:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wider text-black/38">Customer</p><p className="mt-2 font-semibold">{selectedReceipt.customerName}</p><p className="mt-1 text-xs text-black/48">{selectedReceipt.customerEmail}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-black/38">Paid date</p><p className="mt-2 font-semibold">{selectedReceipt.paidDate}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-black/38">Description</p><p className="mt-2 font-semibold">{selectedReceipt.description}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-black/38">Amount paid</p><p className="mt-2 text-xl font-semibold">{formatMoney(selectedReceipt.amount, selectedReceipt.currency)}</p></div>
              </div>
              {selectedReceipt.notes && <p className="rounded-lg border border-black/10 p-4 text-sm leading-6 text-black/58">{selectedReceipt.notes}</p>}
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

const documentInputClass = 'h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition-colors focus:border-black';
const billableServices = [
  'Disk (per GB / min)',
  'Memory (per MB / min)',
  'Agent Usage',
  'vCPU (per vCPU / min)',
  'Network',
  'Object Storage (per GB-month)',
];

const InvoiceReceiptPage = () => {
  const location = useLocation();
  const receiptInvoice = location.state?.receiptInvoice;
  const today = new Date().toISOString().slice(0, 10);
  const [documentType, setDocumentType] = useState(receiptInvoice ? 'receipt' : 'invoice');
  const [details, setDetails] = useState({
    recipientUserId: receiptInvoice?.userId || '',
    sourceInvoiceId: receiptInvoice?.id || '',
    recipientName: receiptInvoice?.customerName || '',
    recipientEmail: receiptInvoice?.customerEmail || '',
    documentNumber: receiptInvoice ? `RCT-${receiptInvoice.invoiceNumber}` : `SPI-${new Date().getFullYear()}-00001`,
    issueDate: today,
    dueDate: receiptInvoice ? today : '',
    currency: receiptInvoice?.currency || 'USD',
    taxRate: String(receiptInvoice?.taxRate || 0),
    notes: receiptInvoice ? `Payment received for invoice ${receiptInvoice.invoiceNumber}.` : 'Thank you for choosing Spilight.',
  });
  const sourceLineItems = (() => {
    if (Array.isArray(receiptInvoice?.lineItems)) return receiptInvoice.lineItems;
    if (typeof receiptInvoice?.lineItems !== 'string') return [];
    try {
      const parsed = JSON.parse(receiptInvoice.lineItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const [items, setItems] = useState(() => sourceLineItems.length
    ? sourceLineItems.map((item) => ({ ...item, id: crypto.randomUUID() }))
    : receiptInvoice
      ? [{
        id: crypto.randomUUID(),
        description: receiptInvoice.title && billableServices.includes(receiptInvoice.title) ? receiptInvoice.title : billableServices[0],
        quantity: 1,
        rate: receiptInvoice.amount || 0,
      }]
      : billableServices.map((description) => ({
        id: crypto.randomUUID(),
        description,
        quantity: 1,
        rate: 0,
      })));
  const [sendState, setSendState] = useState({ sending: false, error: '', success: '' });
  const [recipientUsers, setRecipientUsers] = useState([]);
  const [recipientState, setRecipientState] = useState({ loading: true, error: '', activeField: '' });

  useEffect(() => {
    let isMounted = true;

    adminApi.get('/admin-auth/users')
      .then((response) => {
        if (isMounted) {
          setRecipientUsers(response.data?.data?.users || []);
          setRecipientState({ loading: false, error: '', activeField: '' });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setRecipientState({ loading: false, error: getErrorMessage(error, 'Unable to load customer accounts'), activeField: '' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (receiptInvoice) return;

    let isMounted = true;
    adminApi.get('/admin-billing/documents/next-number', { params: { type: documentType } })
      .then((response) => {
        const documentNumber = response.data?.data?.documentNumber;
        if (isMounted && documentNumber) {
          setDetails((current) => ({ ...current, documentNumber }));
        }
      })
      .catch(() => {
        // The server also resolves stale or duplicate numbers when sending.
      });

    return () => {
      isMounted = false;
    };
  }, [documentType, receiptInvoice]);

  const updateDetail = (field) => (event) => setDetails((current) => ({ ...current, [field]: event.target.value }));
  const selectRecipient = (user) => {
    setDetails((current) => ({
      ...current,
      recipientUserId: user.id,
      recipientName: user.name,
      recipientEmail: user.email,
    }));
    setRecipientState((current) => ({ ...current, activeField: '' }));
  };
  const updateRecipient = (field) => (event) => {
    const value = event.target.value;
    const match = recipientUsers.find((user) => String(user[field]).toLowerCase() === value.trim().toLowerCase());

    if (match) {
      selectRecipient(match);
      return;
    }

    setDetails((current) => ({
      ...current,
      recipientUserId: '',
      recipientName: field === 'name' ? value : '',
      recipientEmail: field === 'email' ? value : '',
    }));
    setRecipientState((current) => ({ ...current, activeField: field }));
  };
  const recipientMatches = (field) => {
    const query = (field === 'name' ? details.recipientName : details.recipientEmail).trim().toLowerCase();
    if (!query) return recipientUsers.slice(0, 6);

    return recipientUsers
      .filter((user) => String(field === 'name' ? user.name : user.email).toLowerCase().includes(query))
      .slice(0, 6);
  };
  const selectedRecipientIsValid = recipientUsers.some((user) => (
    user.id === details.recipientUserId
    && user.name === details.recipientName
    && user.email === details.recipientEmail
  ));
  const updateItem = (id, field, value) => setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0);
  const tax = subtotal * (Number(details.taxRate || 0) / 100);
  const total = subtotal + tax;
  const money = (value) => {
    try {
      return formatMoney(value, details.currency.toUpperCase() || 'USD');
    } catch {
      return `${details.currency.toUpperCase() || 'USD'} ${Number(value || 0).toFixed(2)}`;
    }
  };
  const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const sendDocument = async () => {
    if (!selectedRecipientIsValid) {
      setSendState({ sending: false, error: 'Select a recipient from the customer account results.', success: '' });
      return;
    }

    setSendState({ sending: true, error: '', success: '' });
    try {
      const response = await adminApi.post('/admin-billing/documents/send', {
        type: documentType,
        ...details,
        items: items.map(({ description, quantity, rate }) => ({ description, quantity: Number(quantity), rate: Number(rate) })),
      });
      const documentNumber = response.data?.data?.documentNumber;
      if (documentNumber) {
        setDetails((current) => ({ ...current, documentNumber }));
      }
      setSendState({ sending: false, error: '', success: response.data?.message || `${formatStatus(documentType)} sent successfully.` });
    } catch (error) {
      setSendState({ sending: false, error: getErrorMessage(error, `Unable to send ${documentType}`), success: '' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader eyebrow="Documents" title="Invoice / receipt generator" body="Create a billing document, review exactly how the email will look, and send it to the recipient." />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 bg-white p-3">
          <div className="flex rounded-md bg-[#f1f1f1] p-1" role="tablist" aria-label="Document type">
            {['invoice', 'receipt'].map((type) => (
              <button key={type} type="button" onClick={() => setDocumentType(type)} className={`rounded px-5 py-2 text-sm font-bold transition-colors ${documentType === type ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:text-black'}`}>
                {formatStatus(type)}
              </button>
            ))}
          </div>
          <button onClick={sendDocument} disabled={sendState.sending || !selectedRecipientIsValid} className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-bold text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/40">
            <Send size={16} /> {sendState.sending ? 'Sending...' : `Send ${documentType}`}
          </button>
        </div>

        {(sendState.error || sendState.success) && <div className={`rounded-lg border p-4 text-sm font-semibold ${sendState.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{sendState.error || sendState.success}</div>}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(500px,1.05fr)]">
          <section className="space-y-6 rounded-lg border border-black/10 bg-white p-5">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Document details</h2>
              <p className="mt-1 text-sm text-black/45">Changes appear in the preview instantly.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { field: 'name', detail: 'recipientName', label: 'Recipient name', type: 'text', placeholder: 'Search customer name' },
                { field: 'email', detail: 'recipientEmail', label: 'Recipient email', type: 'email', placeholder: 'Search customer email' },
              ].map(({ field, detail, label, type, placeholder }) => {
                const matches = recipientMatches(field);
                return (
                  <div key={field} className="relative">
                    <label className="mb-2 block text-xs font-bold text-black/55">{label}</label>
                    <input
                      type={type}
                      value={details[detail]}
                      onChange={updateRecipient(field)}
                      onFocus={() => setRecipientState((current) => ({ ...current, activeField: field }))}
                      onBlur={() => window.setTimeout(() => setRecipientState((current) => ({ ...current, activeField: '' })), 120)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setRecipientState((current) => ({ ...current, activeField: '' }));
                        if (event.key === 'Enter' && matches.length > 0) {
                          event.preventDefault();
                          selectRecipient(matches[0]);
                        }
                      }}
                      className={`${documentInputClass} ${details.recipientUserId ? 'border-emerald-300 bg-emerald-50/40' : ''}`}
                      placeholder={recipientState.loading ? 'Loading customer accounts...' : placeholder}
                      autoComplete="off"
                      disabled={recipientState.loading}
                      role="combobox"
                      aria-expanded={recipientState.activeField === field}
                      aria-autocomplete="list"
                    />
                    {recipientState.activeField === field && !recipientState.loading && (
                      <div className="absolute z-40 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-black/10 bg-white p-1 shadow-xl">
                        {matches.length > 0 ? matches.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectRecipient(user)}
                            className="block w-full rounded px-3 py-2 text-left hover:bg-black hover:text-white"
                          >
                            <span className="block truncate text-sm font-semibold">{user.name}</span>
                            <span className="block truncate text-xs opacity-55">{user.email}</span>
                          </button>
                        )) : (
                          <p className="px-3 py-3 text-sm text-black/45">No matching customer account.</p>
                        )}
                      </div>
                    )}
                    {details.recipientUserId && <p className="mt-1 text-[11px] font-medium text-emerald-700">Verified customer account</p>}
                  </div>
                );
              })}
              {recipientState.error && <p className="sm:col-span-2 text-xs font-medium text-red-600">{recipientState.error}</p>}
              <div><label className="mb-2 block text-xs font-bold text-black/55">Document number</label><input value={details.documentNumber} onChange={updateDetail('documentNumber')} className={documentInputClass} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Currency</label><input value={details.currency} onChange={updateDetail('currency')} maxLength={3} className={`${documentInputClass} uppercase`} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Issue date</label><input type="date" value={details.issueDate} onChange={updateDetail('issueDate')} className={documentInputClass} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">{documentType === 'invoice' ? 'Due date' : 'Payment date'}</label><input type="date" value={details.dueDate} onChange={updateDetail('dueDate')} className={documentInputClass} /></div>
            </div>

            <div className="border-t border-black/10 pt-5">
              <div className="mb-4"><h3 className="text-sm font-bold">Line items</h3></div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_70px_100px] gap-2">
                    <select value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} className={documentInputClass} aria-label="Service">
                      {billableServices.map((service) => <option key={service} value={service}>{service}</option>)}
                    </select>
                    <input type="number" min="0" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} className={documentInputClass} aria-label="Quantity" />
                    <input type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.id, 'rate', event.target.value)} className={documentInputClass} aria-label="Rate" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-[120px_1fr]">
              <div><label className="mb-2 block text-xs font-bold text-black/55">Tax rate (%)</label><input type="number" min="0" step="0.01" value={details.taxRate} onChange={updateDetail('taxRate')} className={documentInputClass} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Notes</label><textarea value={details.notes} onChange={updateDetail('notes')} rows={3} className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black" /></div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-black/10 bg-[#ececec] xl:sticky xl:top-24">
            <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4"><div><h2 className="text-sm font-bold">Email preview</h2><p className="mt-0.5 text-xs text-black/42">What {details.recipientEmail || 'the recipient'} will receive</p></div><Mail size={18} className="text-black/40" /></div>
            <div className="max-h-[calc(100vh-190px)] overflow-y-auto p-4 sm:p-7">
              <div className="mx-auto max-w-[620px] overflow-hidden rounded-lg bg-white shadow-[0_14px_45px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between bg-black px-7 py-6 text-white"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded bg-white text-sm font-black text-black">S</span><span className="font-semibold">spilight</span></div><span className="text-xs uppercase tracking-[0.18em] text-white/55">{documentType}</span></div>
                <div className="p-7 sm:p-9">
                  <p className="text-sm text-black/50">Hello {details.recipientName || 'Customer'},</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Your {documentType} is ready.</h3>
                  <p className="mt-3 text-sm leading-6 text-black/55">{documentType === 'invoice' ? 'Please review the billing details and amount due below.' : 'We received your payment. Here is your receipt for your records.'}</p>
                  <div className="mt-7 rounded-lg border border-black/10">
                    <div className="grid grid-cols-2 gap-5 border-b border-black/10 bg-[#f7f7f7] p-5 text-xs">
                      <div><p className="uppercase tracking-wider text-black/38">{formatStatus(documentType)} number</p><p className="mt-2 font-bold text-black">{details.documentNumber || '—'}</p></div>
                      <div><p className="uppercase tracking-wider text-black/38">Issued</p><p className="mt-2 font-bold text-black">{displayDate(details.issueDate)}</p></div>
                      <div><p className="uppercase tracking-wider text-black/38">Billed to</p><p className="mt-2 font-bold text-black">{details.recipientName || 'Customer'}</p><p className="mt-1 text-black/48">{details.recipientEmail || 'customer@example.com'}</p></div>
                      <div><p className="uppercase tracking-wider text-black/38">{documentType === 'invoice' ? 'Due' : 'Paid'}</p><p className="mt-2 font-bold text-black">{displayDate(details.dueDate)}</p></div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-[1fr_48px_90px] gap-3 border-b border-black/10 pb-3 text-[10px] font-bold uppercase tracking-wider text-black/35"><span>Description</span><span>Qty</span><span className="text-right">Amount</span></div>
                      {items.map((item) => <div key={item.id} className="grid grid-cols-[1fr_48px_90px] gap-3 border-b border-black/[0.06] py-3 text-xs"><span className="font-medium">{item.description || 'Untitled item'}</span><span className="text-black/50">{item.quantity || 0}</span><span className="text-right font-medium">{money(Number(item.quantity || 0) * Number(item.rate || 0))}</span></div>)}
                      <div className="ml-auto mt-5 w-56 space-y-2 text-xs"><div className="flex justify-between text-black/50"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-black/50"><span>Tax ({Number(details.taxRate || 0)}%)</span><span>{money(tax)}</span></div><div className="flex justify-between border-t border-black/10 pt-3 text-sm font-bold"><span>{documentType === 'invoice' ? 'Amount due' : 'Total paid'}</span><span>{money(total)}</span></div></div>
                    </div>
                  </div>
                  {details.notes && <p className="mt-6 rounded-md bg-[#f7f7f7] p-4 text-xs leading-5 text-black/50">{details.notes}</p>}
                  <p className="mt-8 text-xs leading-5 text-black/38">Questions? Reply to this email and the Spilight team will help.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

const InfrastructurePage = () => (
  <AdminLayout>
    <div className="space-y-8">
      <PageHeader eyebrow="Infrastructure" title="Regional capacity" body="Track service counts, CPU, memory, region health, and capacity warnings." action={<button className="h-10 rounded-md bg-black px-4 text-sm font-bold text-white">Add capacity</button>} />
      <DataTable columns={['Region', 'Services', 'CPU', 'Memory', 'Status']} rows={infrastructure.map((region) => [region.region, region.services, region.cpu, region.memory, <StatusBadge key={`${region.region}-status`} status={region.status} />])} />
      <div className="grid gap-4 lg:grid-cols-3">
        {['API gateway', 'Build runners', 'Managed Postgres'].map((item) => (
          <article key={item} className="rounded-lg border border-black/10 bg-white p-5">
            <p className="font-semibold">{item}</p>
            <p className="mt-2 text-sm leading-6 text-black/50">Operational with monitored failover and capacity alerts.</p>
          </article>
        ))}
      </div>
    </div>
  </AdminLayout>
);

const AuditLogsPage = () => (
  <AdminLayout>
    <div className="space-y-8">
      <PageHeader eyebrow="Audit logs" title="Security event trail" body="Review administrative actions, billing changes, workspace security updates, and automated system events." />
      <DataTable columns={['Actor', 'Action', 'Time', 'Severity']} rows={auditEvents.map((event) => [event.actor, event.action, event.time, <StatusBadge key={`${event.time}-severity`} status={event.severity} />])} />
    </div>
  </AdminLayout>
);

const SettingsPage = () => (
  <AdminLayout>
    <div className="space-y-8">
      <PageHeader eyebrow="Settings" title="Admin controls" body="Configure platform policies, billing thresholds, abuse review rules, and admin access." />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Platform policies</h2>
          <div className="mt-6 space-y-4">
            {['Require MFA for admins', 'Auto-freeze overdue enterprise invoices', 'Flag unusual compute spikes', 'Require approval for region capacity changes'].map((item) => (
              <label key={item} className="flex items-center justify-between gap-4 rounded-md border border-black/10 p-4 text-sm">
                <span>{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Billing thresholds</h2>
          <div className="mt-6 grid gap-5">
            {['Failed payment grace period', 'Default team credit limit', 'Enterprise invoice reminder window'].map((label) => (
              <div key={label}>
                <label className="mb-2 block text-sm font-medium text-black/70">{label}</label>
                <input className="h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black" defaultValue={label.includes('credit') ? '$1,000' : '7 days'} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </AdminLayout>
);

const DataTable = ({ columns, rows, columnWidths }) => (
  <section className="overflow-hidden rounded-lg border border-black/10 bg-white">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        {columnWidths && (
          <colgroup>
            {columnWidths.map((width, index) => <col key={`${width}-${index}`} style={{ width }} />)}
          </colgroup>
        )}
        <thead className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-[0.12em] text-black/40">
          <tr>{columns.map((column) => <th key={column} className="px-5 py-3 font-bold">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, index) => <td key={`${rowIndex}-${index}`} className="px-5 py-4 text-sm text-black/62">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const NotFound = () => (
  <AdminLayout>
    <div className="rounded-lg border border-black/10 bg-white p-8">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">Page not found</h1>
      <Link to="/dashboard" className="mt-5 inline-flex h-10 items-center rounded-md bg-black px-4 text-sm font-bold text-white">Back to dashboard</Link>
    </div>
  </AdminLayout>
);

const ProtectedAdminRoute = ({ children }) => {
  if (!getStoredAdminToken()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedAdminRoute><Overview /></ProtectedAdminRoute>} />
      <Route path="/users" element={<ProtectedAdminRoute><UsersPage /></ProtectedAdminRoute>} />
      <Route path="/users/:userId" element={<ProtectedAdminRoute><UserDetailsPage /></ProtectedAdminRoute>} />
      <Route path="/billing" element={<ProtectedAdminRoute><BillingPage /></ProtectedAdminRoute>} />
      <Route path="/billing/receipts" element={<ProtectedAdminRoute><ReceiptsPage /></ProtectedAdminRoute>} />
      <Route path="/invoice-receipt" element={<ProtectedAdminRoute><InvoiceReceiptPage /></ProtectedAdminRoute>} />
      <Route path="/infrastructure" element={<ProtectedAdminRoute><InfrastructurePage /></ProtectedAdminRoute>} />
      <Route path="/audit-logs" element={<ProtectedAdminRoute><AuditLogsPage /></ProtectedAdminRoute>} />
      <Route path="/settings" element={<ProtectedAdminRoute><SettingsPage /></ProtectedAdminRoute>} />
      <Route path="*" element={<ProtectedAdminRoute><NotFound /></ProtectedAdminRoute>} />
    </Routes>
  );
}

export default App;
