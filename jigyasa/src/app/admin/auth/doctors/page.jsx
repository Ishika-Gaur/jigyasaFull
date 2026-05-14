"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import * as XLSX from "xlsx";
import {
  ImagePlus, Type, AlignLeft, Stethoscope,
  Upload, CheckCircle2, Loader2, Sparkles,
  ChevronRight, X, Eye, Trash2, Pencil,
  RefreshCw, ArrowLeft, Save, LayoutGrid,
  FileSpreadsheet, Download, AlertCircle, Table2,
  User, Building2,
} from "lucide-react";
import Link from "next/link";

const API_AUTH    = "http://localhost:4000/api/auth";
const API_DOCTORS = "http://localhost:4000/api/doctors";

const IMAGE_POSITIONS = [
  { label: "Top",    value: "center 5%"  },
  { label: "15%",    value: "center 15%" },
  { label: "25%",    value: "center 25%" },
  { label: "35%",    value: "center 35%" },
  { label: "Center", value: "center 50%" },
  { label: "65%",    value: "center 65%" },
  { label: "Bottom", value: "center 80%" },
];

// ── All 18 doctors pre-loaded ──
const PRESET_DOCTORS = [
  { id:1,  name:"Dr. C.P. Singh",       title:"Senior Consultant Physician M.B.B.S, M.D.(Medicine) KGMC Lucknow",                                     description:"Expert in surgical procedures, ensuring precise treatments, faster recovery, and optimal patient care.",                                                                                                     image:"/doctors/best-consultant-physician-dr-cp-singh.png",        specialty:"General Medicine"          },
  { id:2,  name:"Dr. Amit Kumar Singh", title:"MD(BHU), DM Cardiology (KGMU), FSCAI Senior Interventional Cardiologist",                              description:"Committed to Protecting Your Heart with Expertise and Compassion.",                                                                                                                                      image:"/doctors/best-cardiologist-dr-amit-kumar-singh.png",        specialty:"Cardiology"                },
  { id:3,  name:"Dr. Akansha Singh",    title:"MBBS MS OBG, Fellowship in ART OBS & Gynecologist",                                                    description:"Specializing in women's health, maternity care, and reproductive wellness with personalized, compassionate care.",                                                                                  image:"/doctors/best-gynecologist-dr-akansha.png",                 specialty:"Obstetrics & Gynecology"   },
  { id:4,  name:"Dr. Sana Ibad Khan",   title:"M.D. (Pediatrics), Fellow Neonatology Senior Pediatrician",                                            description:"Dedicated to child healthcare, offering expert diagnosis, treatment, and preventive care for overall well-being.",                                                                              image:"/doctors/best-pediatrician-dr-sana-ibad-khan.png",          specialty:"Pediatrics"                },
  { id:5,  name:"Dr. Shariq Ahmad",     title:"MBBS, D. Ortho Senior Orthopedician",                                                                  description:"Where Precision Medicine Meets Compassionate Healing",                                                                                                                                                  image:"/doctors/best-orthopediacian-dr-shariq.png",                specialty:"Orthopedics"               },
  { id:6,  name:"Dr. Vibhor Agarwal",   title:"MBBS, MS, FIAGES General & Laparoscopic Surgeon",                                                      description:"Advanced Keyhole Surgery for Faster Healing and Better Outcomes",                                                                                                                                    image:"/doctors/best-laparscopic-surgeon-dr-vibhor-agarwal.jpg",   specialty:"Laparoscopic Surgery"      },
  { id:7,  name:"Dr. Imran",            title:"MBBS KGMU Lucknow DPM (MD) (cip RANCHI) Consultant Neuropsychiatrist",                                 description:"Specialized in caring for the brain, spine, and nervous system.",                                                                                                                                   image:"/doctors/best-neuropsychiatrist-dr-imran.png",              specialty:"Neuropsychiatry"           },
  { id:8,  name:"Dr. Kriti Kishore",    title:"MBBS, MD DM (Rheumatologist, KGMU) Senior Consultant Rheumatology",                                    description:"Advanced Keyhole Surgery for Faster Healing and Better Outcomes",                                                                                                                                    image:"/doctors/best-rheumatologist-dr-kriti-kishor.png",          specialty:"Rheumatology"              },
  { id:9,  name:"Dr. Anil Rajput",      title:"M.B.B.S., M.S., (M.Ch. (Plastic Surgery) F.L.C.L.S., F.L.C.S., F.I.H.R.S)",                          description:"Advanced Keyhole Surgery for Faster Healing and Better Outcomes",                                                                                                                                    image:"/doctors/best-plastic-surgery-dr-anil-rajput.png",          specialty:"Plastic Surgery"           },
  { id:10, name:"Dr. Abida",            title:"M.B.B.S., M.D.(JNMCH), PGDD (RIMS) Ex Senior Resident(LNJP, New Delhi)",                              description:"Expert in treating skin, hair, and nail disorders with advanced dermatological care and precision.",                                                                                         image:"/doctors/best-dermatology-dr-abida-ali.png",                specialty:"Dermatology"               },
  { id:11, name:"Dr. Ashish Gupta",     title:"MBBS, MD(AIIMS,New Delhi) DM Endo (PGIMER,Chandigarh) Consultant Endocrinologist",                     description:"Expert in diabetes, thyroid, hormonal disorders, and reproductive health, providing comprehensive endocrine care.",                                                                              image:"/doctors/best-endocrinologist-dr-ashish-gupta.png",         specialty:"Endocrinology"             },
  { id:12, name:"Dr. Deeksha Singh",    title:"MBBS, MS Ophthalmologist",                                                                             description:"Provides comprehensive eye care services, including diagnosis and treatment of various eye conditions, using modern technology and expert medical care.",                               image:"/doctors/best-opthalmologist-dr-deeksha-singh.png",         specialty:"Ophthalmology"             },
  { id:13, name:"Dr. Pabitra Sahu",     title:"Senior Consultant - Gastroenterology, Hepatology & Endoscopy",                                         description:"Offers comprehensive care for digestive, liver, and gastrointestinal disorders, including advanced diagnostic endoscopy and personalized treatment using modern medical technology.", image:"/doctors/best-gastroenterologist-dr-pavitra-sahu.png",      specialty:"Gastroenterology"          },
  { id:14, name:"Dr. Pragnesh Desai",   title:"Principal Consultant - Urology, Kidney Transplant, Robotic Surgery",                                   description:"Advanced care for kidney and urinary tract diseases, offering modern urology, kidney transplant services, and minimally invasive robotic surgery with a patient-focused approach.",  image:"/doctors/best-urologist-dr-parnesh.png",                    specialty:"Urology"                   },
  { id:15, name:"Dr. Faran Naim",       title:"Senior Consultant - Hematology & Bone Marrow Transplantation",                                         description:"Advanced care for blood disorders and blood cancers, offering comprehensive hematology services and bone marrow transplantation with a patient-centered approach.",                   image:"/doctors/best-hematogist-dr-faran.png",                     specialty:"Hematology"                },
  { id:16, name:"Dr. Rahul Kumar",      title:"MBBS, DNB (General Surgery) DNB (Gastro Surgery) Senior GI Surgeon",                                   description:"Advanced surgical care for digestive system disorders, offering minimally invasive laparoscopic procedures with a focus on safety, precision, and faster recovery.",                  image:"/doctors/best-gi-surgeon-dr-rahul-singh.png",               specialty:"GI Surgery"                },
  { id:17, name:"Dr. Karishma Singh",   title:"MBBS, MS (Obst & Gynae) IVF Specialist and Laparoscopic Gynaecologic Surgeon",                         description:"Comprehensive care for women's health, fertility, and reproductive treatments.",                                                                                                                     image:"/doctors/best-gynaecologist-dr-karishma.png",               specialty:"Gynecology & IVF"          },
  { id:18, name:"Dr. Ankit Singh",      title:"MBBS (SRMS, IMS Bareilly) Family Physician",                                                           description:"Comprehensive primary care for all ages, focusing on prevention, diagnosis, and personalized treatment.",                                                                                      image:"/doctors/best-family-physician-dr-ankit-singh.png",         specialty:"Family Medicine"           },
];

