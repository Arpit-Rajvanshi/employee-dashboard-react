import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Photo Result Page
 * -----------------
 * Displays the photo captured on the Employee Details page.
 * Receives the image data URL (and optionally the employee info)
 * via React Router's location state.
 */
export default function PhotoResult() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const image = state?.image;
    const employee = state?.employee;

    // If someone navigates here directly without a photo, show a fallback
    if (!image) {
        return (
            <>
                <Navbar />
                <div className="max-w-xl mx-auto mt-20 text-center">
                    <div className="card p-8">
                        <p className="text-slate-500 mb-4">No captured photo available.</p>
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
                <div className="card p-6 text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-1">
                        Captured Photo
                    </h2>

                    {employee?.name && (
                        <p className="text-sm text-slate-500 mb-6">
                            Employee: <span className="font-medium text-slate-700">{employee.name}</span>
                        </p>
                    )}

                    <img
                        src={image}
                        alt="Captured employee photo"
                        className="mx-auto rounded-lg border border-slate-200 shadow-sm max-w-full"
                    />

                    <div className="flex justify-center gap-3 mt-6">
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                            ← Back to Dashboard
                        </button>
                        <button
                            className="btn-outline"
                            onClick={() => {
                                // Let the user download the captured photo
                                const link = document.createElement('a');
                                link.href = image;
                                link.download = `photo-${employee?.name || 'capture'}.png`;
                                link.click();
                            }}
                        >
                            ⬇ Download
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
