import React, { useState, useEffect, useRef } from 'react';

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
  User: ({ className }) => <SvgIcon className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></SvgIcon>
};

// --- DATA ARRAYS ---
const TABS = [
  { id: 'dispatch', label: 'Dispatch', icon: Icons.Truck },
  { id: 'delivered_override', label: 'Delivered Override', icon: Icons.CheckCircle },
  { id: 'returns', label: 'Returns', icon: Icons.Undo },
  { id: 'exceptions', label: 'Exceptions', icon: Icons.Alert },
  { id: 'waybills', label: 'Waybills', icon: Icons.List } 
];

const DOCUMENTS = [
  { id: 1, name: "Signed Waybill (POD)", canCapture: true },
  { id: 2, name: "Package Photo Front", canCapture: false },
  { id: 3, name: "Package Photo Back", canCapture: false },
  { id: 4, name: "Recipient Valid ID", canCapture: true },
  { id: 5, name: "Additional Proof", canCapture: false },
];

let DUMMY_DATABASE = [
  { 
    id: '12345678', date: '2026-06-29', rider: 'Mark Reyes', 
    status: 'Delivered', reason: 'Delivered to recipient', 
    patientName: 'ab d ef', mobile: '12345678', address: '123456789', urgentLevel: '-'
  },
  { 
    id: '87654321', date: '2026-08-11', rider: 'John Doe', 
    status: 'Delivered', reason: 'Dropped off at front desk', 
    patientName: 'Jane Smith', mobile: '09171234567', address: 'Makati City', urgentLevel: 'High'
  }
];

