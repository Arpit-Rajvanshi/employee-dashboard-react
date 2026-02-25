import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatSalary, titleCase } from '../utils/formatters';
import Navbar from '../components/Navbar';

/**
 * Employee Details Page
 * ---------------------
 * Shows a full profile card for a single employee and includes a
 * camera capture feature using the browser MediaDevices API.
 *
 * Employee data is passed via React Router location state from Dashboard.
 */
export default function EmployeeDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const employee = state?.employee;

    // ── Camera state ─────────────────────────────────
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null); // keep a ref so we can stop tracks on cleanup

    // Clean up the camera stream when the component unmounts
    useEffect(() => {
        return () => stopCamera();
    }, []);

    /*
     * Attach the stream to the <video> element whenever BOTH the stream
     * exists AND the video element has mounted. This fixes the retake bug:
     * on retake, the video element re-mounts after setCameraActive(true)
     * triggers a render, so we need this effect to wire them up reliably.
     */
    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraActive]);

    /** Request camera access and store the stream. */
    const startCamera = useCallback(async () => {
        setCameraError('');
        setCapturedImage(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false,
            });

            streamRef.current = stream;

            // Set cameraActive to true — this renders the <video> element,
            // and the useEffect above will attach the stream to it.
            setCameraActive(true);
        } catch (err) {
            // Common error codes — give the user an actionable message
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCameraError(
                    'Camera permission was denied. Please allow camera access in your browser settings and try again.'
                );
            } else if (err.name === 'NotFoundError') {
                setCameraError('No camera found on this device.');
            } else {
                setCameraError(`Camera error: ${err.message}`);
            }
        }
    }, []);

    /** Stop all tracks and release the camera. */
    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    }

    /** Capture the current video frame to a data URL via an off-screen canvas. */
    function capturePhoto() {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
    }

    /** Discard the captured photo and re-open the camera. */
    function retake() {
        setCapturedImage(null);
        startCamera();
    }

    // Guard — if user navigated here directly without state, send them back
    if (!employee) {
        return (
            <>
                <Navbar />
                <div className="w-full max-w-xl mx-auto mt-20 text-center px-4">
                    <div className="card p-8">
                        <p className="text-slate-500 mb-4">Employee data not found.</p>
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

            <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Back link */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 inline-flex items-center gap-1 cursor-pointer"
                >
                    ← Back to Dashboard
                </button>

                {/* ── Employee profile card ────────────────── */}
                <div className="card p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        {employee.name || 'Employee'}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                        <Detail label="Position" value={employee.position} />
                        <Detail label="City" value={titleCase(employee.city)} />
                        <Detail label="Salary" value={formatSalary(employee.salary)} />
                        <Detail label="Start Date" value={employee.startDate} />
                        <Detail label="Employee ID" value={employee.id} />
                    </div>
                </div>

                {/* ── Camera section ───────────────────────── */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        📷 Capture Photo
                    </h3>

                    {/* Error banner */}
                    {cameraError && (
                        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3">
                            {cameraError}
                        </div>
                    )}

                    {/* Live preview */}
                    {cameraActive && !capturedImage && (
                        <div className="mb-4">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full max-w-md mx-auto rounded-lg border border-slate-200 bg-black"
                            />
                            <div className="flex gap-3 mt-3">
                                <button className="btn-primary" onClick={capturePhoto}>
                                    📸 Capture
                                </button>
                                <button className="btn-outline" onClick={stopCamera}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Captured preview */}
                    {capturedImage && (
                        <div className="mb-4">
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full max-w-md mx-auto rounded-lg border border-slate-200"
                            />
                            <div className="flex gap-3 mt-3">
                                <button
                                    className="btn-primary"
                                    onClick={() =>
                                        navigate('/photo-result', { state: { image: capturedImage, employee } })
                                    }
                                >
                                    ✅ Use Photo
                                </button>
                                <button className="btn-outline" onClick={retake}>
                                    🔄 Retake
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Idle state — show the open-camera button */}
                    {!cameraActive && !capturedImage && (
                        <button className="btn-primary" onClick={startCamera}>
                            Open Camera
                        </button>
                    )}
                </div>
            </main>
        </>
    );
}

/** Tiny helper to keep the profile grid DRY. */
function Detail({ label, value }) {
    return (
        <div>
            <span className="text-slate-500">{label}: </span>
            <span className="font-medium text-slate-800">{value || '—'}</span>
        </div>
    );
}
