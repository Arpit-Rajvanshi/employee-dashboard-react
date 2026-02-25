/**
 * Spinner — simple animated loading indicator.
 * Uses a spinning ring with the brand colour. `size` prop lets callers
 * choose between a small inline spinner and a large full-page one.
 */
export default function Spinner({ size = 'md', className = '' }) {
    const dimensions = size === 'lg' ? 'h-12 w-12' : 'h-6 w-6';

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${dimensions} animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600`}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}