// ── Excel helpers ──

// ✅ Accept both http URLs AND local image filenames
function isValidImage(val) {
  if (!val) return false;
  const lower = val.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return true;
  if (/\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(lower)) return true;
  return false;
}

function findHeaderRowIndex(ws) {
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z100");
  for (let r = range.s.r; r <= Math.min(range.e.r, 10); r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell && String(cell.v ?? "").toLowerCase().trim() === "name") return r;
    }
  }
  return 0;
}

function parseWorksheet(ws) {
  const headerRowIdx = findHeaderRowIndex(ws);
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z1000");
  const headers = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: headerRowIdx, c })];
    headers.push(cell ? String(cell.v ?? "").trim() : `col_${c}`);
  }
  let dataStart = headerRowIdx + 1;
  const nameIdx = headers.findIndex(h => h.toLowerCase() === "name");
  if (nameIdx >= 0) {
    const hintCell = ws[XLSX.utils.encode_cell({ r: dataStart, c: nameIdx })];
    const hintVal  = hintCell ? String(hintCell.v ?? "").toLowerCase() : "";
    if (hintVal.startsWith("e.g.") || hintVal.includes("cloudinary")) dataStart++;
  }
  const rows = [];
  for (let r = dataStart; r <= range.e.r; r++) {
    const obj = {}; let hasVal = false;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      const val  = cell ? String(cell.v ?? "").trim() : "";
      obj[headers[c] || `col_${c}`] = val;
      if (val) hasVal = true;
    }
    if (hasVal) rows.push(obj);
  }
  return rows;
}

function parseDoctorRow(row) {
  const norm = s => s.toLowerCase().replace(/[\s_]+/g, "");
  const get  = key => {
    const match = Object.keys(row).find(k => norm(k) === norm(key));
    return match ? String(row[match] ?? "").trim() : "";
  };
  const name        = get("name");
  const specialty   = get("specialty");
  const title       = get("title") || get("qualification");
  const description = get("description");
  const imageUrl    = get("imageurl") || get("image") || get("photo") || "";
  const rawPos      = get("imageposition") || get("faceposition") || "";
  const posMatch    = IMAGE_POSITIONS.find(p => p.value === rawPos || p.label.toLowerCase() === rawPos.toLowerCase());
  const imagePosition = posMatch ? posMatch.value : "center 15%";

  const lower = name.toLowerCase();
  // ✅ Skip placeholder, header, AND summary/total rows
  if (
    lower.startsWith("e.g.") ||
    lower === "name" ||
    lower.startsWith("total:") ||
    lower.startsWith("total ") ||
    lower.includes("doctors in this batch") ||
    name === ""
  ) return null;

  const errors = [];
  if (!name)        errors.push("Name is required");
  if (!specialty)   errors.push("Specialty is required");
  if (!title)       errors.push("Qualification/Title is required");
  if (!description) errors.push("Description is required");
  // ✅ Accept both Cloudinary URLs AND local filenames (e.g. best-doctor.png)
  if (!isValidImage(imageUrl)) errors.push("Image required — use a Cloudinary URL (https://...) or a local filename (e.g. best-doctor.png)");

  return { name, specialty, title, description, imageUrl, imagePosition, errors, valid: errors.length === 0 };
}

