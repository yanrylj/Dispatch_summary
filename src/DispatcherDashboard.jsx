import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase'; 

// --- INLINE SVG ICONS ---
const SvgIcon = ({ children, className }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Icons = {
  Grid: ({ className }) => <SvgIcon className={className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></SvgIcon>,
  Search: ({ className }) => <SvgIcon className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></SvgIcon>,
  Box: ({ className }) => <SvgIcon className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></SvgIcon>,
  Truck: ({ className }) => <SvgIcon className={className}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></SvgIcon>,
  CheckCircle: ({ className }) => <SvgIcon className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></SvgIcon>,
  CheckCircleSolid: ({ className }) => (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  Undo: ({ className }) => <SvgIcon className={className}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></SvgIcon>,
  Alert: ({ className }) => <SvgIcon className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></SvgIcon>,
  List: ({ className }) => <SvgIcon className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></SvgIcon>,
  Calendar: ({ className }) => <SvgIcon className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></SvgIcon>,
  X: ({ className }) => <SvgIcon className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></SvgIcon>,
  MapPin: ({ className }) => <SvgIcon className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></SvgIcon>,
  Upload: ({ className }) => <SvgIcon className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></SvgIcon>,
  Folder: ({ className }) => <SvgIcon className={className}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-1.2-1.8A2 2 0 0 0 7.55 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></SvgIcon>,
  Directions: ({ className }) => <SvgIcon className={className}><path d="M21 10.5 13.5 3a2 2 0 0 0-2.83 0L3 10.5a2 2 0 0 0 0 2.83l7.67 7.67a2 2 0 0 0 2.83 0l7.5-7.5a2 2 0 0 0 0-2.83Z"/><path d="M9.5 14 12 11.5v-3"/><path d="m14 10.5-2-2"/></SvgIcon>,
  Pencil: ({ className }) => <SvgIcon className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></SvgIcon>,
  Scan: ({ className }) => <SvgIcon className={className}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/><path d="M7 8h10"/><path d="M7 16h10"/></SvgIcon>,
  Camera: ({ className }) => <SvgIcon className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></SvgIcon>,
  Eye: ({ className }) => <SvgIcon className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></SvgIcon>,
  Refresh: ({ className }) => <SvgIcon className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></SvgIcon>,
  ChevronDown: ({ className }) => <SvgIcon className={className}><path d="m6 9 6 6 6-6"/></SvgIcon>,
  FileText: ({ className }) => <SvgIcon className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></SvgIcon>,
  Plus: ({ className }) => <SvgIcon className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></SvgIcon>,
  User: ({ className }) => <SvgIcon className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></SvgIcon>,
  Circle: ({ className }) => <SvgIcon className={className}><circle cx="12" cy="12" r="10"/></SvgIcon>,
  Flag: ({ className }) => <SvgIcon className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></SvgIcon>
};

// ==========================================
// 📷 MATHEMATICAL BLUR CHECKER 
// ==========================================
const computeLaplacianVariance = (imgData) => {
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;
  
  let gray = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  let laplacianValues = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let idx = y * width + x;
      let val = 
        -4 * gray[idx] +
        gray[idx - 1] +
        gray[idx + 1] +
        gray[idx - width] +
        gray[idx + width];
      laplacianValues.push(val);
    }
  }

  const mean = laplacianValues.reduce((a, b) => a + b, 0) / laplacianValues.length;
  const variance = laplacianValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / laplacianValues.length;
  return variance;
};

// --- DATA ARRAYS ---
const TABS = [
  { id: 'dispatch', label: 'Dispatch', icon: Icons.Truck },
  { id: 'delivered_override', label: 'Delivered Override', icon: Icons.CheckCircle },
  { id: 'returns', label: 'Returns', icon: Icons.Undo },
  { id: 'exceptions', label: 'Exceptions', icon: Icons.Alert },
  { id: 'waybills', label: 'Waybills', icon: Icons.List },
  { id: 'flagged', label: 'Flagged Waybills', icon: Icons.Flag }
];

const DOCUMENTS = [
  { id: 1, name: "Signed Waybill (POD)", canCapture: true },
  { id: 2, name: "Package Photo Front", canCapture: false },
  { id: 3, name: "Package Photo Back", canCapture: false },
  { id: 4, name: "Recipient Valid ID", canCapture: true },
  { id: 5, name: "Additional Proof", canCapture: false },
];

const INITIAL_DATABASE = [
  { id: '10000001', date: '2026-08-17', rider: 'Mark Reyes', status: 'Delivered', reason: 'Delivered to recipient', patientName: 'Jane Doe', mobile: '09171234567', address: 'Makati City', urgentLevel: 'Normal', documents: {}, isLocked: false },
  { id: '10000002', date: '2026-08-17', rider: 'John Smith', status: 'In Hub', reason: 'Awaiting dispatch', patientName: 'Juan Dela Cruz', mobile: '09181234567', address: 'Quezon City', urgentLevel: 'High', documents: {}, isLocked: false },
  { id: '10000003', date: '2026-08-16', rider: 'Pedro Penduko', status: 'In Transit', reason: 'Out for delivery', patientName: 'Maria Clara', mobile: '09191234567', address: 'Manila City', urgentLevel: 'Normal', documents: {}, isLocked: false },
  { id: '10000004', date: '2026-08-16', rider: 'Jose Rizal', status: 'Exception', reason: 'Customer not around', patientName: 'Andres Bonifacio', mobile: '09201234567', address: 'Taguig City', urgentLevel: 'High', documents: {}, isLocked: false },
  { id: '10000005', date: '2026-08-15', rider: 'Unassigned', status: 'Pending', reason: 'Processing order', patientName: 'Gabriela Silang', mobile: '09211234567', address: 'Pasig City', urgentLevel: 'Normal', documents: {}, isLocked: false }
];

export default function DispatcherDashboard() {
  const [allWaybills, setAllWaybills] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [lockedRecords, setLockedRecords] = useState(new Set());
  
  const [activeTab, setActiveTab] = useState('waybills');
  const [dateRange, setDateRange] = useState("08/08/2026 - 08/15/2026");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [waybills, setWaybills] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set()); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchedWaybill, setSearchedWaybill] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  
  const [showModifyConfirm, setShowModifyConfirm] = useState(false); 
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false); 
  
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [isProcessMenuOpen, setIsProcessMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- FILE/CAMERA HANDLING ---
  const fileInputRef = useRef(null);
  const [activeDocForUpload, setActiveDocForUpload] = useState(null);
  const [viewingImage, setViewingImage] = useState(null); 
  const [uploadingDocName, setUploadingDocName] = useState(null); 
  const [tempDocuments, setTempDocuments] = useState({});

  // --- IN-APP WEBSITE CAMERA STATE ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFeedback, setCameraFeedback] = useState("Hold camera steady...");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // --- FLAGGED WAYBILLS STATE ---
  const [pendingWaybillNo, setPendingWaybillNo] = useState("");
  const [pendingRemarks, setPendingRemarks] = useState("");
  const [confirmResolveId, setConfirmResolveId] = useState(null); 
  const [showNotFoundAlert, setShowNotFoundAlert] = useState(false);
  const [notFoundWaybillId, setNotFoundWaybillId] = useState("");

  // ==========================================
  // 🔒 PREVENT GHOST LOCKS ON TAB CLOSE
  // ==========================================
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (searchedWaybill) {
        updateDoc(doc(db, "waybills", searchedWaybill.id), { isLocked: false });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [searchedWaybill]);

  useEffect(() => {
    const unsubWaybills = onSnapshot(collection(db, 'waybills'), (snapshot) => {
      if (snapshot.docs.length < 5) {
        INITIAL_DATABASE.forEach(async (wb) => {
          await setDoc(doc(db, "waybills", wb.id), wb, { merge: true });
        });
      }
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllWaybills(data);
      const activeLocks = new Set(data.filter(w => w.isLocked).map(w => w.id));
      setLockedRecords(activeLocks);
    });

    const unsubFlags = onSnapshot(collection(db, 'flags'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.timestamp - a.timestamp);
      setPendingVerifications(data);
    });

    return () => {
      unsubWaybills();
      unsubFlags();
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setWaybills(allWaybills.filter(w => w.id.includes(searchQuery.trim())));
    } else {
      setWaybills(allWaybills);
    }
    if (searchedWaybill) {
      const liveUpdate = allWaybills.find(w => w.id === searchedWaybill.id);
      if (liveUpdate) setSearchedWaybill(liveUpdate);
    }
  }, [allWaybills, searchQuery]);

  // Click outside for process menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProcessMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainSearch = (overrideQuery = null) => {
    const queryToUse = typeof overrideQuery === 'string' ? overrideQuery : searchQuery;
    if (!queryToUse.trim()) {
      setSearchQuery("");
      return;
    }
    setSearchQuery(queryToUse); 
    setActiveTab('waybills'); 
  };

  const handleModalSearch = () => {
    if (!modalSearchQuery.trim()) {
      alert("Please enter a Waybill No. or scan QR to search.");
      return;
    }
    const found = allWaybills.find(w => w.id === modalSearchQuery.trim());
    if (found) {
      // STRICT LOCK GUARD
      if (lockedRecords.has(found.id)) {
        alert("⚠️ ACCESS DENIED: This record is currently locked and being edited by another dispatcher.");
        return;
      }

      if (searchedWaybill) updateDoc(doc(db, "waybills", searchedWaybill.id), { isLocked: false }).catch(console.error);
      updateDoc(doc(db, "waybills", found.id), { isLocked: true }).catch(console.error);
      setSearchedWaybill(found);
      setModalSearchQuery(""); 
      setIsEditing(false);     
      setShowModifyConfirm(false);
      setShowOverrideConfirm(false);
      setTempDocuments({});
    } else {
      alert(`Waybill #${modalSearchQuery} not found in database.`);
    }
  };

  const handleAddPending = async (e) => {
    e.preventDefault();
    const trimmedNo = pendingWaybillNo.trim();
    const trimmedRemarks = pendingRemarks.trim();
    if (!trimmedNo || !trimmedRemarks) {
      alert("Please enter both Waybill No. and Remarks.");
      return;
    }
    const exists = allWaybills.find(w => w.id === trimmedNo);
    if (!exists) {
      setNotFoundWaybillId(trimmedNo);
      setShowNotFoundAlert(true);
      return; 
    }
    const newDocRef = doc(collection(db, "flags"));
    await setDoc(newDocRef, {
      waybillNo: trimmedNo,
      remarks: trimmedRemarks,
      dateAdded: new Date().toLocaleDateString(),
      timestamp: Date.now()
    });
    setPendingWaybillNo("");
    setPendingRemarks("");
  };

  const handleRemovePending = async (id) => {
    await deleteDoc(doc(db, "flags", id));
    setConfirmResolveId(null);
  };

  // =======================================================
  // IN-APP CAMERA FOR FLAWLESS ANTI-BLUR ON MOBILE
  // =======================================================
  const openCameraModal = (docName) => {
    setActiveDocForUpload(docName);
    setIsCameraOpen(true);
    setCameraFeedback("Hold camera steady...");
    
    // Request raw camera stream from device
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      })
      .catch(err => {
        console.error("Camera error:", err);
        alert("Could not access camera. Please check browser permissions.");
        setIsCameraOpen(false);
      });
  };

  const closeCameraModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setActiveDocForUpload(null);
  };

  const captureInAppPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Grab raw uncompressed image data from the video feed
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const variance = computeLaplacianVariance(imgData);
    
    // Video stream threshold (much more accurate than File uploads)
    const THRESHOLD = 100.0; 
    console.log(`Live Camera Blur Score: ${variance.toFixed(2)}`);

    if (variance < THRESHOLD) {
      setCameraFeedback("⚠️ Too Blurry! Hold still and try again.");
      setTimeout(() => setCameraFeedback("Hold camera steady..."), 2000);
      return; 
    }

    // It's a clear photo! Compress to Base64 and save to temp draft
    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
    setTempDocuments(prev => ({
      ...prev,
      [activeDocForUpload]: compressedBase64
    }));
    
    closeCameraModal();
  };

  // =======================================================
  // NORMAL FILE UPLOAD (UPLOAD BUTTON)
  // =======================================================
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeDocForUpload || !searchedWaybill) return;

    setUploadingDocName(activeDocForUpload);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Check blur on resized canvas
        const imgData = ctx.getImageData(0, 0, width, height);
        const variance = computeLaplacianVariance(imgData);
        console.log(`Upload Blur Score: ${variance.toFixed(2)}`);

        if (variance < 100.0) {
           setUploadingDocName(null); 
           alert("⚠️ IMAGE REJECTED: The uploaded photo is too blurry.");
           if(fileInputRef.current) fileInputRef.current.value = "";
           return;
        }

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setTempDocuments(prev => ({ ...prev, [activeDocForUpload]: compressedBase64 }));
        setUploadingDocName(null); 
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReplaceFile = (docName) => {
    setActiveDocForUpload(docName);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleUploadDocs = () => {
    setActiveDocForUpload("Other Documents");
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleViewFile = (docName) => {
    const fileData = tempDocuments[docName] || searchedWaybill?.documents?.[docName];
    if (fileData) {
      setViewingImage({ name: docName, data: fileData });
    } else {
      alert(`No file uploaded for "${docName}" yet.`);
    }
  };

  const closeImageViewer = () => setViewingImage(null);
  const handleScanAction = () => alert("Simulating Barcode/QR Scanner connection... Beep!");
  const handleApplyFilter = () => alert(`Filtering records for date range: ${dateRange}`);
  const handleGenerateDocuments = () => alert("Generating documents...");
  const handleProcessAction = (actionName) => {
    alert(`Executing action: ${actionName}`);
    setIsProcessMenuOpen(false);
  };
  const handleDirections = () => alert(`Opening Google Maps routing to: ${searchedWaybill?.address}`);
  const handlePatientProfileClick = () => alert(`Opening patient profile for: ${searchedWaybill?.patientName}`);

  // --- STRICT LOCK GUARD FOR OPENING WAYBILLS ---
  const openWaybillModal = (waybillId) => {
    // STRICT LOCK GUARD
    if (lockedRecords.has(waybillId)) {
      alert("⚠️ ACCESS DENIED: This record is currently locked and being edited by another dispatcher.");
      return;
    }

    const found = allWaybills.find(w => w.id === waybillId);
    if (found) {
      setSearchedWaybill(found);
      setIsEditing(false);
      setShowModifyConfirm(false);
      setShowOverrideConfirm(false);
      setTempDocuments({}); 
      setModalSearchQuery("");
      setIsModalOpen(true);
      updateDoc(doc(db, "waybills", waybillId), { isLocked: true }).catch(err => console.error("Failed to lock", err));
    } else {
      alert(`Waybill #${waybillId} not found in database.`);
    }
  };

  const closeWaybillModal = () => {
    if (searchedWaybill) {
      updateDoc(doc(db, "waybills", searchedWaybill.id), { isLocked: false }).catch(console.error);
    }
    setIsModalOpen(false);
    setSearchedWaybill(null);
    setIsEditing(false);
    setShowModifyConfirm(false);
    setShowOverrideConfirm(false);
    setTempDocuments({}); 
  };

  const handleModifyClick = () => {
    if (isEditing) {
      setIsEditing(false); 
      setShowOverrideConfirm(false);
      setTempDocuments({}); 
    } else {
      setShowModifyConfirm(true); 
    }
  };

  const confirmModifyMode = () => {
    setShowModifyConfirm(false);
    setIsEditing(true);
  };

  const executeStatusOverride = async () => {
    if (!searchedWaybill) return;

    const updateData = {
       status: 'Dispatcher Delivered Override', 
       reason: 'CROPPPED RC'
    };

    Object.keys(tempDocuments).forEach(docName => {
       updateData[`documents.${docName}`] = tempDocuments[docName];
    });

    await updateDoc(doc(db, "waybills", searchedWaybill.id), updateData);
    alert(`Success: Waybill #${searchedWaybill.id} has been forcefully overridden and documents saved.`);
    
    setShowOverrideConfirm(false);
    setIsEditing(false); 
    setTempDocuments({}); 
  };

  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === waybills.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(waybills.map(w => w.id)));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6 font-sans text-gray-700 relative">
      
      {/* HIDDEN FILE INPUT FOR NORMAL UPLOADS */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[750px] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="bg-[#38b2ac] text-white p-4 sm:p-5 flex items-center shrink-0">
          <div className="bg-white/20 p-2 rounded-lg mr-3 sm:mr-4">
            <Icons.Grid className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide leading-tight">Dispatcher Dashboard</h1>
          </div>
        </div>

        {/* --- TOP BAR: SEARCH, FILTERS & ACTIONS --- */}
        <div className="px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/30 shrink-0">
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1 flex w-full">
              <input 
                type="text" 
                placeholder="Scan or Enter Waybill No..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMainSearch()}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-[#38b2ac] shadow-sm font-bold text-gray-800" 
              />
              <button onClick={handleScanAction} className="absolute right-0 top-0 bottom-0 px-3 bg-gray-100 border-l border-y border-gray-300 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center">
                <Icons.Scan className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => handleMainSearch()} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-r-lg text-sm font-bold tracking-wide transition-colors shadow-sm h-[38px] flex items-center justify-center gap-2 sm:-ml-5 z-10 w-full sm:w-auto mt-2 sm:mt-0">
               <Icons.Search className="w-4 h-4"/> SEARCH
            </button>
            <div className="w-px h-8 bg-gray-300 mx-2 hidden lg:block"></div>
            <div className="flex bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden w-full sm:w-auto">
              <div className="flex items-center pl-3 bg-gray-50 border-r border-gray-200">
                <Icons.Calendar className="w-4 h-4 text-gray-500 mr-2" />
              </div>
              <input 
                type="text" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 text-sm w-full sm:w-48 focus:outline-none text-gray-700 font-medium" 
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <button onClick={handleApplyFilter} className="bg-[#38b2ac] hover:bg-teal-500 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors shadow-sm flex-1 sm:flex-none text-center">APPLY</button>
            <button onClick={handleGenerateDocuments} className="bg-[#28a745] hover:bg-green-600 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm flex-1 sm:flex-none">
              <Icons.FileText className="w-4 h-4" /> DOCS
            </button>
            <div className="relative flex-1 sm:flex-none" ref={dropdownRef}>
              <button onClick={() => setIsProcessMenuOpen(!isProcessMenuOpen)} className="w-full bg-[#d9a404] hover:bg-yellow-600 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                <Icons.Box className="w-4 h-4 hidden sm:block" /> PROCESS <Icons.ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {isProcessMenuOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2 animate-fade-in origin-top-right">
                  <button onClick={() => handleProcessAction('Accept waybill for Dispatch')} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 border-b border-gray-100 pb-3 transition-colors"><Icons.Box className="w-4 h-4 text-gray-400" /> Accept waybill for Dispatch</button>
                  <div className="px-5 py-2.5 text-xs font-black text-gray-400 uppercase tracking-wider mt-1">Assign Waybill</div>
                  <button onClick={() => handleProcessAction('To Delivery Team')} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors"><Icons.Plus className="w-4 h-4 text-gray-400" /> To Delivery Team</button>
                  <button onClick={() => handleProcessAction('To Rider')} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 border-b border-gray-100 pb-3 transition-colors"><Icons.Truck className="w-4 h-4 text-gray-400" /> To Rider</button>
                  <div className="mt-1">
                    <button onClick={() => handleProcessAction('Return to MedPack')} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors"><Icons.Undo className="w-4 h-4 text-gray-400" /> Return to MedPack</button>
                    <button onClick={() => handleProcessAction('Return from Rider')} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors"><Icons.Undo className="w-4 h-4 text-gray-400" /> Return from Rider</button>
                  </div>
                  <div className="mt-1">
                    <button onClick={() => handleProcessAction('Waybill Exception')} className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors"><Icons.Alert className="w-4 h-4 text-gray-400" /> Waybill Exception</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- TAB BAR --- */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white flex items-center shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2 w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive 
                      ? 'text-[#38b2ac] bg-[#e6f7f5] border border-[#38b2ac]' 
                      : 'text-gray-500 hover:text-gray-700 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
          
          {activeTab !== 'flagged' && (
            waybills.length > 0 ? (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                  <thead className="bg-white text-gray-400 uppercase text-[11px] font-bold border-y border-gray-100">
                    <tr>
                      <th className="p-4 w-12 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#38b2ac]" checked={selectedRows.size === waybills.length && waybills.length > 0} onChange={toggleAllRows} /></th>
                      <th className="p-4">Waybill No.</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waybills.map((waybill) => {
                      const isLocked = lockedRecords.has(waybill.id);
                      const amIEditing = isModalOpen && searchedWaybill?.id === waybill.id;
                      const showLockOverlay = isLocked && !amIEditing;

                      return (
                        <tr key={waybill.id} className={`border-b border-gray-100 transition-colors relative ${showLockOverlay ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 accent-[#38b2ac]" 
                              checked={selectedRows.has(waybill.id)} 
                              onChange={() => toggleRow(waybill.id)} 
                              disabled={showLockOverlay} // Disable checkbox too
                            />
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            {/* --- THE FIX IS HERE: ADDED disabled={showLockOverlay} --- */}
                            <button 
                              onClick={() => openWaybillModal(waybill.id)} 
                              disabled={showLockOverlay} 
                              className={`font-bold ${showLockOverlay ? 'text-gray-400 opacity-50 cursor-not-allowed' : 'text-[#38b2ac] hover:underline'}`}
                            >
                              {waybill.id}
                            </button>
                            {showLockOverlay && <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Editing</span>}
                          </td>
                          <td className={`p-4 font-medium ${showLockOverlay ? 'text-gray-400 opacity-50' : 'text-gray-700'}`}>{waybill.date}</td>
                          <td className={`p-4 font-bold ${showLockOverlay ? 'text-gray-400 opacity-50' : 'text-gray-900'}`}>{waybill.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center pt-20 pb-20 px-4 text-center">
                <Icons.Search className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-400 text-sm sm:text-base font-medium tracking-wide">Enter a Tracking No. to search and display Waybills.</p>
              </div>
            )
          )}

          {activeTab === 'flagged' && (
            <div className="flex-1 p-4 sm:p-6 flex flex-col lg:flex-row gap-6 bg-gray-50/50 overflow-y-auto">
              <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                     <Icons.Flag className="w-5 h-5 text-orange-500" /> Flag a Waybill
                   </h3>
                   <form onSubmit={handleAddPending} className="flex flex-col gap-4">
                     <div>
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-1">Waybill Number</label>
                       <input type="text" placeholder="Scan or Enter No." value={pendingWaybillNo} onChange={(e) => setPendingWaybillNo(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />
                     </div>
                     <div>
                       <label className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-1">Issue Remarks</label>
                       <textarea placeholder="e.g., Damaged barcode, missing item, checking status..." value={pendingRemarks} onChange={(e) => setPendingRemarks(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none h-24" />
                     </div>
                     <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm">
                       <Icons.Plus className="w-4 h-4"/> ADD TO PENDING LIST
                     </button>
                   </form>
                </div>
              </div>

              <div className="w-full lg:w-2/3 flex flex-col gap-4">
                 <h3 className="font-extrabold text-gray-800 flex items-center gap-3 text-lg px-1">
                    Active Flags <span className="bg-orange-100 text-orange-700 py-0.5 px-3 rounded-full text-xs">{pendingVerifications.length}</span>
                 </h3>
                 
                 {pendingVerifications.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 px-4 text-center shadow-sm">
                      <Icons.CheckCircle className="w-12 h-12 text-gray-200 mb-3" />
                      <p className="text-gray-400 font-medium">No pending verifications. All clear!</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                      {pendingVerifications.map(item => {
                        const isLocked = lockedRecords.has(item.waybillNo);
                        const amIEditing = isModalOpen && searchedWaybill?.id === item.waybillNo;
                        const showLockOverlay = isLocked && !amIEditing;

                        return (
                          <div key={item.id} className={`bg-white rounded-xl p-5 shadow-sm relative flex flex-col transition-all overflow-hidden border ${showLockOverlay ? 'border-gray-200 bg-gray-50' : 'border-orange-200 group animate-fade-in'}`}>
                            {showLockOverlay && (
                              <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                                 <div className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-gray-700 pointer-events-auto">
                                   <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> Someone is editing...
                                 </div>
                              </div>
                            )}

                            <div className="flex justify-between items-start mb-2 relative z-10">
                              {/* --- AND HERE IN THE FLAGGED LIST --- */}
                              <button 
                                onClick={() => openWaybillModal(item.waybillNo)} 
                                disabled={showLockOverlay}
                                className={`font-black text-base tracking-tight text-left transition-colors ${showLockOverlay ? 'text-gray-400 opacity-50 cursor-not-allowed' : 'text-[#38b2ac] hover:underline'}`} 
                                title="View Waybill Details"
                              >
                                #{item.waybillNo}
                              </button>
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded tracking-wide">{item.dateAdded}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-5 bg-orange-50/50 p-3 rounded-lg border border-orange-100 flex-1 relative z-10">{item.remarks}</p>
                            
                            <div className="mt-auto relative z-10">
                              {confirmResolveId === item.id ? (
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in">
                                  <p className="text-xs text-green-800 font-bold text-center mb-3">Are you sure this is resolved?</p>
                                  <div className="flex gap-2">
                                    <button onClick={() => setConfirmResolveId(null)} className="flex-1 bg-white hover:bg-gray-100 text-gray-600 text-[11px] sm:text-xs font-bold py-2 rounded-md border border-gray-200 transition-colors shadow-sm">Cancel</button>
                                    <button onClick={() => handleRemovePending(item.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] sm:text-xs font-bold py-2 rounded-md transition-colors shadow-sm flex items-center justify-center gap-1"><Icons.CheckCircle className="w-3.5 h-3.5" /> Confirm</button>
                                  </div>
                                </div>
                              ) : (
                                <button onClick={() => setConfirmResolveId(item.id)} disabled={showLockOverlay} className={`w-full bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-green-100 ${showLockOverlay ? 'opacity-50 cursor-not-allowed' : ''}`}><Icons.CheckCircle className="w-4 h-4" /> Mark Resolved</button>
                              )}
                            </div>
                            
                          </div>
                        );
                      })}
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- POP-UP MODAL (RESPONSIVE) --- */}
      {isModalOpen && searchedWaybill && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[100vh] sm:max-h-[95vh] overflow-hidden flex flex-col relative">
            
            <div className="bg-white border-b border-gray-200 p-4 sm:px-6 sm:py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between shrink-0 shadow-sm z-10 gap-4">
              <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-teal-50 p-2 sm:p-2.5 rounded-xl border border-teal-100 shadow-sm hidden sm:block"><Icons.Box className="w-5 h-5 sm:w-6 sm:h-6 text-[#38b2ac]" /></div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 leading-none mb-1">Waybill Details</h1>
                    <p className="text-xs sm:text-sm font-bold text-gray-400 tracking-wide">#{searchedWaybill.id}</p>
                  </div>
                </div>
                <button onClick={closeWaybillModal} className="lg:hidden p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-500 shadow-sm bg-white shrink-0"><Icons.X className="w-5 h-5" /></button>
              </div>
              
              <div className="w-full lg:flex-1 lg:max-w-md lg:mx-4">
                <div className="relative flex w-full">
                  <input type="text" placeholder="Scan QR or Search Waybill No..." value={modalSearchQuery} onChange={(e) => setModalSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleModalSearch()} className="w-full pl-4 pr-[70px] py-2.5 sm:py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-[#38b2ac] shadow-sm font-bold text-gray-800" />
                  <button onClick={handleScanAction} className="absolute right-[46px] top-0 bottom-0 px-2 text-gray-400 hover:text-teal-600 transition-colors flex items-center justify-center" title="Scan Barcode / QR Code"><Icons.Scan className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  <button onClick={handleModalSearch} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 sm:py-2 rounded-r-lg text-sm transition-colors shadow-sm flex items-center justify-center"><Icons.Search className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button onClick={handleModifyClick} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-sm ${isEditing ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-white border border-gray-300 text-[#334155] hover:bg-gray-50'}`}>
                  {isEditing ? <><Icons.X className="w-4 h-4" /> Cancel</> : <><Icons.Pencil className="w-4 h-4" /> Modify Record</>}
                </button>
                <div className="w-px h-8 bg-gray-200 hidden lg:block"></div>
                <button onClick={closeWaybillModal} className="hidden lg:block p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-500 shadow-sm bg-white"><Icons.X className="w-6 h-6" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
              
              {/* ================= LEFT COLUMN ================= */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border transition-all ${isEditing ? 'border-[#38b2ac] ring-1 ring-[#38b2ac]/20' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-4 sm:mb-6 text-[#38b2ac] font-extrabold text-base sm:text-lg border-b border-gray-100 pb-3"><Icons.Box className="w-5 h-5" /> Package Information</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-6">
                    <div>
                      <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Patient Name</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-bold text-sm sm:text-base">{searchedWaybill.patientName}</span>
                        <button onClick={handlePatientProfileClick} title="View Patient Profile" className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-[#38b2ac] text-gray-500 hover:text-white rounded-full transition-colors shadow-sm shrink-0"><Icons.User className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Status</span>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-extrabold shadow-sm text-white ${searchedWaybill.status === 'Delivered' ? 'bg-[#28a745]' : 'bg-[#f59f00]'}`}>{searchedWaybill.status}</span>
                      <div className="mt-1.5 flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-gray-400 italic">Remarks:</span>
                        <span className="text-gray-900 font-bold text-xs sm:text-sm leading-tight">{searchedWaybill.reason}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Waybill No.</span>
                      <span className="text-gray-900 font-bold text-sm sm:text-base">{searchedWaybill.id}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Order Date</span>
                      <span className="text-gray-900 font-bold text-sm sm:text-base">{searchedWaybill.date}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Mobile No.</span>
                      <span className="text-gray-900 font-bold text-sm sm:text-base">{searchedWaybill.mobile}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Urgent Level</span>
                      <span className="text-gray-900 font-bold text-sm sm:text-base">{searchedWaybill.urgentLevel}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 mt-2">
                      <div>
                        <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Address</span>
                        <span className="block text-gray-900 font-bold text-xs sm:text-base break-words">{searchedWaybill.address}</span>
                      </div>
                      <button onClick={handleDirections} className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md bg-white hover:bg-gray-100 transition-colors text-xs font-bold shadow-sm shrink-0"><Icons.Directions className="w-4 h-4 text-[#28a745]" /> Directions</button>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="bg-orange-50/80 p-4 sm:p-5 rounded-xl shadow-sm border border-orange-200 mt-auto">
                    <h3 className="font-extrabold text-orange-600 mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide"><Icons.Alert className="w-4 h-4"/> Dispatcher Actions</h3>
                    {!showOverrideConfirm ? (
                      <button onClick={() => setShowOverrideConfirm(true)} className="w-full bg-[#f59f00] text-white font-extrabold py-3 rounded-lg shadow-md hover:bg-orange-500 transition-transform active:scale-[0.98] text-sm">Override Delivery Status</button>
                    ) : (
                      <div className="bg-white p-3 sm:p-4 rounded-lg border border-orange-200 shadow-sm animate-fade-in">
                        <p className="text-xs sm:text-sm font-bold text-gray-800 mb-3 text-center">Are you sure you want to forcefully override this status?</p>
                        <div className="flex gap-2 sm:gap-3">
                          <button onClick={() => setShowOverrideConfirm(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-2 sm:py-2.5 rounded-md hover:bg-gray-200 transition-colors text-[10px] sm:text-xs tracking-wide">NO, CANCEL</button>
                          <button onClick={executeStatusOverride} className="flex-1 bg-[#28a745] text-white font-bold py-2 sm:py-2.5 rounded-md hover:bg-green-600 transition-colors text-[10px] sm:text-xs tracking-wide shadow-sm">YES, OVERRIDE</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ================= RIGHT COLUMN (Files) ================= */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 relative">
                
                <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border flex-1 flex flex-col transition-all relative overflow-hidden ${isEditing ? 'border-[#38b2ac] ring-1 ring-[#38b2ac]/20' : 'border-gray-200'}`}>
                  
                  <div className="flex items-center gap-2 mb-4 text-[#007bff] font-extrabold text-base sm:text-lg border-b border-gray-100 pb-3"><Icons.CheckCircleSolid className="w-5 h-5 sm:w-6 sm:h-6" /> Proof of Delivery</div>
                  <div className="flex items-center gap-2 mb-2 mt-1"><Icons.Folder className="w-4 h-4 text-gray-400" /><span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wide">Delivery Documents</span></div>

                  <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm text-left min-w-[320px]">
                        <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold border-b border-gray-200">Document Name</th>
                            <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold border-b border-gray-200 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DOCUMENTS.map((doc) => {
                            const isUploaded = !!(tempDocuments[doc.name] || searchedWaybill?.documents?.[doc.name]);
                            const isThisUploading = uploadingDocName === doc.name;

                            return (
                              <tr key={doc.id} className={`border-b border-gray-100 last:border-b-0 transition-colors ${isThisUploading ? 'bg-gray-100 opacity-70' : 'hover:bg-gray-50'}`}>
                                <td className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-2.5 font-bold text-[11px] sm:text-xs">
                                  {isThisUploading ? (
                                    <Icons.Refresh className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38b2ac] animate-spin shrink-0" />
                                  ) : isUploaded ? (
                                    <Icons.CheckCircleSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#28a745] shrink-0" />
                                  ) : (
                                    <Icons.Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 shrink-0" />
                                  )}
                                  
                                  <span className={`truncate ${isThisUploading ? 'text-[#38b2ac]' : isUploaded ? 'text-gray-800' : 'text-gray-400 font-medium'}`}>{doc.name}</span>
                                </td>
                                
                                <td className="px-2 sm:px-3 py-2 text-right">
                                  {isThisUploading ? (
                                    <span className="text-[10px] font-bold text-[#38b2ac] animate-pulse">Processing...</span>
                                  ) : (
                                    <div className="flex justify-end gap-1 sm:gap-1.5 items-center">
                                      <button onClick={() => handleViewFile(doc.name)} title="View" className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold transition-colors ${isUploaded ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-50 cursor-not-allowed'}`} disabled={!isUploaded}><Icons.Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View</span></button>
                                      {isEditing && <button onClick={() => handleReplaceFile(doc.name)} title={isUploaded ? "Replace" : "Upload File"} className="flex items-center gap-1 sm:gap-1.5 text-orange-600 bg-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold hover:bg-orange-100 transition-colors"><Icons.Refresh className="w-3.5 h-3.5" /> <span className="hidden xl:inline">{isUploaded ? "Replace" : "Upload"}</span></button>}
                                      {isEditing && doc.canCapture && <button onClick={() => openCameraModal(doc.name)} title="Capture via App Camera" className="flex items-center gap-1 sm:gap-1.5 text-purple-600 bg-purple-50 px-2 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold hover:bg-purple-100 transition-colors"><Icons.Camera className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Capture</span></button>}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 bg-gray-50 border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-[11px] sm:text-xs"><Icons.Upload className="w-4 h-4 text-gray-500" /> All Proof of Delivery Documents</div>
                    <span className="text-gray-400 text-[10px] sm:text-xs font-bold">Not available</span>
                  </div>

                  {(() => {
                    const isOtherUploading = uploadingDocName === "Other Documents";
                    return (
                      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-5 transition-colors ${isOtherUploading ? 'bg-gray-100 opacity-70' : ''}`}>
                        <div className="flex items-center gap-2 font-bold text-[11px] sm:text-xs">
                          {isOtherUploading ? <Icons.Refresh className="w-4 h-4 text-[#38b2ac] animate-spin" /> : <div className="w-2.5 h-2.5 border-2 border-gray-400 rounded-full"></div>}
                          <span className={isOtherUploading ? "text-[#38b2ac]" : "text-gray-800"}>Other Documents</span>
                        </div>
                        {isOtherUploading ? (
                          <span className="text-[#38b2ac] text-[10px] font-bold animate-pulse">Processing...</span>
                        ) : isEditing ? (
                          <button onClick={handleUploadDocs} className="text-[#38b2ac] bg-teal-50 px-4 sm:px-5 py-1.5 rounded-md text-[10px] sm:text-xs font-extrabold hover:bg-teal-100 transition-colors w-full sm:w-auto">UPLOAD FILE</button>
                        ) : (
                          <span className="text-gray-400 text-[9px] sm:text-[10px] uppercase font-black tracking-widest bg-gray-100 px-2 py-1 rounded w-max">Read Only</span>
                        )}
                      </div>
                    );
                  })()}

                  <div className="mt-auto">
                    <span className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Current Location</span>
                    <div className="w-full h-24 sm:h-32 bg-[#e5e3df] rounded-lg border border-gray-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                       <div className="flex flex-col items-center z-10"><Icons.MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 drop-shadow-md" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showModifyConfirm && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Pencil className="w-6 h-6 sm:w-8 sm:h-8 text-[#007bff]" /></div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Enable Editing Mode?</h2>
                  <p className="text-sm sm:text-base text-gray-500 font-medium mb-6 sm:mb-8">You are about to unlock this record for modifications. Are you sure you want to proceed?</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button onClick={() => setShowModifyConfirm(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">Cancel</button>
                    <button onClick={confirmModifyMode} className="flex-1 bg-[#38b2ac] text-white font-bold py-2.5 sm:py-3 rounded-lg hover:bg-teal-500 transition-colors shadow-md text-sm">Yes, Enable Edit</button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* --- IN-APP CAMERA OVERLAY --- */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center animate-fade-in">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <button onClick={closeCameraModal} className="p-3 sm:p-4 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-colors shadow-lg">
              <Icons.X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full max-h-[75vh] object-contain bg-black shadow-2xl"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent pt-20">
            <p className="text-white mb-4 sm:mb-6 text-sm sm:text-base font-extrabold tracking-wide drop-shadow-md text-center">
              {cameraFeedback}
            </p>
            <button 
              onClick={captureInAppPhoto} 
              className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-[5px] sm:border-[6px] border-gray-400 hover:border-[#38b2ac] flex items-center justify-center active:scale-90 transition-all shadow-xl"
            ></button>
          </div>
        </div>
      )}

      {viewingImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 flex-col">
          <div className="w-full max-w-4xl flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">{viewingImage.name}</h3>
            <button onClick={closeImageViewer} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><Icons.X className="w-6 h-6" /></button>
          </div>
          <img src={viewingImage.data} alt={viewingImage.name} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10" />
        </div>
      )}

      {showNotFoundAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in text-center">
            <div className="bg-red-50 p-6 flex justify-center"><div className="bg-red-100 p-3 rounded-full"><Icons.Alert className="w-8 h-8 text-red-600" /></div></div>
            <div className="p-6">
              <h3 className="text-xl font-black text-gray-800 mb-2">Waybill Not Found</h3>
              <p className="text-sm text-gray-500 font-medium mb-6">The tracking number <span className="font-bold text-red-600">#{notFoundWaybillId}</span> does not exist in the system. Please verify the number and try again.</p>
              <button onClick={() => setShowNotFoundAlert(false)} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors shadow-md">Understood</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}