import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { useNotification } from '../context/NotificationContext';
import { COMMON_CATEGORIES } from '../constants/mockData';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  AlertTriangle,
  User,
  MapPin,
  Mail,
  Camera,
  Upload,
  Trash2,
  Navigation,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  X,
  Settings
} from '../components/Icons';

/* ─────────────────────────────────────────────────────
   CameraModal — full-screen camera capture overlay
   ───────────────────────────────────────────────────── */
function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase] = useState('init'); // 'init' | 'live' | 'preview' | 'error'
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment'=rear, 'user'=front

  // Start camera stream
  const startCamera = useCallback(async (facing = 'environment') => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    setPhase('init');
    setErrorMsg('');
    setCapturedDataUrl(null);

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase('live');
    } catch (err) {
      let msg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please allow camera access in your browser settings and try again.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera found on this device. Please upload an image from your gallery instead.';
      } else if (err.name === 'NotReadableError') {
        msg = 'Camera is currently in use by another application. Please close other apps and try again.';
      } else if (err.name === 'OverconstrainedError') {
        // Retry with a looser constraint (no ideal facing)
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
          }
          setPhase('live');
          return;
        } catch {
          msg = 'Could not start camera with the requested settings.';
        }
      }
      setErrorMsg(msg);
      setPhase('error');
    }
  }, []);

  // Open camera when modal appears
  useEffect(() => {
    if (isOpen) {
      startCamera(cameraFacing);
    }
    return () => {
      // Cleanup on unmount / close
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flip camera (front ↔ rear)
  const handleFlipCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Capture a still frame
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);
    // Pause the stream while previewing
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setPhase('preview');
  };

  // Retake — restart camera
  const handleRetake = () => {
    setCapturedDataUrl(null);
    startCamera(cameraFacing);
  };

  // Use the captured photo
  const handleUsePhoto = () => {
    if (capturedDataUrl) {
      onCapture(capturedDataUrl);
    }
    onClose();
  };

  // Close / cancel
  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCapturedDataUrl(null);
    setPhase('init');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
      <div className="relative bg-black rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#123B63] to-[#1e5082] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Camera size={18} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Camera Capture</p>
              <p className="text-[11px] text-slate-300">
                {phase === 'preview' ? 'Review your photo' : 'Point at the civic issue'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera viewport */}
        <div className="relative bg-slate-900" style={{ aspectRatio: '16/9', maxHeight: '60vh' }}>

          {/* Live video feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${phase !== 'live' ? 'hidden' : ''}`}
            playsInline
            muted
            autoPlay
          />

          {/* Captured photo preview */}
          {phase === 'preview' && capturedDataUrl && (
            <img
              src={capturedDataUrl}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Loading / init state */}
          {phase === 'init' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <div className="w-14 h-14 rounded-full border-4 border-[#2496D8]/40 border-t-[#2496D8] animate-spin" />
              <p className="text-sm text-slate-300">Starting camera…</p>
            </div>
          )}

          {/* Error state */}
          {phase === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                <AlertCircle size={32} className="text-rose-400" />
              </div>
              <p className="text-sm font-semibold text-rose-300">Camera Unavailable</p>
              <p className="text-xs text-slate-400 max-w-xs">{errorMsg}</p>
              <button
                onClick={() => startCamera(cameraFacing)}
                className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2496D8] hover:bg-[#1a7ab8] text-white transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Live — corner guide frame overlay */}
          {phase === 'live' && (
            <div className="absolute inset-6 pointer-events-none">
              {/* Corner brackets */}
              {[
                'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
              ].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 border-white/70 ${cls}`} />
              ))}
            </div>
          )}

          {/* Live — flip camera button (top right) */}
          {phase === 'live' && (
            <button
              onClick={handleFlipCamera}
              title="Flip camera"
              className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            >
              {/* Flip icon (simple SVG) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="bg-slate-900 px-5 py-5 flex items-center justify-center gap-4">
          {phase === 'live' && (
            <>
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              {/* Shutter button */}
              <button
                onClick={handleCapture}
                className="group relative w-16 h-16 rounded-full bg-white hover:bg-slate-100 shadow-lg shadow-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Capture photo"
              >
                <span className="w-12 h-12 rounded-full border-4 border-slate-300 group-hover:border-[#2496D8] transition-colors" />
              </button>
              <div className="px-5 py-2.5 text-xs text-transparent select-none">Cancel</div>
            </>
          )}

          {phase === 'preview' && (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 max-w-[160px] py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} />
                Retake
              </button>
              <button
                onClick={handleUsePhoto}
                className="flex-1 max-w-[160px] py-3 rounded-xl text-sm font-bold bg-[#2EAD72] hover:bg-[#269360] text-white shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} />
                Use Photo
              </button>
            </>
          )}

          {phase === 'error' && (
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Close
            </button>
          )}

          {phase === 'init' && (
            <p className="text-xs text-slate-500">Requesting camera access…</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComplaintPage({ navigate, onOpenApiModal }) {
  const { user } = useAuth();
  const { submitComplaint, submitting } = useComplaints();
  const { addToast } = useNotification();

  const fileInputRef = useRef(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    email: user?.email || '',
    image: null,
    imageFileName: '',
    imageFileSize: '',
    complaint: '',
    queries_and_requests: '',
    category: 'Roads & Potholes'
  });

  // UI States
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionSuccessModal, setSubmissionSuccessModal] = useState(false);
  const [submissionErrorModal, setSubmissionErrorModal] = useState(false);
  const [lastApiError, setLastApiError] = useState(null);
  const [submittedComplaintInfo, setSubmittedComplaintInfo] = useState(null);

  // Sync user profile data into form if user logs in later
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        location: prev.location || user.location || ''
      }));
    }
  }, [user]);

  // Validation
  const validateForm = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }

    if (!formData.location.trim()) {
      errs.location = 'Please enter the problem location or address.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!formData.complaint.trim()) {
      errs.complaint = 'Please describe the civic issue you are facing.';
    } else if (formData.complaint.trim().length < 10) {
      errs.complaint = 'Please provide more details (minimum 10 characters) to help ward engineers.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Browser Geolocation Detection
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      addToast({
        title: 'Geolocation Unsupported',
        message: 'Your browser does not support automatic location detection. Please type your location manually.',
        type: 'warning'
      });
      return;
    }

    setLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coordsStr = `${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E (GPS accurate to ±${Math.round(accuracy)}m)`;

        // Update form with detected location coordinates
        setFormData((prev) => ({
          ...prev,
          location: prev.location ? `${prev.location} [GPS: ${coordsStr}]` : coordsStr
        }));

        setLocating(false);
        setLocationSuccess(true);
        if (errors.location) setErrors((prev) => ({ ...prev, location: null }));

        addToast({
          title: 'Location Detected',
          message: `Attached GPS coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          type: 'success'
        });

        setTimeout(() => setLocationSuccess(false), 3000);
      },
      (err) => {
        setLocating(false);
        let msg = 'Unable to fetch your coordinates.';
        if (err.code === 1) msg = 'Location permission denied. Please enter your address manually.';
        else if (err.code === 2) msg = 'Location unavailable on your network.';
        else if (err.code === 3) msg = 'Location lookup timed out.';

        addToast({
          title: 'Location Lookup Failed',
          message: msg,
          type: 'warning'
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Image Upload Handler (accepts JPG, JPEG, PNG, WEBP, converts to Base64)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      addToast({
        title: 'Unsupported Image Format',
        message: 'Please upload an image in JPG, JPEG, PNG, or WEBP format.',
        type: 'error'
      });
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      addToast({
        title: 'File Too Large',
        message: 'Image size exceeds 5MB limit. Please choose a smaller photo.',
        type: 'warning'
      });
      return;
    }

    const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
        imageFileName: file.name,
        imageFileSize: sizeFormatted
      }));

      addToast({
        title: 'Image Attached',
        message: `${file.name} (${sizeFormatted}) ready for submission.`,
        type: 'info'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imageFileName: '',
      imageFileSize: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Camera Capture Handler — receives base64 JPEG data URL from CameraModal
  const handleCameraCapture = (dataUrl) => {
    // Estimate file size from base64 string length
    const base64Data = dataUrl.split(',')[1] || '';
    const sizeBytes = Math.round((base64Data.length * 3) / 4);
    const sizeFormatted = sizeBytes < 1024 * 1024
      ? (sizeBytes / 1024).toFixed(1) + ' KB'
      : (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB';

    const fileName = `camera-capture-${Date.now()}.jpg`;

    setFormData((prev) => ({
      ...prev,
      image: dataUrl,
      imageFileName: fileName,
      imageFileSize: sizeFormatted
    }));

    addToast({
      title: 'Photo Captured',
      message: `Camera photo (${sizeFormatted}) attached to your complaint.`,
      type: 'success'
    });
  };

  // Form Submission — Directly validates and dispatches to SNS Workbench Webhook
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (submitting) return;

    if (!validateForm()) {
      addToast({
        title: 'Incomplete Form',
        message: 'Please fill in all required fields marked with *.',
        type: 'warning'
      });
      return;
    }

    try {
      const result = await submitComplaint(formData);

      setShowConfirmation(false);

      if (result.success) {
        setSubmittedComplaintInfo(result.complaint);
        setSubmissionSuccessModal(true);

        addToast({
          title: 'Grievance Dispatched',
          message: 'Your complaint has been successfully submitted to SNS Workbench!',
          type: 'success',
          duration: 6000
        });

        // Reset form after successful submission
        handleResetForm(false);
      } else {
        // API failure response: preserve data, display meaningful message, do NOT show success
        setLastApiError(result.apiResult);
        setSubmittedComplaintInfo(result.complaint);
        setSubmissionErrorModal(true);

        addToast({
          title: 'Webhook Submission Notice',
          message: result.apiResult?.error || 'Unable to connect to SNS Workbench. Form data has been preserved.',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      setShowConfirmation(false);
      setLastApiError({ error: error.message });
      setSubmissionErrorModal(true);
    }
  };

  // Trigger Confirmation Dialog (Optional review step)
  const handleOpenConfirmation = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      addToast({
        title: 'Incomplete Form',
        message: 'Please fill in all required fields marked with *.',
        type: 'warning'
      });
      return;
    }
    setShowConfirmation(true);
  };

  // Reset Form
  const handleResetForm = (askConfirm = true) => {
    if (askConfirm && !window.confirm('Are you sure you want to clear the entire complaint form?')) {
      return;
    }

    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      email: user?.email || '',
      image: null,
      imageFileName: '',
      imageFileSize: '',
      complaint: '',
      queries_and_requests: '',
      category: 'Roads & Potholes'
    });
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Local Save fallback on failure
  const handleSaveLocallyAndContinue = async () => {
    await submitComplaint(formData, true);
    setSubmissionErrorModal(false);
    addToast({
      title: 'Archived to My Complaints',
      message: 'Complaint saved locally in your citizen ledger.',
      type: 'info'
    });
    handleResetForm(false);
    navigate('/my-complaints');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => navigate('/home')}
              className="hover:text-[#123B63] transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#123B63] font-bold">Register a Complaint</span>
          </div>

          <button
            type="button"
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#2496D8] bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <Settings size={14} />
            <span>SNS Webhook Settings</span>
          </button>
        </div>

        {/* Page Title Card */}
        <div className="bg-gradient-to-r from-[#123B63] to-[#1e5082] text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2496D8]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-slate-200 mb-2">
                <AlertTriangle size={14} className="text-[#2496D8]" />
                <span>Civilian Grievance Lodging</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Submit a Civic Complaint
              </h1>
              <p className="mt-1 text-sm text-slate-200 max-w-xl">
                Provide accurate details and photos to help municipal field officers inspect and rectify the issue promptly.
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-300 block">Direct Webhook Integration</span>
              <span className="text-xs font-mono text-[#2496D8] font-bold">SNS Workbench v1</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Field 1: NAME (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Citizen Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    placeholder="Enter your full name"
                    className={`block w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-colors ${
                      errors.name
                        ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Field 3: EMAIL ID (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="citizen@example.com"
                    className={`block w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-colors ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Category and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category Dropdown */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Issue Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="block w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white"
                >
                  {COMMON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: LOCATION (Required) + Use My Location */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Location / Address <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={locating}
                    className="text-xs font-semibold text-[#2496D8] hover:text-[#123B63] flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Navigation size={13} className={locating ? 'animate-spin' : ''} />
                    <span>{locating ? 'Detecting GPS...' : locationSuccess ? 'GPS Attached ✓' : 'Use My Location'}</span>
                  </button>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      if (errors.location) setErrors({ ...errors, location: null });
                    }}
                    placeholder="Enter your city, area, street, or address"
                    className={`block w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-colors ${
                      errors.location
                        ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Field 4: PHOTO — Camera Capture or Gallery Upload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Capture or Upload Photo
                </label>
                <span className="text-xs text-slate-400">Optional • Max 5MB</span>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Attach a photo of the civic issue to help field engineers identify and fix it faster.
                Supports JPG, JPEG, PNG, WEBP.
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="complaint-image-input"
              />

              {/* ── No image yet: show action buttons ── */}
              {!formData.image ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 overflow-hidden">
                  {/* Two-action header row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">

                    {/* Camera button */}
                    <button
                      type="button"
                      onClick={() => setShowCameraModal(true)}
                      className="group flex flex-col items-center gap-3 p-6 hover:bg-sky-50/60 transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2496D8] to-[#123B63] text-white flex items-center justify-center shadow-md shadow-[#2496D8]/30 group-hover:shadow-lg group-hover:shadow-[#2496D8]/40 group-hover:scale-110 transition-all duration-200">
                        <Camera size={26} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#123B63] transition-colors">
                          Open Camera
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Capture a real-time photo
                        </p>
                      </div>
                    </button>

                    {/* Upload button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex flex-col items-center gap-3 p-6 hover:bg-sky-50/60 transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 group-hover:border-[#2496D8] group-hover:text-[#2496D8] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-200">
                        <Upload size={26} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#2496D8] transition-colors">
                          Upload from Gallery
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          JPG, PNG or WEBP • Max 5 MB
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Drag & drop zone hint */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-t border-dashed border-slate-200 py-3 text-center cursor-pointer hover:bg-slate-100/60 transition-colors"
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-sky-50'); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove('bg-sky-50'); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('bg-sky-50');
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const fakeEvent = { target: { files: [file] } };
                        handleImageChange(fakeEvent);
                      }
                    }}
                  >
                    <p className="text-xs text-slate-400">
                      or drag &amp; drop an image here
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Image preview card ── */
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 overflow-hidden">
                  {/* Top badge: camera or upload source */}
                  {formData.imageFileName?.startsWith('camera-capture') && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#123B63]/90 text-white text-[10px] font-bold backdrop-blur-sm">
                      <Camera size={11} />
                      <span>Camera Capture</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Thumbnail */}
                    <div className="relative w-36 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 shadow-sm">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info + actions */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start mb-0.5">
                        <CheckCircle2 size={14} className="text-[#2EAD72] shrink-0" />
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {formData.imageFileName || 'Attached Photo'}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {formData.imageFileSize || 'Attached'} • Ready for transmission
                      </p>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                        {/* Re-capture */}
                        <button
                          type="button"
                          onClick={() => setShowCameraModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#123B63]/10 text-[#123B63] hover:bg-[#123B63]/20 transition-colors"
                        >
                          <Camera size={12} />
                          Recapture
                        </button>

                        {/* Replace from gallery */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Upload size={12} />
                          Replace
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Field 5: COMPLAINT (Mandatory multiline textarea) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Complaint Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {formData.complaint.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                value={formData.complaint}
                onChange={(e) => {
                  setFormData({ ...formData, complaint: e.target.value });
                  if (errors.complaint) setErrors({ ...errors, complaint: null });
                }}
                placeholder="Describe the civic issue you are facing."
                className={`block w-full p-4 rounded-xl border text-sm transition-colors ${
                  errors.complaint
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                }`}
              />
              {errors.complaint && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.complaint}</span>
                </p>
              )}
            </div>

            {/* Field 6: QUERIES AND REQUESTS (Optional multiline textarea) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Queries and Requests
                </label>
                <span className="text-xs text-slate-400">Optional</span>
              </div>
              <textarea
                rows={3}
                value={formData.queries_and_requests}
                onChange={(e) =>
                  setFormData({ ...formData, queries_and_requests: e.target.value })
                }
                placeholder="Enter any additional queries, suggestions, or requests."
                className="block w-full p-4 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Form Action Buttons: Submit Complaint, Reset Form, Cancel */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-center order-3 sm:order-1"
              >
                Cancel
              </button>

              <div className="w-full sm:w-auto flex items-center gap-3 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => handleResetForm(true)}
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#123B63] hover:bg-[#0d2b4a] shadow-lg shadow-[#123B63]/25 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Sending to Webhook...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Complaint</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />

      {/* Confirmation Dialog Component */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleSubmit}
        formData={formData}
        submitting={submitting}
      />

      {/* Success Modal */}
      {submissionSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 text-center animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#2EAD72] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 size={44} />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#123B63] tracking-tight">
              Your complaint has been successfully submitted!
            </h3>
            <p className="mt-2 text-sm text-[#2EAD72] font-semibold">
              Thank you for helping us make our city better.
            </p>

            {submittedComplaintInfo && (
              <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold uppercase">Tracking ID:</span>
                  <span className="font-mono font-bold text-[#123B63] text-sm">
                    {submittedComplaintInfo.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">
                    {submittedComplaintInfo.location}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-[#2496D8]">Submitted (In Queue)</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccessModal(false);
                  navigate('/my-complaints');
                }}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#123B63] hover:bg-[#0d2b4a] text-white shadow-md transition-colors"
              >
                Track in My Complaints →
              </button>
              <button
                type="button"
                onClick={() => setSubmissionSuccessModal(false)}
                className="py-3 px-4 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Notice / Error Modal (With Form Data Preserved) */}
      {submissionErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 animate-scale-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  SNS Workbench Webhook Notice
                </h3>
                <p className="text-xs text-slate-500">
                  Your complaint form data is safely preserved.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2 mb-5">
              <p className="font-semibold">
                Endpoint responded: HTTP {lastApiError?.status || 'Network Notice'}
              </p>
              <p className="font-mono bg-white/80 p-2 rounded border border-amber-200 text-[11px] break-all">
                {lastApiError?.error || 'Webhook not found or workflow inactive'}
              </p>
              <p className="text-slate-600">
                In n8n / SNS Workbench, workflow triggers must be active to return HTTP 200. You can save this complaint to your citizen ledger now, or adjust the webhook endpoint in Settings.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSubmissionErrorModal(false);
                  handleSubmit();
                }}
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#123B63] hover:bg-[#0d2b4a] text-white shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} className={submitting ? 'animate-spin' : ''} />
                <span>Retry Webhook Submission</span>
              </button>
              <button
                type="button"
                onClick={handleSaveLocallyAndContinue}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Save to My Complaints Ledger & View Status →
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmissionErrorModal(false);
                  onOpenApiModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Settings size={14} />
                <span>Configure Webhook Settings</span>
              </button>
              <button
                type="button"
                onClick={() => setSubmissionErrorModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Keep Editing Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