export default function DispatcherDashboard() {
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

  // --- NEW STATE: Dropdown Menu ---
  const [isProcessMenuOpen, setIsProcessMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProcessMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- BUTTON FUNCTIONS ---
  const handleMainSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a Waybill No. to search.");
      return;
    }
    const found = DUMMY_DATABASE.find(w => w.id === searchQuery.trim());
    
    if (found) {
      setWaybills([found]);
      setActiveTab('waybills'); 
    } else {
      alert(`Waybill #${searchQuery} not found in database.`);
    }
  };

  const handleScanAction = () => alert("Simulating Barcode Scanner connection... Beep!");
  const handleApplyFilter = () => alert(`Filtering records for date range: ${dateRange}`);
  
  // Action Handlers for the New Buttons
  const handleGenerateDocuments = () => alert("Generating documents...");
  const handleProcessAction = (actionName) => {
    alert(`Executing action: ${actionName}`);
    setIsProcessMenuOpen(false); // Close menu after selection
  };

  const handleViewFile = (docName) => alert(`Opening ${docName} in document viewer...`);
  const handleReplaceFile = (docName) => alert(`Opening File Explorer to replace ${docName}...`);
  const handleCaptureFile = (docName) => alert(`Opening Camera to capture a new image for ${docName}...`);
  const handleUploadDocs = () => alert("Opening File Explorer to upload new supporting documents...");
  const handleDirections = () => alert(`Opening Google Maps routing to: ${searchedWaybill?.address}`);
  const handlePatientProfileClick = () => alert(`Opening patient profile for: ${searchedWaybill?.patientName}`);

  // --- MODAL CONTROLS ---
  const openWaybillModal = (waybillId) => {
    const found = waybills.find(w => w.id === waybillId);
    setSearchedWaybill(found || null);
    setIsEditing(false);
    setShowModifyConfirm(false);
    setShowOverrideConfirm(false);
    setIsModalOpen(true);
  };

  const closeWaybillModal = () => {
    setIsModalOpen(false);
    setSearchedWaybill(null);
    setIsEditing(false);
    setShowModifyConfirm(false);
    setShowOverrideConfirm(false);
  };

  const handleModifyClick = () => {
    if (isEditing) {
      setIsEditing(false); 
      setShowOverrideConfirm(false);
    } else {
      setShowModifyConfirm(true); 
    }
  };

  const confirmModifyMode = () => {
    setShowModifyConfirm(false);
    setIsEditing(true);
  };

  const executeStatusOverride = () => {
    const dbIndex = DUMMY_DATABASE.findIndex(w => w.id === searchedWaybill.id);
    if(dbIndex > -1) {
       DUMMY_DATABASE[dbIndex].status = 'Dispatcher Delivered Override';
       DUMMY_DATABASE[dbIndex].reason = 'CROPPPED RC';
    }

    const updatedWaybills = waybills.map(w => 
      w.id === searchedWaybill.id 
        ? { ...w, status: 'Dispatcher Delivered Override', reason: 'CROPPPED RC' } 
        : w
    );
    setWaybills(updatedWaybills);
    setSearchedWaybill({ ...searchedWaybill, status: 'Dispatcher Delivered Override', reason: 'CROPPPED RC' });
    
    alert(`Success: Waybill #${searchedWaybill.id} has been forcefully overridden.`);
    setShowOverrideConfirm(false);
    setIsEditing(false); 
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
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-700 relative">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[750px] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="bg-[#38b2ac] text-white p-5 flex items-center shrink-0">
          <div className="bg-white/20 p-2 rounded-lg mr-4">
            <Icons.Grid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide leading-tight">Dispatcher Dashboard</h1>
          </div>
        </div>

        {/* --- TOP BAR: SEARCH, FILTERS & ACTIONS --- */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/30 shrink-0">
          
          {/* Left Side: Search & Date */}
          <div className="flex flex-1 items-center gap-4 min-w-[320px] max-w-2xl">
            {/* Search */}
            <div className="relative flex-1 flex">
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
            <button onClick={handleMainSearch} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-r-lg text-sm font-bold tracking-wide transition-colors shadow-sm h-[38px] flex items-center gap-2 -ml-5 z-10">
               <Icons.Search className="w-4 h-4"/> SEARCH
            </button>

            <div className="w-px h-8 bg-gray-300 mx-2 hidden md:block"></div>

            {/* Date Filter */}
            <div className="flex bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden hidden md:flex">
              <div className="flex items-center pl-3 bg-gray-50 border-r border-gray-200">
                <Icons.Calendar className="w-4 h-4 text-gray-500 mr-2" />
              </div>
              <input 
                type="text" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 text-sm w-48 focus:outline-none text-gray-700 font-medium" 
              />
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleApplyFilter} 
              className="bg-[#38b2ac] hover:bg-teal-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
            >
              APPLY FILTER
            </button>
            
            <button 
              onClick={handleGenerateDocuments}
              className="bg-[#28a745] hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Icons.FileText className="w-4 h-4" /> GENERATE DOCUMENTS
            </button>

            {/* Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProcessMenuOpen(!isProcessMenuOpen)}
                className="bg-[#d9a404] hover:bg-yellow-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Icons.Box className="w-4 h-4" /> PROCESS WAYBILL <Icons.ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isProcessMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2 animate-fade-in origin-top-right">
                  <button onClick={() => handleProcessAction('Accept waybill for Dispatch')} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 border-b border-gray-100 pb-3 transition-colors">
                    <Icons.Box className="w-4 h-4 text-gray-400" /> Accept waybill for Dispatch
                  </button>
                  
                  <div className="px-5 py-2.5 text-xs font-black text-gray-400 uppercase tracking-wider mt-1">Assign Waybill</div>
                  <button onClick={() => handleProcessAction('To Delivery Team')} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors">
                    <Icons.Plus className="w-4 h-4 text-gray-400" /> To Delivery Team
                  </button>
                  <button onClick={() => handleProcessAction('To Rider')} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 border-b border-gray-100 pb-3 transition-colors">
                    <Icons.Truck className="w-4 h-4 text-gray-400" /> To Rider
                  </button>
                  
                  <div className="mt-1">
                    <button onClick={() => handleProcessAction('Return to MedPack')} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors">
                      <Icons.Undo className="w-4 h-4 text-gray-400" /> Return to MedPack
                    </button>
                    <button onClick={() => handleProcessAction('Return from Rider')} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 border-b border-gray-100 pb-3 transition-colors">
                      <Icons.Undo className="w-4 h-4 text-gray-400" /> Return from Rider
                    </button>
                  </div>

                  <div className="mt-1">
                    <button onClick={() => handleProcessAction('Waybill Exception')} className="w-full text-left px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm font-bold text-gray-700 transition-colors">
                      <Icons.Alert className="w-4 h-4 text-gray-400" /> Waybill Exception
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- TAB BAR --- */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0 overflow-x-auto">
          <div className="flex items-center space-x-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
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

        {/* --- MAIN CONTENT (TABLE) --- */}
        <div className="flex-1 bg-white">
          {waybills.length > 0 && activeTab === 'waybills' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white text-gray-400 uppercase text-[11px] font-bold border-y border-gray-100">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#38b2ac]" checked={selectedRows.size === waybills.length && waybills.length > 0} onChange={toggleAllRows} />
                    </th>
                    <th className="p-4">Waybill No.</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {waybills.map((waybill) => (
                    <tr key={waybill.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#38b2ac]" checked={selectedRows.has(waybill.id)} onChange={() => toggleRow(waybill.id)} />
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => openWaybillModal(waybill.id)}
                          className="font-bold text-[#38b2ac] hover:underline"
                        >
                          {waybill.id}
                        </button>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">{waybill.date}</td>
                      <td className="p-4 font-bold text-gray-900">{waybill.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center pt-20">
              <Icons.Search className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-gray-400 text-base font-medium tracking-wide">Enter a Tracking No. to search and display Waybills.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- POP-UP MODAL --- */}
      {isModalOpen && searchedWaybill && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          
          <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col relative">
            
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-100 shadow-sm">
                  <Icons.Box className="w-6 h-6 text-[#38b2ac]" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-800 leading-none mb-1">Waybill Details</h1>
                  <p className="text-sm font-bold text-gray-400 tracking-wide">#{searchedWaybill.id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleModifyClick}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
                    isEditing 
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                      : 'bg-white border border-gray-300 text-[#334155] hover:bg-gray-50'
                  }`}
                >
                  {isEditing ? <><Icons.X className="w-4 h-4" /> Cancel Override</> : <><Icons.Pencil className="w-4 h-4" /> Modify Record</>}
                </button>
                
                <div className="w-px h-8 bg-gray-200"></div>
                
                <button onClick={closeWaybillModal} className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-500 shadow-sm bg-white">
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-row gap-6 min-w-min">
              
              {/* ================= LEFT COLUMN ================= */}
              <div className="w-1/2 flex flex-col gap-6">
                
                {/* PACKAGE INFORMATION */}
                <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${isEditing ? 'border-[#38b2ac] ring-1 ring-[#38b2ac]/20' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-6 text-[#38b2ac] font-extrabold text-lg border-b border-gray-100 pb-3">
                    <Icons.Box className="w-5 h-5" /> Package Information
                  </div>

                  <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                    <div>
                      <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Patient Name</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-bold text-base">{searchedWaybill.patientName}</span>
                        {/* PATIENT PROFILE CIRCLE BUTTON */}
                        <button 
                          onClick={handlePatientProfileClick}
                          title="View Patient Profile"
                          className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-[#38b2ac] text-gray-500 hover:text-white rounded-full transition-colors shadow-sm"
                        >
                          <Icons.User className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Status</span>
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold shadow-sm text-white ${searchedWaybill.status === 'Delivered' ? 'bg-[#28a745]' : 'bg-[#f59f00]'}`}>
                        {searchedWaybill.status}
                      </span>
                      <div className="mt-2 flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-gray-400 italic">Remarks:</span>
                        <span className="text-gray-900 font-bold text-sm leading-tight">{searchedWaybill.reason}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Waybill No.</span>
                      <span className="text-gray-900 font-bold text-base">{searchedWaybill.id}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Order Date</span>
                      <span className="text-gray-900 font-bold text-base">{searchedWaybill.date}</span>
                    </div>

                    <div>
                      <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Mobile No.</span>
                      <span className="text-gray-900 font-bold text-base">{searchedWaybill.mobile}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Urgent Level</span>
                      <span className="text-gray-900 font-bold text-base">{searchedWaybill.urgentLevel}</span>
                    </div>

                    <div className="col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                      <div>
                        <span className="block text-xs font-black text-gray-400 uppercase mb-1 tracking-wide">Address</span>
                        <span className="block text-gray-900 font-bold text-base">{searchedWaybill.address}</span>
                      </div>
                      <button onClick={handleDirections} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md bg-white hover:bg-gray-100 transition-colors text-xs font-bold shadow-sm shrink-0">
                        <Icons.Directions className="w-4 h-4 text-[#28a745]" /> Directions
                      </button>
                    </div>
                  </div>
                </div>

                {/* OVERRIDE ACTION BLOCK */}
                {isEditing && (
                  <div className="bg-orange-50/80 p-5 rounded-xl shadow-sm border border-orange-200 mt-auto">
                    <h3 className="font-extrabold text-orange-600 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Icons.Alert className="w-4 h-4"/> Dispatcher Actions
                    </h3>
                    
                    {!showOverrideConfirm ? (
                      <button 
                        onClick={() => setShowOverrideConfirm(true)}
                        className="w-full bg-[#f59f00] text-white font-extrabold py-3 rounded-lg shadow-md hover:bg-orange-500 transition-transform active:scale-[0.98] text-sm"
                      >
                        Override Delivery Status
                      </button>
                    ) : (
                      <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm animate-fade-in">
                        <p className="text-sm font-bold text-gray-800 mb-3 text-center">Are you sure you want to forcefully override this status?</p>
                        <div className="flex gap-3">
                          <button onClick={() => setShowOverrideConfirm(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-2.5 rounded-md hover:bg-gray-200 transition-colors text-xs tracking-wide">
                            NO, CANCEL
                          </button>
                          <button onClick={executeStatusOverride} className="flex-1 bg-[#28a745] text-white font-bold py-2.5 rounded-md hover:bg-green-600 transition-colors text-xs tracking-wide shadow-sm">
                            YES, OVERRIDE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ================= RIGHT COLUMN (Files) ================= */}
              <div className="w-1/2 flex flex-col gap-6">
                <div className={`bg-white p-6 rounded-xl shadow-sm border flex-1 flex flex-col transition-all ${isEditing ? 'border-[#38b2ac] ring-1 ring-[#38b2ac]/20' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-4 text-[#007bff] font-extrabold text-lg border-b border-gray-100 pb-3">
                    <Icons.CheckCircleSolid className="w-6 h-6" /> Proof of Delivery
                  </div>

                  <div className="flex items-center gap-2 mb-2 mt-1">
                    <Icons.Folder className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wide">Delivery Documents</span>
                  </div>

                  {/* Refactored Files List */}
                  <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-4 py-2.5 text-xs font-bold border-b border-gray-200">Document Name</th>
                          <th className="px-4 py-2.5 text-xs font-bold border-b border-gray-200 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DOCUMENTS.map((doc) => (
                          <tr key={doc.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 flex items-center gap-2.5 font-bold text-gray-700 text-xs">
                              <Icons.CheckCircleSolid className="w-4 h-4 text-[#28a745]" /> 
                              {doc.name}
                            </td>
                            <td className="px-3 py-2 text-right">
                              
                              {/* UPGRADED ACTION BUTTONS */}
                              <div className="flex justify-end gap-1.5 items-center">
                                
                                <button 
                                  onClick={() => handleViewFile(doc.name)} 
                                  title="View"
                                  className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-blue-100 transition-colors"
                                >
                                  <Icons.Eye className="w-3.5 h-3.5" /> View
                                </button>
                                
                                {isEditing && (
                                  <button 
                                    onClick={() => handleReplaceFile(doc.name)} 
                                    title="Replace"
                                    className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-orange-100 transition-colors"
                                  >
                                    <Icons.Refresh className="w-3.5 h-3.5" /> Replace
                                  </button>
                                )}
                                
                                {isEditing && doc.canCapture && (
                                  <button 
                                    onClick={() => handleCaptureFile(doc.name)} 
                                    title="Capture Camera"
                                    className="flex items-center gap-1.5 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-purple-100 transition-colors"
                                  >
                                    <Icons.Camera className="w-3.5 h-3.5" /> Capture
                                  </button>
                                )}

                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg mb-3">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs">
                      <Icons.Upload className="w-4 h-4 text-gray-500" /> All Proof of Delivery Documents
                    </div>
                    <span className="text-gray-400 text-xs font-bold">Not available</span>
                  </div>

                  <div className="flex justify-between items-center border border-gray-200 px-4 py-3 rounded-lg mb-5">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-xs">
                      <div className="w-2.5 h-2.5 border-2 border-gray-400 rounded-full"></div> Other Documents
                    </div>
                    {isEditing ? (
                      <button onClick={handleUploadDocs} className="text-[#38b2ac] bg-teal-50 px-5 py-1.5 rounded-md text-xs font-extrabold hover:bg-teal-100 transition-colors">UPLOAD FILE</button>
                    ) : (
                      <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest bg-gray-100 px-2 py-1 rounded">Read Only</span>
                    )}
                  </div>

                  {/* Location Map */}
                  <div className="mt-auto">
                    <span className="block text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Current Location</span>
                    <div className="w-full h-32 bg-[#e5e3df] rounded-lg border border-gray-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                       <div className="flex flex-col items-center z-10">
                          <Icons.MapPin className="w-8 h-8 text-red-500 drop-shadow-md" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODIFY VERIFICATION OVERLAY */}
            {showModifyConfirm && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.Pencil className="w-8 h-8 text-[#007bff]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Enable Editing Mode?</h2>
                  <p className="text-gray-500 font-medium mb-8">You are about to unlock this record for modifications. Are you sure you want to proceed?</p>
                  <div className="flex gap-4">
                    <button onClick={() => setShowModifyConfirm(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                      Cancel
                    </button>
                    <button onClick={confirmModifyMode} className="flex-1 bg-[#38b2ac] text-white font-bold py-3 rounded-lg hover:bg-teal-500 transition-colors shadow-md">
                      Yes, Enable Edit
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

    </div>
  );
}