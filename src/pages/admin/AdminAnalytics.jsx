import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts';

const revenueData = [
  { month: 'Sep', revenue: 12400, expenses: 8200, profit: 4200 },
  { month: 'Oct', revenue: 18200, expenses: 11000, profit: 7200 },
  { month: 'Nov', revenue: 15800, expenses: 9500, profit: 6300 },
  { month: 'Dec', revenue: 28900, expenses: 15000, profit: 13900 },
  { month: 'Jan', revenue: 22100, expenses: 12000, profit: 10100 },
  { month: 'Feb', revenue: 19500, expenses: 11500, profit: 8000 },
  { month: 'Mar', revenue: 31200, expenses: 16000, profit: 15200 },
  { month: 'Apr', revenue: 27800, expenses: 14500, profit: 13300 },
  { month: 'May', revenue: 35600, expenses: 18000, profit: 17600 },
  { month: 'Jun', revenue: 41200, expenses: 20000, profit: 21200 },
  { month: 'Jul', revenue: 38900, expenses: 19000, profit: 19900 },
  { month: 'Aug', revenue: 45800, expenses: 22000, profit: 23800 },
];

const categoryData = [
  { name: 'Phones',          sales: 145, revenue: 98500  },
  { name: 'Laptops',         sales: 89,  revenue: 125000 },
  { name: 'Tablets',         sales: 67,  revenue: 45000  },
  { name: 'Headphones',      sales: 234, revenue: 52000  },
  { name: 'Watches',         sales: 112, revenue: 78000  },
  { name: 'Cameras',         sales: 45,  revenue: 89000  },
  { name: 'Accessories',     sales: 389, revenue: 28000  },
  { name: 'Beauty Tech',     sales: 78,  revenue: 35000  },
];

const customerGrowth = [
  { month: 'Sep', new: 45, returning: 23 },
  { month: 'Oct', new: 62, returning: 31 },
  { month: 'Nov', new: 58, returning: 28 },
  { month: 'Dec', new: 89, returning: 45 },
  { month: 'Jan', new: 71, returning: 38 },
  { month: 'Feb', new: 65, returning: 42 },
  { month: 'Mar', new: 95, returning: 52 },
  { month: 'Apr', new: 88, returning: 61 },
  { month: 'May', new: 112, returning: 74 },
  { month: 'Jun', new: 134, returning: 89 },
  { month: 'Jul', new: 121, returning: 95 },
  { month: 'Aug', new: 156, returning: 112 },
];

const pieData = [
  { name: 'Phones',      value: 28, color: '#2563eb' },
  { name: 'Laptops',     value: 22, color: '#7c3aed' },
  { name: 'Headphones',  value: 18, color: '#06b6d4' },
  { name: 'Watches',     value: 15, color: '#10b981' },
  { name: 'Others',      value: 17, color: '#f59e0b' },
];

const COLORS = ['#2563eb', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];

function AdminAnalytics() {
  const [period, setPeriod] = useState('Monthly');

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalProfit  = revenueData.reduce((s, d) => s + d.profit, 0);
  const totalSales   = categoryData.reduce((s, d) => s + d.sales, 0);

  return (
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics 📈</h1>
            <p className="text-gray-400 text-sm mt-1">Track your store performance and growth</p>
          </div>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Revenue',    value: `$${(totalRevenue/1000).toFixed(1)}K`, change: '+12.5%', up: true,  icon: '💰', color: 'bg-blue-50',   text: 'text-blue-600'   },
            { label: 'Total Profit',     value: `$${(totalProfit/1000).toFixed(1)}K`,  change: '+8.2%',  up: true,  icon: '📈', color: 'bg-green-50',  text: 'text-green-600'  },
            { label: 'Total Sales',      value: totalSales,                             change: '+15.3%', up: true,  icon: '🛍️', color: 'bg-purple-50', text: 'text-purple-600' },
            { label: 'Avg Order Value',  value: `$${(totalRevenue/totalSales).toFixed(0)}`, change: '-2.1%', up: false, icon: '🎯', color: 'bg-orange-50', text: 'text-orange-600' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center text-xl`}>
                  {kpi.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</p>
              <p className="text-gray-400 text-sm">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Revenue vs Profit</h3>
              <p className="text-gray-400 text-sm">12 month overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gr1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gr2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#gr1)" dot={false} />
              <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#10b981" strokeWidth={2.5} fill="url(#gr2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Category Sales */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Revenue Share</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-col gap-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Customer Growth</h3>
              <p className="text-gray-400 text-sm">New vs returning customers</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="new"       name="New Customers"       stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="returning" name="Returning Customers" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
}

export default AdminAnalytics;