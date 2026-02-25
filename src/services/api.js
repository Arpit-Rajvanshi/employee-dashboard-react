import axios from 'axios';

/*
 * Centralised API layer — keeps network logic out of components.
 * All endpoints go through this module so we only need to update
 * base URLs or headers in one place.
 */

const apiClient = axios.create({
    baseURL: 'https://backend.jotish.in/backend_dev',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000, // 15 s — generous but not infinite
});

/**
 * Fetch the employee list from the backend.
 * The API expects a POST with static credentials (provided in the assignment).
 *
 * Response shape from this particular API:
 * {
 *   TABLE_DATA: {
 *     data: [ ["Name", "Position", "City", "ID", "Start Date", "$Salary"], ... ]
 *   }
 * }
 *
 * Each row is an array rather than a named object, so we normalise it here
 * into a consistent shape the rest of the app can rely on.
 */
export async function fetchEmployees() {
    try {
        const response = await apiClient.post('/gettabledata.php', {
            username: 'test',
            password: '123456',
        });

        const payload = response.data;

        // Dig into the nested response structure
        const rows = payload?.TABLE_DATA?.data;

        if (!Array.isArray(rows)) {
            console.warn('[api] Unexpected response shape:', payload);
            return [];
        }

        // Transform each array row into a named object.
        // Column order (from API): Name, Position, City, ID, Start Date, Salary
        return rows.map((row) => ({
            id: String(row[3] || ''),
            name: row[0] || '',
            position: row[1] || '',
            city: row[2] || '',
            startDate: row[4] || '',
            salary: parseSalary(row[5]),    // strip "$" and commas → number
        }));
    } catch (error) {
        console.error('[api] fetchEmployees failed:', error.message);
        throw new Error(
            error.response?.data?.message ||
            'Unable to load employee data. Please try again later.'
        );
    }
}

/**
 * Convert a salary string like "$320,800" to a plain number (320800).
 * Returns 0 for anything unparseable.
 */
function parseSalary(raw) {
    if (typeof raw === 'number') return raw;
    if (!raw) return 0;
    const cleaned = String(raw).replace(/[$,]/g, '');
    const num = Number(cleaned);
    return Number.isNaN(num) ? 0 : num;
}
