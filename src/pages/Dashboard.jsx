import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../services/api';
import { formatSalary, titleCase } from '../utils/formatters';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import SummaryCard from '../components/SummaryCard';

/**
 * Dashboard Page
 * --------------
 * Central hub: fetches all employee data and renders a filterable,
 * sortable table with summary stats at the top.
 *
 * API returns: name, position, city, id, startDate, salary
 * (no email/phone — those fields aren't in this dataset).
 */
export default function Dashboard() {
    const navigate = useNavigate();

    // ── Data state ───────────────────────────────────
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ── Filter / sort controls ───────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [sortDirection, setSortDirection] = useState(''); // '' | 'asc' | 'desc'

    // Fetch employee data once on mount
    useEffect(() => {
        let cancelled = false; // prevents state updates after unmount

        async function load() {
            try {
                const data = await fetchEmployees();
                if (!cancelled) setEmployees(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    // ── Derived data ─────────────────────────────────

    // Unique city list for the dropdown filter
    const cities = useMemo(() => {
        const set = new Set(employees.map((e) => (e.city || '').toLowerCase()));
        return [...set].filter(Boolean).sort();
    }, [employees]);

    // Apply search, city filter, and sort in one pass
    const displayedEmployees = useMemo(() => {
        let result = [...employees];

        // Text search — matches against name (case-insensitive)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((e) =>
                (e.name || '').toLowerCase().includes(term)
            );
        }

        // City filter
        if (cityFilter) {
            result = result.filter(
                (e) => (e.city || '').toLowerCase() === cityFilter
            );
        }

        // Salary sort
        if (sortDirection === 'asc') {
            result.sort((a, b) => Number(a.salary) - Number(b.salary));
        } else if (sortDirection === 'desc') {
            result.sort((a, b) => Number(b.salary) - Number(a.salary));
        }

        return result;
    }, [employees, searchTerm, cityFilter, sortDirection]);

    // Summary stats — computed from the FULL dataset (not the filtered subset)
    const stats = useMemo(() => {
        if (employees.length === 0) return { total: 0, avg: 0, max: 0 };
        const salaries = employees.map((e) => Number(e.salary) || 0);
        return {
            total: employees.length,
            avg: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
            max: Math.max(...salaries),
        };
    }, [employees]);

    /** Toggle salary sort: none → asc → desc → none */
    function toggleSort() {
        setSortDirection((prev) => {
            if (prev === '') return 'asc';
            if (prev === 'asc') return 'desc';
            return '';
        });
    }

    // Sort indicator arrow for the table header
    const sortArrow =
        sortDirection === 'asc' ? ' ↑' : sortDirection === 'desc' ? ' ↓' : '';

    // ── Loading & error guards ───────────────────────
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
                <div className="max-w-xl mx-auto mt-20 text-center">
                    <div className="card p-8">
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <button className="btn-primary" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Summary cards ────────────────────────── */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <SummaryCard icon="👥" label="Total Employees" value={stats.total} />
                    <SummaryCard icon="📊" label="Average Salary" value={stats.avg} isCurrency />
                    <SummaryCard icon="🏆" label="Highest Salary" value={stats.max} isCurrency />
                </section>

                {/* ── Controls bar ─────────────────────────── */}
                <section className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                    {/* Name search */}
                    <input
                        type="text"
                        placeholder="Search by name…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 rounded-lg border border-slate-300 px-4 py-2 text-sm
                       placeholder:text-slate-400 focus:outline-none focus:ring-2
                       focus:ring-indigo-500/40 focus:border-indigo-500"
                    />

                    {/* City filter dropdown */}
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full sm:w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm
                       text-slate-700 focus:outline-none focus:ring-2
                       focus:ring-indigo-500/40 focus:border-indigo-500 cursor-pointer"
                    >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {titleCase(city)}
                            </option>
                        ))}
                    </select>

                    {/* Navigation buttons — pushed to the right on desktop */}
                    <div className="flex gap-2 sm:ml-auto">
                        <button
                            className="btn-outline text-xs sm:text-sm"
                            onClick={() => navigate('/salary-chart')}
                        >
                            📈 Salary Chart
                        </button>
                        <button
                            className="btn-outline text-xs sm:text-sm"
                            onClick={() => navigate('/city-map')}
                        >
                            🗺️ City Map
                        </button>
                    </div>
                </section>

                {/* ── Data table ───────────────────────────── */}
                {displayedEmployees.length === 0 ? (
                    <EmptyState message="No employees match your filters." />
                ) : (
                    <div className="card overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3 hidden md:table-cell">Position</th>
                                    <th className="px-5 py-3">City</th>
                                    <th className="px-5 py-3 hidden lg:table-cell">Start Date</th>
                                    <th
                                        className="px-5 py-3 cursor-pointer select-none hover:text-indigo-600 transition-colors"
                                        onClick={toggleSort}
                                        title="Click to sort by salary"
                                    >
                                        Salary{sortArrow}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedEmployees.map((emp, idx) => (
                                    <tr
                                        key={emp.id || idx}
                                        className="border-b border-slate-100 table-row-hover transition-colors"
                                        onClick={() => navigate(`/employee/${emp.id || idx}`, { state: { employee: emp } })}
                                    >
                                        <td className="px-5 py-3.5 font-medium text-slate-800">
                                            {emp.name || '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">
                                            {emp.position || '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600">{titleCase(emp.city) || '—'}</td>
                                        <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">
                                            {emp.startDate || '—'}
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-slate-800">
                                            {formatSalary(emp.salary)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </>
    );
}