export default function AdminDoctors() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("manual");

  // Manual form
  const [form,         setForm]         = useState({ name:"", title:"", specialty:"", description:"", imagePosition:"center 15%" });
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState("");

  // Bulk
  const [bulkFile,      setBulkFile]      = useState(null);
  const [bulkRows,      setBulkRows]      = useState([]);
  const [bulkDragOver,  setBulkDragOver]  = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkProgress,  setBulkProgress]  = useState({ done:0, total:0 });
  const [bulkErrors,    setBulkErrors]    = useState([]);
  const [bulkDone,      setBulkDone]      = useState(false);
  const [previewRow,    setPreviewRow]    = useState(null);

  // List — seed with preset doctors, will be overwritten by DB fetch
  const [doctors,     setDoctors]     = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deletingId,  setDeletingId]  = useState(null);

  // Edit modal
  const [editDoctor,       setEditDoctor]       = useState(null);
  const [editForm,         setEditForm]         = useState({ name:"", title:"", specialty:"", description:"", imagePosition:"center 15%" });
  const [editImageFile,    setEditImageFile]    = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editLoading,      setEditLoading]      = useState(false);
  const [editError,        setEditError]        = useState("");
  const [editSuccess,      setEditSuccess]      = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try { await axios.get(`${API_AUTH}/me`, { withCredentials: true }); }
      catch { router.push("/admin/auth/login"); }
      finally { setChecking(false); }
    };
    checkAuth();
  }, []);

  const fetchDoctors = async () => {
    setListLoading(true);
    try {
      const res = await axios.get(API_DOCTORS, { withCredentials: true });
      setDoctors(res.data);
    } catch {
      // Fallback: show preset local doctors if API unavailable
      setDoctors(PRESET_DOCTORS.map(d => ({ ...d, _id: String(d.id), _isPreset: true })));
    }
    finally { setListLoading(false); }
  };

  useEffect(() => { if (!checking) fetchDoctors(); }, [checking]);

  const toBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader(); r.readAsDataURL(file); r.onload = () => res(r.result); r.onerror = rej;
  });

  const handleImage     = (file) => { if (file?.type.startsWith("image/")) { setImageFile(file);     setImagePreview(URL.createObjectURL(file));     } };
  const handleEditImage = (file) => { if (file?.type.startsWith("image/")) { setEditImageFile(file); setEditImagePreview(URL.createObjectURL(file)); } };

  // Manual submit
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { ...form };
      if (imageFile) payload.image = await toBase64(imageFile);
      await axios.post(API_DOCTORS, payload, { withCredentials: true });
      setSuccess(true);
      setForm({ name:"", title:"", specialty:"", description:"", imagePosition:"center 15%" });
      setImageFile(null); setImagePreview(null);
      setTimeout(() => setSuccess(false), 3500);
      fetchDoctors();
    } catch (err) { setError(err?.response?.data?.message || "Upload failed."); }
    finally { setLoading(false); }
  };

  // Excel parse
  const handleExcelFile = (file) => {
    if (!file) return;
    setBulkFile(file); setBulkRows([]); setBulkErrors([]); setBulkDone(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type:"array" });
        const sheetName = wb.SheetNames.find(n => n.toLowerCase().includes("doctor")) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rawRows = parseWorksheet(ws);
        if (!rawRows.length) { setBulkErrors(["No data rows found."]); return; }
        const parsed = rawRows.map(parseDoctorRow).filter(Boolean);
        if (!parsed.length) { setBulkErrors(["All rows skipped. Fill in real data."]); return; }
        setBulkRows(parsed);
      } catch (err) { setBulkErrors([`Failed to parse: ${err.message}`]); }
    };
    reader.readAsArrayBuffer(file);
  };

  const validRows   = bulkRows.filter(r => r.valid);
  const invalidRows = bulkRows.filter(r => !r.valid);

  const handleBulkImport = async () => {
    if (!validRows.length) return;
    setBulkImporting(true); setBulkProgress({ done:0, total:validRows.length });
    const errs = [];
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        await axios.post(API_DOCTORS, {
          name: row.name, specialty: row.specialty, title: row.title,
          description: row.description, imageUrl: row.imageUrl,
          imagePosition: row.imagePosition, useUrl: true,
        }, { withCredentials: true });
      } catch (err) {
        errs.push(`"${row.name}": ${err?.response?.data?.message || err.message}`);
      }
      setBulkProgress({ done:i+1, total:validRows.length });
    }
    setBulkErrors(errs); setBulkImporting(false); setBulkDone(true);
    fetchDoctors();
  };

  const resetBulk = () => { setBulkFile(null); setBulkRows([]); setBulkErrors([]); setBulkDone(false); setBulkImporting(false); };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this doctor? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_DOCTORS}/${id}`, { withCredentials: true });
      setDoctors(prev => prev.filter(d => (d._id || d.id) !== id));
    } catch { alert("Failed to delete doctor."); }
    finally { setDeletingId(null); }
  };

  // Edit
  const openEdit = (doc) => {
    setEditDoctor(doc);
    setEditForm({ name:doc.name||"", title:doc.title||"", specialty:doc.specialty||"", description:doc.description||"", imagePosition:doc.imagePosition||"center 15%" });
    setEditImageFile(null); setEditImagePreview(null); setEditError(""); setEditSuccess(false);
  };
  const closeEdit = () => { setEditDoctor(null); setEditImageFile(null); setEditImagePreview(null); setEditError(""); setEditSuccess(false); };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditLoading(true); setEditError("");
    try {
      const payload = { ...editForm };
      if (editImageFile) payload.image = await toBase64(editImageFile);
      const id = editDoctor._id || editDoctor.id;
      await axios.patch(`${API_DOCTORS}/${id}`, payload, { withCredentials: true });
      setDoctors(prev => prev.map(d => (d._id||d.id) === id ? { ...d, ...editForm } : d));
      setEditSuccess(true);
      setTimeout(() => { setEditSuccess(false); closeEdit(); }, 1800);
    } catch (err) { setEditError(err?.response?.data?.message || "Update failed."); }
    finally { setEditLoading(false); }
  };

  // Get doctor photo src
  // ── Robust image resolver — handles ALL backend response shapes ──
  const getPhotoSrc = (doc) => {
    const id = doc._id || doc.id;

    // Preset local doctors — use /public path directly
    if (doc._isPreset) return doc.image;

    // Shape 1: MongoDB binary { image: { contentType, data } } — stored via multer
    if (doc.image && typeof doc.image === "object" && doc.image.contentType) {
      return `${API_DOCTORS}/${id}/image`;
    }

    // Shape 2: base64 wrapped in object { image: { data: "base64..." } }
    if (doc.image && typeof doc.image === "object" && doc.image.data) {
      if (typeof doc.image.data === "string") {
        const prefix = doc.image.contentType
          ? `data:${doc.image.contentType};base64,`
          : "data:image/jpeg;base64,";
        return `${prefix}${doc.image.data}`;
      }
      return `${API_DOCTORS}/${id}/image`;
    }

    // Shape 3: { imageUrl: "https://..." } — Cloudinary or any remote URL
    if (doc.imageUrl && typeof doc.imageUrl === "string" && doc.imageUrl.length > 4) {
      return doc.imageUrl;
    }

    // Shape 4: { image: "https://..." } — URL stored directly in image field
    if (doc.image && typeof doc.image === "string" && doc.image.startsWith("http")) {
      return doc.image;
    }

    // Shape 5: { image: "/doctors/..." } — local public path
    if (doc.image && typeof doc.image === "string" && doc.image.length > 0) {
      return doc.image;
    }

    // Shape 6: has_image / hasImage flag
    if (doc.has_image || doc.hasImage) {
      return `${API_DOCTORS}/${id}/image`;
    }

    // Shape 7: last resort — always try the /image API endpoint
    if (id) return `${API_DOCTORS}/${id}/image`;

    return null;
  };

  if (checking) return (
    <div style={{ minHeight:"100vh", background:"#f0fdfa", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Loader2 style={{ width:28, height:28, color:"#14b8a6", animation:"d-spin 1s linear infinite" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes d-spin  { to { transform: rotate(360deg); } }
        @keyframes d-modal { from { opacity:0; transform: scale(.96) translateY(12px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes d-toast { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes d-fade  { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

        .d-root *, .d-root *::before, .d-root *::after { box-sizing: border-box; }
        .d-root { min-height:100vh; background:#f0fdfa; font-family:'Satoshi',system-ui,sans-serif; }

        .d-topbar { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-bottom:1px solid rgba(20,184,166,.12); padding:10px 20px; }
        .d-topbar a { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#64748b; text-decoration:none; }
        .d-topbar a:hover { color:#0d9488; }
        .d-topbar-cur { font-size:12px; font-weight:600; color:#0d9488; }

        .d-layout { display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:1100px; margin:0 auto; padding:14px 14px 20px; align-items:start; }
        @media (max-width:820px) { .d-layout { grid-template-columns:1fr; } }

        .d-card { background:white; border-radius:16px; border:1px solid rgba(20,184,166,.12); box-shadow:0 4px 20px rgba(13,148,136,.1); overflow:hidden; display:flex; flex-direction:column; }
        .d-card-hdr { background:linear-gradient(135deg,#064e3b 0%,#0f766e 50%,#14b8a6 100%); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
        .d-card-hdr h2 { font-size:14px; font-weight:700; color:white; margin:0; letter-spacing:-.2px; }
        .d-card-hdr p  { font-size:11px; color:rgba(255,255,255,.6); margin:2px 0 0; }
        .d-body { padding:14px 16px 16px; flex:1; overflow-y:auto; }

        .d-tabs { display:flex; border-bottom:2px solid rgba(20,184,166,.1); margin-bottom:14px; }
        .d-tab { flex:1; padding:9px 10px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:none; display:flex; align-items:center; justify-content:center; gap:6px; color:#94a3b8; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; font-family:inherit; }
        .d-tab.active { color:#0d9488; border-bottom-color:#14b8a6; background:linear-gradient(180deg,transparent,rgba(20,184,166,.04)); }
        .d-tab:hover:not(.active) { color:#0d9488; background:rgba(20,184,166,.04); }

        .d-row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width:480px) { .d-row2 { grid-template-columns:1fr; } }
        .d-field { margin-bottom:10px; }
        .d-lbl { display:block; font-size:10px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:#0d9488; margin-bottom:4px; }
        .d-inp-wrap { position:relative; }
        .d-inp-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex; align-items:center; }
        .d-inp-icon.top { top:10px; transform:none; }
        .d-inp-wrap:focus-within .d-inp-icon { color:#14b8a6; }
        .d-inp { width:100%; padding:8px 10px 8px 32px; border:1.5px solid #e2f4f2; border-radius:9px; font-size:13px; color:#0f172a; background:#fafffe; outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
        .d-inp:focus { border-color:#14b8a6; box-shadow:0 0 0 3px rgba(20,184,166,.1); background:white; }
        .d-inp::placeholder { color:#b0cec9; }
        .d-inp.ta { min-height:72px; resize:vertical; line-height:1.5; padding-top:9px; }

        .d-upload { border:1.5px dashed rgba(20,184,166,.35); border-radius:10px; padding:14px 10px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
        .d-upload:hover,.d-upload.drag { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
        .d-upload input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; z-index:2; width:100%; height:100%; }
        .d-upload-t { font-size:12px; font-weight:600; color:#0d9488; margin-top:6px; }
        .d-upload-s { font-size:10px; color:#94a3b8; margin-top:2px; }

        .d-img-prev { position:relative; border-radius:10px; overflow:hidden; }
        .d-img-prev img { width:100%; height:110px; object-fit:cover; display:block; }
        .d-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.45),transparent); display:flex; align-items:flex-end; justify-content:space-between; padding:6px 8px; }
        .d-prev-badge { font-size:10px; font-weight:600; color:white; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); padding:2px 8px; border-radius:100px; display:flex; align-items:center; gap:4px; }
        .d-remove-btn { font-size:10px; font-weight:600; color:white; background:rgba(239,68,68,.85); padding:3px 8px; border-radius:100px; border:none; cursor:pointer; display:flex; align-items:center; gap:3px; }

        .d-pos-row { display:flex; gap:5px; flex-wrap:wrap; margin-top:6px; }
        .d-pos-pill { padding:4px 10px; border-radius:100px; font-size:10px; font-weight:700; cursor:pointer; transition:all .15s; border:1.5px solid #e2f4f2; background:#fafffe; color:#64748b; }
        .d-pos-pill.sel { background:#14b8a6; color:white; border-color:#14b8a6; }

        .d-divider { height:1px; background:linear-gradient(90deg,transparent,#e2f4f2,transparent); margin:10px 0; }
        .d-sec-lbl { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#0d9488; margin-bottom:6px; display:flex; align-items:center; gap:5px; }

        .d-submit { width:100%; padding:11px; background:linear-gradient(135deg,#064e3b 0%,#0f766e 40%,#14b8a6 100%); color:white; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; box-shadow:0 4px 16px rgba(20,184,166,.35); margin-top:10px; font-family:inherit; }
        .d-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(20,184,166,.45); }
        .d-submit:disabled { opacity:.7; cursor:not-allowed; }

        /* Bulk */
        .d-bulk-drop { border:2px dashed rgba(20,184,166,.35); border-radius:14px; padding:28px 20px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; }
        .d-bulk-drop.drag,.d-bulk-drop:hover { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
        .d-bulk-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; z-index:2; }
        .d-bulk-drop-icon { width:44px; height:44px; background:linear-gradient(135deg,#064e3b,#14b8a6); border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
        .d-bulk-drop h3 { font-size:14px; font-weight:700; color:#0d9488; margin:0 0 4px; }
        .d-bulk-drop p { font-size:11px; color:#64748b; margin:0; }

        .d-dl-btn { display:inline-flex; align-items:center; gap:6px; background:white; border:1.5px solid #b2f5ea; color:#0d9488; font-size:11px; font-weight:700; padding:7px 14px; border-radius:8px; cursor:pointer; margin-top:10px; text-decoration:none; transition:all .2s; font-family:inherit; }
        .d-dl-btn:hover { background:#f0fdfa; border-color:#14b8a6; transform:translateY(-1px); }

        .d-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid rgba(20,184,166,.15); margin-top:12px; animation:d-fade .3s ease both; }
        .d-table { width:100%; border-collapse:collapse; font-size:11px; }
        .d-table th { background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap; font-size:10px; letter-spacing:.5px; }
        .d-table td { padding:7px 10px; border-bottom:1px solid #f0fdfa; vertical-align:middle; max-width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .d-table tr:last-child td { border-bottom:none; }
        .d-table tr:nth-child(even) td { background:#f8fffd; }
        .d-table tr:hover td { background:#e6fef9; }
        .d-table .err-row td { background:#fff5f5 !important; }

        .d-bdg { display:inline-flex; align-items:center; gap:3px; font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; white-space:nowrap; }
        .d-bdg.ok  { background:#f0fdfa; color:#0d9488; border:1px solid #b2f5ea; }
        .d-bdg.err { background:#fff5f5; color:#ef4444; border:1px solid #fecaca; }
        .d-url { font-size:9px; color:#14b8a6; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:130px; }
        .d-url:hover { text-decoration:underline; }

        .d-bulk-stats { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0; }
        .d-stat-chip { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; font-size:11px; font-weight:700; }
        .d-progress-bar { height:6px; background:#e2f4f2; border-radius:100px; overflow:hidden; margin:10px 0; }
        .d-progress-fill { height:100%; background:linear-gradient(90deg,#064e3b,#14b8a6); border-radius:100px; transition:width .3s ease; }

        /* List */
        .d-list-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(20,184,166,.1); background:linear-gradient(to right,#f0fdfa,white); }
        .d-list-hdr h3 { font-size:13px; font-weight:700; color:#0f172a; margin:0; }
        .d-list-hdr p  { font-size:11px; color:#64748b; margin:2px 0 0; }

        .d-row { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #f5fffe; transition:background .15s; }
        .d-row:last-child { border-bottom:none; }
        .d-row:hover { background:#f0fdfa; }

        .d-avatar {
          width:54px; height:42px; border-radius:8px; flex-shrink:0;
          background:linear-gradient(135deg,#e8f5f3,#ccfbf1);
          overflow:hidden; display:flex; align-items:center; justify-content:center;
          border:1px solid rgba(20,184,166,.15);
        }
        .d-avatar img { width:100%; height:100%; object-fit:cover; object-position:center 20%; display:block; }

        .d-info { flex:1; min-width:0; }
        .d-name { font-size:13px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .d-spec { font-size:10px; font-weight:600; color:#14b8a6; }
        .d-ttl  { font-size:10px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .d-pill { flex-shrink:0; font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; white-space:nowrap; }
        .d-icon-btn { flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:1.5px solid; cursor:pointer; transition:all .18s; background:none; }
        .d-icon-btn:disabled { opacity:.5; cursor:not-allowed; pointer-events:none; }
        .d-icon-btn.teal { border-color:#b2f5ea; background:#f0fdfa; color:#0d9488; }
        .d-icon-btn.teal:hover { background:#0d9488; color:white; border-color:#0d9488; }
        .d-icon-btn.red  { border-color:#fecaca; background:#fff5f5; color:#ef4444; }
        .d-icon-btn.red:hover  { background:#ef4444; color:white; border-color:#ef4444; }
        .d-refresh-btn { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:#0d9488; background:#f0fdfa; border:1px solid #b2f5ea; padding:5px 10px; border-radius:8px; cursor:pointer; transition:background .2s; }
        .d-refresh-btn:hover { background:#ccfbf1; }

        /* Modals */
        .d-backdrop { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:12px; background:rgba(0,0,0,.52); backdrop-filter:blur(7px); }
        .d-modal { background:white; border-radius:18px; width:100%; max-width:520px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.22); animation:d-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
        .d-modal-hdr { padding:14px 18px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:5; background:linear-gradient(135deg,#064e3b,#0f766e,#14b8a6); }
        .d-modal-hdr p  { color:rgba(255,255,255,.6); font-size:10px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; margin:0 0 2px; }
        .d-modal-hdr h2 { font-size:15px; font-weight:700; color:white; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:380px; }
        .d-modal-close { width:28px; height:28px; border-radius:50%; border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.15); flex-shrink:0; }
        .d-modal-close:hover { background:rgba(255,255,255,.28); }
        .d-modal-body { padding:14px 18px 18px; }

        .d-preview-modal { background:white; border-radius:18px; width:100%; max-width:420px; max-height:85vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:d-modal .3s cubic-bezier(.34,1.56,.64,1) both; }

        .d-err { display:flex; align-items:center; gap:7px; background:#fff5f5; border:1px solid #fecaca; color:#ef4444; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
        .d-ok  { display:flex; align-items:center; gap:7px; background:#f0fdfa; border:1px solid #b2f5ea; color:#0d9488; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
        .d-cancel-btn { flex:1; border:1.5px solid #e2e8f0; background:#f8fafc; color:#64748b; font-weight:600; font-size:13px; padding:9px; border-radius:9px; cursor:pointer; transition:background .2s; font-family:inherit; }
        .d-cancel-btn:hover { background:#f1f5f9; }

        .d-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:10px 22px; border-radius:100px; font-size:13px; font-weight:600; box-shadow:0 8px 30px rgba(13,148,136,.45); z-index:99999; display:flex; align-items:center; gap:7px; white-space:nowrap; animation:d-toast .4s ease both; pointer-events:none; }

        @media (max-width:480px) { .d-layout { padding:10px 10px 14px; gap:10px; } .d-body { padding:10px 12px 12px; } }
      `}</style>

      <div className="d-root">
        <div className="d-topbar">
          <Link href="/admin/auth/dashboard"><ArrowLeft size={13} /> Dashboard</Link>
          <ChevronRight size={11} style={{ color:"#cbd5e1" }} />
          <span className="d-topbar-cur">Doctors</span>
        </div>

        <div className="d-layout">

          {/* ══ LEFT CARD ══ */}
          <div className="d-card">
            <div className="d-card-hdr">
              <div>
                <h2>{activeTab === "manual" ? "Add Doctor" : "Bulk Import via Excel"}</h2>
                <p>{activeTab === "manual" ? "Add a new doctor profile" : "Import multiple doctors at once"}</p>
              </div>
              <span style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", display:"inline-block" }} />
            </div>

            <div className="d-body">
              <div className="d-tabs">
                <button className={`d-tab ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
                  <User size={13} /> Manual Entry
                </button>
                <button className={`d-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
                  <FileSpreadsheet size={13} /> Bulk Import
                </button>
              </div>

              {/* MANUAL FORM */}
              {activeTab === "manual" && (
                <form onSubmit={handleSubmit}>
                  <div className="d-row2">
                    <div className="d-field">
                      <label className="d-lbl">Full Name</label>
                      <div className="d-inp-wrap">
                        <div className="d-inp-icon"><User size={13} /></div>
                        <input type="text" className="d-inp" placeholder="Dr. Anjali Sharma" required
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                    </div>
                    <div className="d-field">
                      <label className="d-lbl">Specialty</label>
                      <div className="d-inp-wrap">
                        <div className="d-inp-icon"><Stethoscope size={13} /></div>
                        <input type="text" className="d-inp" placeholder="e.g. Cardiology" required
                          value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="d-field">
                    <label className="d-lbl">Qualification / Title</label>
                    <div className="d-inp-wrap">
                      <div className="d-inp-icon"><Building2 size={13} /></div>
                      <input type="text" className="d-inp" placeholder="MBBS, MD (AIIMS) — Senior Cardiologist" required
                        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                  </div>

                  <div className="d-field">
                    <label className="d-lbl">Description</label>
                    <div className="d-inp-wrap">
                      <div className="d-inp-icon top"><AlignLeft size={13} /></div>
                      <textarea className="d-inp ta" placeholder="Brief description of expertise..." required
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="d-divider" />

                  <div className="d-field" style={{ marginBottom:0 }}>
                    <div className="d-sec-lbl"><ImagePlus size={11} /> Doctor Photo</div>
                    {!imagePreview ? (
                      <div className={`d-upload ${dragOver ? "drag" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImage(e.dataTransfer.files[0]); }}>
                        <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} />
                        <ImagePlus size={20} color="#14b8a6" />
                        <div className="d-upload-t">Click or drag photo</div>
                        <div className="d-upload-s">JPG · PNG · WebP</div>
                      </div>
                    ) : (
                      <>
                        <div className="d-img-prev">
                          <img src={imagePreview} alt="preview" style={{ objectPosition: form.imagePosition }} />
                          <div className="d-img-overlay">
                            <div className="d-prev-badge"><CheckCircle2 size={9} /> Photo ready</div>
                            <button type="button" className="d-remove-btn" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                              <X size={9} /> Remove
                            </button>
                          </div>
                        </div>
                        <div style={{ marginTop:8 }}>
                          <label className="d-lbl">Face Position</label>
                          <div className="d-pos-row">
                            {IMAGE_POSITIONS.map(p => (
                              <button key={p.value} type="button"
                                className={`d-pos-pill ${form.imagePosition === p.value ? "sel" : ""}`}
                                onClick={() => setForm({ ...form, imagePosition: p.value })}>
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {error && <div className="d-err" style={{ marginTop:10 }}><X size={12} /> {error}</div>}

                  <button type="submit" className="d-submit" disabled={loading}>
                    {loading
                      ? <><Loader2 size={15} style={{ animation:"d-spin 1s linear infinite" }} /> Saving...</>
                      : <><Sparkles size={15} /> Add Doctor <ChevronRight size={13} /></>}
                  </button>
                </form>
              )}

              {/* BULK IMPORT */}
              {activeTab === "bulk" && (
                <div>
                  <div style={{ background:"linear-gradient(135deg,#f0fdfa,#e6fef9)", border:"1px solid #b2f5ea", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:22, height:22, background:"linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ color:"white", fontWeight:900, fontSize:11 }}>1</span>
                      </div>
                      <span style={{ fontWeight:700, fontSize:12, color:"#0d9488" }}>Download the Template</span>
                    </div>
                    <p style={{ fontSize:11, color:"#64748b", margin:"0 0 4px", lineHeight:1.6 }}>
                      Fill: <b>name</b>, <b>specialty</b>, <b>title</b>, <b>description</b>, <b>imageurl</b> (Cloudinary), <b>imageposition</b> (optional).
                    </p>
                    <button className="d-dl-btn" onClick={() => {
                      const wb = XLSX.utils.book_new();
                      const ws = XLSX.utils.aoa_to_sheet([
                        ["name","specialty","title","description","imageurl","imageposition"],
                        ["e.g. Dr. Anjali Sharma","Cardiology","MBBS, MD — Cardiologist","15+ years experience...","https://res.cloudinary.com/.../doctor.jpg","center 15%"],
                      ]);
                      ws["!cols"] = [{wch:28},{wch:18},{wch:38},{wch:50},{wch:58},{wch:16}];
                      XLSX.utils.book_append_sheet(wb, ws, "Doctor Import");
                      XLSX.writeFile(wb, "doctor_bulk_import_template.xlsx");
                    }}>
                      <Download size={12} /> Download Excel Template
                    </button>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:22, height:22, background:"linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"white", fontWeight:900, fontSize:11 }}>2</span>
                    </div>
                    <span style={{ fontWeight:700, fontSize:12, color:"#0d9488" }}>Upload Filled Spreadsheet</span>
                  </div>

                  {!bulkFile ? (
                    <div className={`d-bulk-drop ${bulkDragOver ? "drag" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setBulkDragOver(true); }}
                      onDragLeave={() => setBulkDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setBulkDragOver(false); handleExcelFile(e.dataTransfer.files[0]); }}>
                      <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleExcelFile(e.target.files[0])} />
                      <div className="d-bulk-drop-icon"><FileSpreadsheet size={22} color="white" /></div>
                      <h3>Drop your Excel file here</h3>
                      <p>or click to browse · .xlsx · .xls · .csv</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdfa", border:"1px solid #b2f5ea", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                        <FileSpreadsheet size={15} color="#0d9488" />
                        <span style={{ fontWeight:700, fontSize:12, color:"#0f172a", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{bulkFile.name}</span>
                        <button onClick={resetBulk} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", display:"flex", padding:0 }}><X size={13} /></button>
                      </div>

                      {bulkRows.length > 0 && (
                        <div className="d-bulk-stats">
                          <div className="d-stat-chip" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}><Table2 size={11} /> {bulkRows.length} rows</div>
                          <div className="d-stat-chip" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}><CheckCircle2 size={11} /> {validRows.length} valid</div>
                          {invalidRows.length > 0 && <div className="d-stat-chip" style={{ background:"#fff5f5", color:"#ef4444", border:"1px solid #fecaca" }}><AlertCircle size={11} /> {invalidRows.length} invalid</div>}
                        </div>
                      )}

                      {bulkRows.length > 0 && (
                        <>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:".5px", textTransform:"uppercase", color:"#0d9488", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
                            <Eye size={11} /> Preview — click a row to inspect
                          </div>
                          <div className="d-table-wrap">
                            <table className="d-table">
                              <thead><tr><th>#</th><th>Status</th><th>Name</th><th>Specialty</th><th>Position</th><th>Image URL</th></tr></thead>
                              <tbody>
                                {bulkRows.map((row, i) => (
                                  <tr key={i} className={row.valid ? "" : "err-row"} style={{ cursor:"pointer" }} onClick={() => setPreviewRow(row)}>
                                    <td style={{ color:"#94a3b8", fontSize:10 }}>{i+1}</td>
                                    <td>{row.valid ? <span className="d-bdg ok"><CheckCircle2 size={8} /> Valid</span> : <span className="d-bdg err"><X size={8} /> Error</span>}</td>
                                    <td style={{ fontWeight:600, color:"#0f172a" }}>{row.name || "—"}</td>
                                    <td><span className="d-bdg ok">{row.specialty || "—"}</span></td>
                                    <td style={{ color:"#64748b", fontSize:10 }}>{row.imagePosition}</td>
                                    <td>{row.imageUrl ? <span className="d-url">{row.imageUrl}</span> : <span style={{ color:"#fca5a5", fontSize:10 }}>missing</span>}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {invalidRows.length > 0 && (
                            <div style={{ marginTop:10, background:"#fff5f5", border:"1px solid #fecaca", borderRadius:9, padding:"10px 12px" }}>
                              <div style={{ fontWeight:700, fontSize:11, color:"#ef4444", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={12} /> Validation Issues</div>
                              {invalidRows.map((row, i) => <div key={i} style={{ fontSize:10, color:"#ef4444", marginBottom:4 }}><b>"{row.name||"untitled"}":</b> {row.errors.join("; ")}</div>)}
                            </div>
                          )}
                        </>
                      )}

                      {bulkErrors.filter(() => !bulkDone).map((err, i) => <div key={i} className="d-err" style={{ marginTop:8 }}><AlertCircle size={12} /> {err}</div>)}

                      {bulkImporting && (
                        <div style={{ marginTop:10 }}>
                          <div style={{ fontSize:11, color:"#0d9488", fontWeight:600, marginBottom:4 }}>Importing {bulkProgress.done} / {bulkProgress.total}...</div>
                          <div className="d-progress-bar"><div className="d-progress-fill" style={{ width:`${(bulkProgress.done/bulkProgress.total)*100}%` }} /></div>
                        </div>
                      )}

                      {bulkDone && <div className="d-ok" style={{ marginTop:10 }}><CheckCircle2 size={13} /><span>Imported {validRows.length - bulkErrors.length} of {validRows.length} doctors!{bulkErrors.length > 0 && ` (${bulkErrors.length} failed)`}</span></div>}

                      {!bulkDone && validRows.length > 0 && (
                        <button className="d-submit" style={{ marginTop:14 }} disabled={bulkImporting} onClick={handleBulkImport}>
                          {bulkImporting ? <><Loader2 size={15} style={{ animation:"d-spin 1s linear infinite" }} /> Importing {bulkProgress.done}/{bulkProgress.total}...</> : <><Upload size={15} /> Import {validRows.length} Doctor{validRows.length!==1?"s":""} <ChevronRight size={13} /></>}
                        </button>
                      )}

                      {bulkDone && <button className="d-submit" style={{ marginTop:10 }} onClick={resetBulk}><RefreshCw size={14} /> Import Another File</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT CARD: DOCTORS LIST ══ */}
          <div className="d-card">
            <div className="d-list-hdr">
              <div>
                <h3>All Doctors</h3>
                <p>{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} in database</p>
              </div>
              <button className="d-refresh-btn" onClick={fetchDoctors}><RefreshCw size={11} /> Refresh</button>
            </div>

            <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 200px)" }}>
              {listLoading ? (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 0" }}>
                  <Loader2 style={{ width:24, height:24, color:"#14b8a6", animation:"d-spin 1s linear infinite" }} />
                </div>
              ) : doctors.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#94a3b8", fontSize:12 }}>No doctors yet.</div>
              ) : (
                doctors.map((doc) => {
                  const id = doc._id || doc.id;
                  return (
                    <div key={id} className="d-row">
                      {/* Avatar — 2-step fallback: primary src → API endpoint → icon */}
                      <div className="d-avatar">
                        <AdminAvatar
                          src={getPhotoSrc(doc)}
                          name={doc.name}
                          imagePos={doc.imagePosition || "center 20%"}
                          apiSrc={`${API_DOCTORS}/${id}/image`}
                        />
                      </div>

                      <div className="d-info">
                        <div className="d-name">{doc.name}</div>
                        <div className="d-spec">{doc.specialty}</div>
                        <div className="d-ttl">{doc.title}</div>
                      </div>

                      <span className="d-pill" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}>
                        {doc.specialty?.split(" ")[0] || "Doctor"}
                      </span>

                      <button className="d-icon-btn teal" title="Edit" onClick={() => openEdit(doc)}><Pencil size={12} /></button>
                      <button className="d-icon-btn red" title="Delete" disabled={deletingId === id} onClick={() => handleDelete(id)}>
                        {deletingId === id ? <Loader2 size={12} style={{ animation:"d-spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
        <Footer />
      </div>

      {/* ROW PREVIEW MODAL */}
      {previewRow && (
        <div className="d-backdrop" onClick={() => setPreviewRow(null)}>
          <div className="d-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="d-modal-hdr">
              <div><p>Row Preview</p><h2>{previewRow.name || "Untitled"}</h2></div>
              <button className="d-modal-close" onClick={() => setPreviewRow(null)}><X size={13} /></button>
            </div>
            <div className="d-modal-body">
              {previewRow.imageUrl && (
                <img src={previewRow.imageUrl} alt={previewRow.name}
                  style={{ width:"100%", height:130, objectFit:"cover", objectPosition:previewRow.imagePosition, borderRadius:10, marginBottom:10, display:"block" }}
                  onError={e => { e.target.style.display="none"; }} />
              )}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                <span className="d-bdg ok">{previewRow.specialty}</span>
                <span className="d-bdg ok" style={{ background:"#f0f9ff", color:"#0369a1", borderColor:"#bae6fd" }}>{previewRow.imagePosition}</span>
                {previewRow.valid ? <span className="d-bdg ok"><CheckCircle2 size={8} /> Valid</span> : <span className="d-bdg err"><X size={8} /> Has errors</span>}
              </div>
              <p style={{ fontSize:12, color:"#334155", fontWeight:600, margin:"0 0 2px" }}>{previewRow.title}</p>
              <p style={{ fontSize:11, color:"#64748b", lineHeight:1.6, margin:"0 0 10px" }}>{previewRow.description}</p>
              {previewRow.errors.length > 0 && (
                <div style={{ background:"#fff5f5", border:"1px solid #fecaca", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                  {previewRow.errors.map((err,i) => <div key={i} style={{ fontSize:11, color:"#ef4444", display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={10} /> {err}</div>)}
                </div>
              )}
              <div style={{ background:"#f0fdfa", border:"1px solid #b2f5ea", borderRadius:9, padding:"8px 12px", marginBottom:6 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#0d9488", marginBottom:3 }}>IMAGE URL</div>
                <span style={{ fontSize:10, color:"#14b8a6", wordBreak:"break-all" }}>{previewRow.imageUrl || "—"}</span>
              </div>
              <button className="d-cancel-btn" style={{ marginTop:8, width:"100%" }} onClick={() => setPreviewRow(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editDoctor && (
        <div className="d-backdrop" onClick={closeEdit}>
          <div className="d-modal" onClick={e => e.stopPropagation()}>
            <div className="d-modal-hdr">
              <div><p>Editing Doctor</p><h2>{editDoctor.name}</h2></div>
              <button className="d-modal-close" onClick={closeEdit}><X size={13} /></button>
            </div>
            <div className="d-modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="d-row2">
                  <div className="d-field">
                    <label className="d-lbl">Full Name</label>
                    <div className="d-inp-wrap"><div className="d-inp-icon"><User size={13} /></div>
                      <input type="text" className="d-inp" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name:e.target.value })} />
                    </div>
                  </div>
                  <div className="d-field">
                    <label className="d-lbl">Specialty</label>
                    <div className="d-inp-wrap"><div className="d-inp-icon"><Stethoscope size={13} /></div>
                      <input type="text" className="d-inp" required value={editForm.specialty} onChange={e => setEditForm({ ...editForm, specialty:e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="d-field">
                  <label className="d-lbl">Qualification / Title</label>
                  <div className="d-inp-wrap"><div className="d-inp-icon"><Building2 size={13} /></div>
                    <input type="text" className="d-inp" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title:e.target.value })} />
                  </div>
                </div>
                <div className="d-field">
                  <label className="d-lbl">Description</label>
                  <div className="d-inp-wrap"><div className="d-inp-icon top"><AlignLeft size={13} /></div>
                    <textarea className="d-inp ta" style={{ minHeight:72 }} value={editForm.description} onChange={e => setEditForm({ ...editForm, description:e.target.value })} />
                  </div>
                </div>
                <div className="d-field">
                  <label className="d-lbl">Replace Photo <span style={{ color:"#94a3b8", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  {editImagePreview ? (
                    <div className="d-img-prev">
                      <img src={editImagePreview} alt="preview" style={{ objectPosition: editForm.imagePosition }} />
                      <div className="d-img-overlay">
                        <div className="d-prev-badge"><CheckCircle2 size={9} /> New photo</div>
                        <button type="button" className="d-remove-btn" onClick={() => { setEditImageFile(null); setEditImagePreview(null); }}><X size={9} /> Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-upload" style={{ padding:"10px 12px" }}>
                      <input type="file" accept="image/*" onChange={e => handleEditImage(e.target.files[0])} />
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:"#0d9488", fontSize:12, fontWeight:600 }}><ImagePlus size={14} /> Click to upload new photo</div>
                      <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>Leave empty to keep existing</p>
                    </div>
                  )}
                </div>
                <div className="d-field">
                  <label className="d-lbl">Face Position</label>
                  <div className="d-pos-row">
                    {IMAGE_POSITIONS.map(p => (
                      <button key={p.value} type="button"
                        className={`d-pos-pill ${editForm.imagePosition === p.value ? "sel" : ""}`}
                        onClick={() => setEditForm({ ...editForm, imagePosition: p.value })}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                {editError   && <div className="d-err"><X size={12} /> {editError}</div>}
                {editSuccess && <div className="d-ok"><CheckCircle2 size={12} /> Updated successfully!</div>}
                <div style={{ display:"flex", gap:10 }}>
                  <button type="button" className="d-cancel-btn" onClick={closeEdit}>Cancel</button>
                  <button type="submit" className="d-submit" disabled={editLoading} style={{ flex:2, marginTop:0, padding:"9px" }}>
                    {editLoading ? <><Loader2 size={13} style={{ animation:"d-spin 1s linear infinite" }} /> Saving...</> : <><Save size={13} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {success && <div className="d-toast"><CheckCircle2 size={16} /> Doctor added successfully!</div>}
    </>
  );
}

// ── AdminAvatar: tries primary src first, then API /image endpoint, then icon ──
function AdminAvatar({ src, name, imagePos, apiSrc }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed,     setFailed]     = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    console.warn(`[AdminAvatar] Failed to load: ${currentSrc}`);
    if (currentSrc !== apiSrc && apiSrc) {
      // Try the /image API endpoint as fallback
      setCurrentSrc(apiSrc);
    } else {
      setFailed(true);
    }
  };

  if (failed || !currentSrc) {
    return <User size={18} color="#0d9488" />;
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition: imagePos, display:"block" }}
      onError={handleError}
    />
  );
}