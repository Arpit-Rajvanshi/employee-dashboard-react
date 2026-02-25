/**
 * EmptyState — friendly placeholder when a list has no data.
 * Accepts a `message` prop so each page can customise the wording.
 */
export default function EmptyState({ message = 'No records found.' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            {/* Simple inline SVG icon — avoids an extra dependency for one illustration */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
            </svg>
            <p className="text-lg font-medium">{message}</p>
        </div>
    );
}
