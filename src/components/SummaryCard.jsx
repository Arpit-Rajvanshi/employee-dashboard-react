import { formatSalary } from '../utils/formatters';

/**
 * SummaryCard — renders a single stat (e.g. Total Employees, Avg Salary).
 * Accepts `icon`, `label`, `value`, and an optional `isCurrency` flag
 * to automatically format the number.
 */
export default function SummaryCard({ icon, label, value, isCurrency = false }) {
    const displayValue = isCurrency ? formatSalary(value) : value;

    return (
        <div className="card flex items-center gap-4 p-5 hover:shadow-md transition-shadow duration-200">
            {/* Icon container with soft background */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 text-xl">
                {icon}
            </div>

            <div>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
                <p className="text-xl font-bold text-slate-800 mt-0.5">{displayValue}</p>
            </div>
        </div>
    );
}
