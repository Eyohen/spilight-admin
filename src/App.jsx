/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CreditCard,
  Database,
  FileText,
  Gauge,
  LogOut,
  Mail,
  Plus,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
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
  { name: 'Billing', path: '/billing', icon: CreditCard },
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

const StatCard = ({ label, value, detail, icon: Icon }) => (
  <article className="rounded-lg border border-black/10 bg-white p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-black/48">{label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-black">{value}</p>
        <p className="mt-2 text-xs text-black/42">{detail}</p>
      </div>
      <span className="grid h-10 w-10 place-items-center rounded-md bg-black text-white">
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          {navItems.map(({ name, path, icon: Icon }) => (
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
    chart: [],
    alerts: [],
  });
  const [dashboardState, setDashboardState] = useState({
    loading: true,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setDashboardState({ loading: true, error: '' });

      try {
        const response = await adminApi.get('/admin-billing/dashboard');
        if (isMounted) {
          setDashboard(response.data?.data || dashboard);
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader eyebrow="Overview" title="Platform command center" body="Monitor revenue, users, invoices, failed payments, and operational risks from live API data." />
        {dashboardState.error && <div className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-black">{dashboardState.error}</div>}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active users" value={dashboardState.loading ? '...' : String(metrics.activeUsers)} detail={`${metrics.totalUsers} total users`} icon={Users} />
          <StatCard label="Paid revenue" value={dashboardState.loading ? '...' : formatMoney(metrics.paidRevenue)} detail={`${metrics.paidInvoiceCount} paid invoices`} icon={CreditCard} />
          <StatCard label="Open invoices" value={dashboardState.loading ? '...' : formatMoney(metrics.openRevenue)} detail={`${metrics.openInvoiceCount} invoices pending`} icon={Activity} />
          <StatCard label="Overdue" value={dashboardState.loading ? '...' : String(metrics.overdueInvoiceCount)} detail={`${formatMoney(metrics.overdueRevenue)} past due`} icon={AlertTriangle} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <section className="rounded-lg border border-black/10 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.03em]">Revenue and invoices</h2>
                <p className="mt-1 text-sm text-black/46">Seven-day trend from invoices</p>
              </div>
              <ArrowUpRight size={18} />
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.chart}>
                  <CartesianGrid stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#000" fill="#000" fillOpacity={0.12} />
                  <Area type="monotone" dataKey="invoices" stroke="#666" fill="#666" fillOpacity={0.08} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded-lg border border-black/10 bg-white">
            <div className="border-b border-black/10 p-5">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Operational alerts</h2>
            </div>
            <div className="divide-y divide-black/10">
              {(dashboardState.loading ? ['Loading dashboard alerts...'] : dashboard.alerts).map((item) => (
                <div key={item} className="flex gap-3 p-5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black" />
                  <p className="text-sm leading-6 text-black/62">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

const PageHeader = ({ eyebrow, title, body, action }) => (
  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/42">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-black">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/54">{body}</p>
    </div>
    {action}
  </div>
);

const UsersPage = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

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
    user.phone || 'Not provided',
    user.userType,
    <StatusBadge key={`${user.email}-status`} status={user.status === 'active' ? 'Active' : user.status} />,
    user.verified ? 'Verified' : 'Unverified',
    <button key={`${user.email}-manage`} onClick={() => setSelectedUser(user)} className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white">Manage</button>,
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader eyebrow="Users" title="User and workspace management" body="Review accounts, workspace plans, risk status, and support actions." action={<button className="h-10 rounded-md bg-black px-4 text-sm font-bold text-white">Export users</button>} />
        {usersError && <div className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-black">{usersError}</div>}
        {loadingUsers ? (
          <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/54">Loading users...</div>
        ) : (
          <DataTable
            columns={['User', 'Phone', 'Type', 'Status', 'Email', '']}
            rows={rows}
          />
        )}
        <AdminModal open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} title="Manage user">
          {selectedUser && (
            <div className="space-y-5">
              <div className="rounded-lg border border-black/10 bg-[#f7f7f7] p-4">
                <p className="font-semibold">{selectedUser.name}</p>
                <p className="mt-1 text-sm text-black/52">{selectedUser.email}</p>
                <p className="mt-1 text-sm text-black/52">{selectedUser.phone || 'No phone number'} · {selectedUser.userType}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {['Impersonate', 'Suspend', 'Reset MFA'].map((label) => <button key={label} className="h-10 rounded-md border border-black/10 text-sm font-bold hover:bg-black hover:text-white">{label}</button>)}
              </div>
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

const BillingPage = () => {
  const [billingUsers, setBillingUsers] = useState([]);
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm);
  const [billingState, setBillingState] = useState({
    loading: true,
    saving: false,
    error: '',
  });

  const loadBilling = async () => {
    setBillingState((current) => ({ ...current, loading: true, error: '' }));

    try {
      const [usersResponse, invoicesResponse] = await Promise.all([
        adminApi.get('/admin-auth/users'),
        adminApi.get('/admin-billing/invoices'),
      ]);

      setBillingUsers(usersResponse.data?.data?.users || []);
      setBillingInvoices(invoicesResponse.data?.data?.invoices || []);
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
    setSelectedInvoice(null);
    setInvoiceForm({
      ...emptyInvoiceForm,
      userId: billingUsers[0]?.id || '',
      issuedDate: new Date().toISOString().slice(0, 10),
    });
  };

  const openEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceForm({
      userId: invoice.userId,
      title: invoice.title,
      amount: String(invoice.amount),
      currency: invoice.currency,
      status: invoice.status,
      issuedDate: invoice.issuedDate || new Date().toISOString().slice(0, 10),
      dueDate: invoice.dueDate || '',
      notes: invoice.notes || '',
    });
  };

  const closeInvoiceModal = () => {
    setSelectedInvoice(null);
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
      if (selectedInvoice) {
        await adminApi.put(`/admin-billing/invoices/${selectedInvoice.id}`, invoiceForm);
      } else {
        await adminApi.post('/admin-billing/invoices', invoiceForm);
      }

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
    } catch (error) {
      setBillingState((current) => ({
        ...current,
        error: getErrorMessage(error, 'Unable to update invoice status'),
      }));
    }
  };

  const openInvoices = billingInvoices.filter((invoice) => ['open', 'overdue'].includes(invoice.status));
  const paidInvoices = billingInvoices.filter((invoice) => invoice.status === 'paid');
  const openTotal = openInvoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const paidTotal = paidInvoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const overdueInvoices = billingInvoices.filter((invoice) => invoice.status === 'overdue');
  const modalOpen = Boolean(selectedInvoice) || invoiceForm !== emptyInvoiceForm;

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
      onChange={(event) => updateInvoiceStatus(invoice, event.target.value)}
      className="h-9 rounded-md border border-black/10 bg-white px-2 text-xs font-bold outline-none focus:border-black"
    >
      {invoiceStatuses.map((status) => (
        <option key={status} value={status}>{formatStatus(status)}</option>
      ))}
    </select>,
    invoice.dueDate || 'No due date',
    <button key={`${invoice.id}-edit`} onClick={() => openEditInvoice(invoice)} className="rounded-md border border-black/10 px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white">Edit</button>,
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
        <AdminModal open={modalOpen} onClose={closeInvoiceModal} title={selectedInvoice ? 'Edit invoice' : 'Create invoice'}>
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
  const today = new Date().toISOString().slice(0, 10);
  const [documentType, setDocumentType] = useState('invoice');
  const [details, setDetails] = useState({
    recipientName: '',
    recipientEmail: '',
    documentNumber: `SPI-${new Date().getFullYear()}-00001`,
    issueDate: today,
    dueDate: '',
    currency: 'USD',
    taxRate: '0',
    notes: 'Thank you for choosing Spilight.',
  });
  const [items, setItems] = useState([{ id: crypto.randomUUID(), description: billableServices[0], quantity: 1, rate: 0 }]);
  const [sendState, setSendState] = useState({ sending: false, error: '', success: '' });

  const updateDetail = (field) => (event) => setDetails((current) => ({ ...current, [field]: event.target.value }));
  const updateItem = (id, field, value) => setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const addItem = () => setItems((current) => [...current, { id: crypto.randomUUID(), description: billableServices[0], quantity: 1, rate: 0 }]);
  const removeItem = (id) => setItems((current) => current.length === 1 ? current : current.filter((item) => item.id !== id));
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
    setSendState({ sending: true, error: '', success: '' });
    try {
      const response = await adminApi.post('/admin-billing/documents/send', {
        type: documentType,
        ...details,
        items: items.map(({ description, quantity, rate }) => ({ description, quantity: Number(quantity), rate: Number(rate) })),
      });
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
          <button onClick={sendDocument} disabled={sendState.sending} className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-bold text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/40">
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
              <div><label className="mb-2 block text-xs font-bold text-black/55">Recipient name</label><input value={details.recipientName} onChange={updateDetail('recipientName')} className={documentInputClass} placeholder="Customer name" /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Recipient email</label><input type="email" value={details.recipientEmail} onChange={updateDetail('recipientEmail')} className={documentInputClass} placeholder="customer@example.com" /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Document number</label><input value={details.documentNumber} onChange={updateDetail('documentNumber')} className={documentInputClass} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Currency</label><input value={details.currency} onChange={updateDetail('currency')} maxLength={3} className={`${documentInputClass} uppercase`} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">Issue date</label><input type="date" value={details.issueDate} onChange={updateDetail('issueDate')} className={documentInputClass} /></div>
              <div><label className="mb-2 block text-xs font-bold text-black/55">{documentType === 'invoice' ? 'Due date' : 'Payment date'}</label><input type="date" value={details.dueDate} onChange={updateDetail('dueDate')} className={documentInputClass} /></div>
            </div>

            <div className="border-t border-black/10 pt-5">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold">Line items</h3><button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-bold text-black/55 hover:text-black"><Plus size={15} /> Add item</button></div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_70px_100px_36px] gap-2">
                    <select value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} className={documentInputClass} aria-label="Service">
                      {billableServices.map((service) => <option key={service} value={service}>{service}</option>)}
                    </select>
                    <input type="number" min="0" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} className={documentInputClass} aria-label="Quantity" />
                    <input type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.id, 'rate', event.target.value)} className={documentInputClass} aria-label="Rate" />
                    <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="grid h-10 place-items-center rounded-md border border-black/10 text-black/40 hover:bg-black hover:text-white disabled:opacity-30" aria-label="Remove item"><Trash2 size={15} /></button>
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

const DataTable = ({ columns, rows }) => (
  <section className="overflow-hidden rounded-lg border border-black/10 bg-white">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
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
      <Route path="/billing" element={<ProtectedAdminRoute><BillingPage /></ProtectedAdminRoute>} />
      <Route path="/invoice-receipt" element={<ProtectedAdminRoute><InvoiceReceiptPage /></ProtectedAdminRoute>} />
      <Route path="/infrastructure" element={<ProtectedAdminRoute><InfrastructurePage /></ProtectedAdminRoute>} />
      <Route path="/audit-logs" element={<ProtectedAdminRoute><AuditLogsPage /></ProtectedAdminRoute>} />
      <Route path="/settings" element={<ProtectedAdminRoute><SettingsPage /></ProtectedAdminRoute>} />
      <Route path="*" element={<ProtectedAdminRoute><NotFound /></ProtectedAdminRoute>} />
    </Routes>
  );
}

export default App;
