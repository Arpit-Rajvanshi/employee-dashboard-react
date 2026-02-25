/*
 * Display-formatting helpers.
 * Keeping these centralised avoids duplicating Intl calls across components
 * and makes it trivial to switch locales later.
 */

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

/** Format a number as ₹ with Indian grouping (e.g. ₹1,20,000) */
export function formatSalary(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return '₹0';
    return currencyFormatter.format(num);
}

/** Capitalise first letter of each word — handy for city / name display */
export function titleCase(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
