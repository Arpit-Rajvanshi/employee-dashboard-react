import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from 'recharts';
import { fetchEmployees } from '../services/api';
import { formatSalary } from '../utils/formatters';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

/*
 * Curated colour palette for chart segments.
 * Picked to be distinct yet harmonious — avoids the default Recharts rainbow.
 */
const CHART_COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#f97316', '#eab308',
    '#22c55e', '#06b6d4',
];

/**
 * Salary Chart Page
 * -----------------
 * Visualises the first 10 employees' salaries as either a bar or pie chart.
 * Toggle lives in a button group so users can switch views without a page reload.
 */
export default function SalaryChart() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState('bar'); // 'bar' | 'pie'

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const data = await fetchEmployees();
                if (!cancelled) setEmployees(data.slice(0, 10)); // first 10 only
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    // Prepare chart-friendly data shape
    const chartData = employees.map((emp) => ({
        name: emp.name?.split(' ')[0] || 'N/A', // first name keeps labels short
        salary: Number(emp.salary) || 0,
    }));

    /** Custom tooltip shared between bar and pie charts. */
    function CustomTooltip({ active, payload }) {
        if (!active || !payload?.length) return null;
        const { name, salary } = payload[0].payload;
        return (
            <div className="card px-3 py-2 text-sm shadow-md">
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-indigo-600">{formatSalary(salary)}</p>
            </div>
        );
    }

    // ── Guards ────────────────────────────────────────
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <Spinner size="lg" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="max-w-xl mx-auto mt-20 text-center card p-8">
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button className="btn-primary" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center gap-1 cursor-pointer"
                        >
                            ← Back to Dashboard
                        </button>
                        <h2 className="text-xl font-bold text-slate-800">
                            Salary Overview — Top 10 Employees
                        </h2>
                    </div>

                    {/* Chart type toggle */}
                    <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm font-medium">
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-4 py-2 transition-colors cursor-pointer ${chartType === 'bar'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Bar Chart
                        </button>
                        <button
                            onClick={() => setChartType('pie')}
                            className={`px-4 py-2 transition-colors cursor-pointer ${chartType === 'pie'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Pie Chart
                        </button>
                    </div>
                </div>

                {/* Chart container */}
                <div className="card p-6">
                    <ResponsiveContainer width="100%" height={420}>
                        {chartType === 'bar' ? (
                            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis
                                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="salary"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={800}
                                >
                                    {chartData.map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="salary"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    innerRadius={60}
                                    paddingAngle={3}
                                    animationDuration={800}
                                    label={({ name }) => name}
                                >
                                    {chartData.map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </main>
        </>
    );
}
