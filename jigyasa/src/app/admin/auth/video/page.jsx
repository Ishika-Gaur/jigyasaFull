"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import * as XLSX from "xlsx";
import Link from "next/link";
import {
  Video, Image as ImageIcon, Type, AlignLeft, Clock, Upload,
  CheckCircle2, Loader2, Sparkles, ChevronRight, X, Play,
  Hospital, Eye, Trash2, Pencil, RefreshCw, Save, Film, ArrowLeft,
  FileSpreadsheet, Download, AlertCircle, Table2, Stethoscope, Users, Cpu,
} from "lucide-react";

const API       = "http://localhost:4000/api/auth";
const VIDEO_API = "http://localhost:4000/api/videos";

const CATEGORIES = [
  { value: "hospital",    label: "Hospital",     icon: Hospital,    color: "#14b8a6", bg: "rgba(20,184,166,0.08)" },
  { value: "equipment",   label: "Equipment",    icon: Cpu,         color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { value: "doctors",     label: "Doctors",      icon: Stethoscope, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  { value: "patients",    label: "Patients",     icon: Users,       color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
  { value: "all",         label: "All / General",icon: Video,       color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
];

const VALID_CATEGORIES = ["hospital", "equipment", "doctors", "patients", "all", "doctor", "patientcare"];

const fmtSize = (b) => !b ? "" : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;

// ── Resolve thumbnail src for display ──
// item.thumbnail can be: a full URL, a local filename, or undefined
// If backend serves it at /api/videos/:id/thumbnail → use that
// As fallback, try item.thumbnail directly if it's a URL
const getThumbSrc = (item) => {
  const id = item._id || item.id;
  if (id) return `${VIDEO_API}/${id}/thumbnail`;
  if (item.thumbnail && item.thumbnail.startsWith("http")) return item.thumbnail;
  if (item.thumbnail) return `/${item.thumbnail}`;
  return null;
};

function findHeaderRowIndex(ws) {
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z100");
  for (let r = range.s.r; r <= Math.min(range.e.r, 10); r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      if (cell && String(cell.v ?? "").toLowerCase().trim() === "title") return r;
    }
  }
  return 0;
}

function parseWorksheet(ws) {
  const headerRowIdx = findHeaderRowIndex(ws);
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z1000");
  const headers = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: headerRowIdx, c });
    const cell = ws[addr];
    headers.push(cell ? String(cell.v ?? "").trim() : `col_${c}`);
  }
  let dataStartRow = headerRowIdx + 1;
  const titleColIdx = headers.findIndex((h) => h.toLowerCase() === "title");
  if (titleColIdx >= 0) {
    const hintAddr = XLSX.utils.encode_cell({ r: dataStartRow, c: titleColIdx });
    const hintCell = ws[hintAddr];
    const hintVal  = hintCell ? String(hintCell.v ?? "").toLowerCase() : "";
    if (hintVal.startsWith("e.g.") || hintVal.startsWith("short") || hintVal.includes("max") || hintVal.includes("cloudinary")) {
      dataStartRow++;
    }
  }
  const rows = [];
  for (let r = dataStartRow; r <= range.e.r; r++) {
    const rowObj = {};
    let hasAnyValue = false;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      const val  = cell ? String(cell.v ?? "").trim() : "";
      rowObj[headers[c] || `col_${c}`] = val;
      if (val) hasAnyValue = true;
    }
    if (hasAnyValue) rows.push(rowObj);
  }
  return rows;
}

function isValidMedia(val) {
  if (!val) return false;
  const lower = val.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return true;
  if (/\.(mp4|mov|avi|webm|mkv|mp3|png|jpg|jpeg|webp|gif)$/i.test(lower)) return true;
  return false;
}

function parseVideoRow(row) {
  const normalize = (s) => s.toLowerCase().replace(/[\s_]+/g, "");
  const get = (key) => {
    const normKey = normalize(key);
    const match = Object.keys(row).find((k) => normalize(k) === normKey);
    return match ? String(row[match] ?? "").trim() : "";
  };

  const title       = get("title");
  const category    = get("category").toLowerCase().trim();
  const description = get("description");
  const duration    = get("duration");
  const thumbnail   = get("thumbnail") || get("thumbnailurl") || get("thumbnailimage") || "";
  const videoUrl    = get("videourl") || get("video") || get("videolink") || get("videofile") || "";

  const lowerTitle = title.toLowerCase();
  if (lowerTitle.startsWith("e.g.") || lowerTitle === "title" || title === "") return null;

  const errors = [];
  if (!title)                               errors.push("Title is required");
  if (!VALID_CATEGORIES.includes(category)) errors.push(`Invalid category: "${category}"`);
  if (!description)                         errors.push("Description is required");
  if (!isValidMedia(thumbnail))             errors.push("Thumbnail required (URL or filename.png)");
  if (!isValidMedia(videoUrl))              errors.push("Video required (URL or filename.mp4)");

  return { title, category, description, duration, thumbnail, videoUrl, errors, valid: errors.length === 0 };
}

export default function AddVideo() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manual");

  // Manual form
  const [form,             setForm]             = useState({ title:"", description:"", category:"hospital", duration:"" });
  const [thumbnail,        setThumbnail]        = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile,        setVideoFile]        = useState(null);
  const [videoName,        setVideoName]        = useState("");
  const [loading,          setLoading]          = useState(false);
  const [success,          setSuccess]          = useState(false);
  const [dragThumb,        setDragThumb]        = useState(false);
  const [dragVideo,        setDragVideo]        = useState(false);

  // Bulk
  const [bulkFile,      setBulkFile]      = useState(null);
  const [bulkRows,      setBulkRows]      = useState([]);
  const [bulkDragOver,  setBulkDragOver]  = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkProgress,  setBulkProgress]  = useState({ done: 0, total: 0 });
  const [bulkErrors,    setBulkErrors]    = useState([]);
  const [bulkDone,      setBulkDone]      = useState(false);
  const [previewRow,    setPreviewRow]    = useState(null);

  // List
  const [videos,      setVideos]      = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deletingId,  setDeletingId]  = useState(null);

  // Edit
  const [editItem,         setEditItem]         = useState(null);
  const [editForm,         setEditForm]         = useState({ title:"", description:"", category:"hospital", duration:"" });
  const [editThumbFile,    setEditThumbFile]    = useState(null);
  const [editThumbPreview, setEditThumbPreview] = useState(null);
  const [editLoading,      setEditLoading]      = useState(false);
  const [editError,        setEditError]        = useState("");
  const [editSuccess,      setEditSuccess]      = useState(false);

  // Thumbnail error fallback tracking
  const [thumbErrors, setThumbErrors] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try   { await axios.get(`${API}/me`, { withCredentials: true }); }
      catch  { router.push("/admin"); }
      finally{ setChecking(false); }
    };
    checkAuth();
  }, []);

  const fetchVideos = async () => {
    setListLoading(true);
    setThumbErrors({});
    try { const r = await axios.get(VIDEO_API, { withCredentials:true }); setVideos(r.data); }
    catch{}
    finally{ setListLoading(false); }
  };

  useEffect(() => { if (!checking) fetchVideos(); }, [checking]);

  const toB64 = (file) => new Promise((res,rej) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => res(r.result);
    r.onerror = rej;
  });

  const handleThumbnail = (file) => {
    if (file?.type.startsWith("image/")) { setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)); }
  };
  const handleVideo = (file) => {
    if (file?.type.startsWith("video/")) { setVideoFile(file); setVideoName(file.name); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(VIDEO_API, {
        ...form,
        thumbnail: await toB64(thumbnail),
        video: await toB64(videoFile)
      }, { withCredentials:true });
      setSuccess(true);
      setForm({ title:"", description:"", category:"hospital", duration:"" });
      setThumbnail(null); setThumbnailPreview(null); setVideoFile(null); setVideoName("");
      setTimeout(() => setSuccess(false), 4000);
      fetchVideos();
    } catch(err) { alert(`Upload failed: ${err?.response?.data?.message || err.message}`); }
    setLoading(false);
  };

  const handleExcelFile = (file) => {
    if (!file) return;
    setBulkFile(file); setBulkRows([]); setBulkErrors([]); setBulkDone(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("video")) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rawRows = parseWorksheet(ws);
        if (!rawRows.length) { setBulkErrors(["No data rows found."]); return; }
        const parsed = rawRows.map((row) => parseVideoRow(row)).filter(Boolean);
        if (!parsed.length) { setBulkErrors(["All rows were skipped. Please fill in your real data."]); return; }
        setBulkRows(parsed);
      } catch (err) { setBulkErrors([`Failed to parse file: ${err.message}`]); }
    };
    reader.readAsArrayBuffer(file);
  };

  const validRows   = bulkRows.filter((r) => r.valid);
  const invalidRows = bulkRows.filter((r) => !r.valid);

  const resolveMedia = async (nameOrUrl) => {
    if (!nameOrUrl) return null;
    if (nameOrUrl.toLowerCase().startsWith("http")) return { value: nameOrUrl, isUrl: true };
    try {
      const res = await fetch(`/${nameOrUrl}`);
      if (!res.ok) throw new Error(`File not found: ${nameOrUrl}`);
      const blob = await res.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return { value: base64, isUrl: false };
    } catch (err) {
      throw new Error(`Could not load "${nameOrUrl}": ${err.message}`);
    }
  };

  const handleBulkImport = async () => {
    if (!validRows.length) return;
    setBulkImporting(true);
    setBulkProgress({ done: 0, total: validRows.length });
    const errs = [];
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        const thumbResolved = await resolveMedia(row.thumbnail);
        const videoResolved = await resolveMedia(row.videoUrl);
        const allAreUrls = thumbResolved.isUrl && videoResolved.isUrl;
        await axios.post(VIDEO_API, {
          title:       row.title,
          category:    row.category,
          description: row.description,
          duration:    row.duration,
          thumbnail:   thumbResolved.value,
          video:       videoResolved.value,
          useUrls:     allAreUrls,
        }, { withCredentials: true });
      } catch (err) {
        errs.push(`Row ${i + 1} ("${row.title}"): ${err?.response?.data?.message || err.message}`);
      }
      setBulkProgress({ done: i + 1, total: validRows.length });
    }
    setBulkErrors(errs);
    setBulkImporting(false);
    setBulkDone(true);
    fetchVideos();
  };

  const resetBulk = () => { setBulkFile(null); setBulkRows([]); setBulkErrors([]); setBulkDone(false); setBulkImporting(false); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    setDeletingId(id);
    try { await axios.delete(`${VIDEO_API}/${id}`, { withCredentials:true }); setVideos(p => p.filter(v => (v._id||v.id) !== id)); }
    catch{ alert("Failed to delete video."); }
    finally{ setDeletingId(null); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({ title:item.title||"", description:item.description||"", category:item.category||"hospital", duration:item.duration||"" });
    setEditThumbFile(null); setEditThumbPreview(null); setEditError(""); setEditSuccess(false);
  };
  const closeEdit = () => { setEditItem(null); setEditThumbFile(null); setEditThumbPreview(null); setEditError(""); setEditSuccess(false); };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditLoading(true); setEditError("");
    try {
      const payload = { ...editForm };
      if (editThumbFile) payload.thumbnail = await toB64(editThumbFile);
      const id = editItem._id || editItem.id;
      await axios.patch(`${VIDEO_API}/${id}`, payload, { withCredentials:true });
      setVideos(p => p.map(v => (v._id||v.id) === id ? { ...v, ...editForm } : v));
      setEditSuccess(true);
      setTimeout(() => { setEditSuccess(false); closeEdit(); }, 1800);
    } catch(err) { setEditError(err?.response?.data?.message || "Update failed."); }
    finally{ setEditLoading(false); }
  };

  // Cat color lookup (handles aliases too)
  const getCatInfo = (catVal) => {
    return CATEGORIES.find(c => c.value === catVal)
      || CATEGORIES.find(c => c.value === "all")
      || CATEGORIES[0];
  };

  const CatPill = ({ value, form, setForm }) => {
    const cat = CATEGORIES.find(c => c.value === value);
    if (!cat) return null;
    const sel = form.category === value;
    const CatIcon = cat.icon;
    return (
      <div className={`v-cat-pill ${sel ? "sel" : ""}`}
        style={{ borderColor: sel ? cat.color : undefined, background: sel ? cat.bg : undefined, color: sel ? cat.color : undefined }}
        onClick={() => setForm({ ...form, category: value })}>
        <CatIcon size={13} />{cat.label}{sel && <CheckCircle2 size={11} />}
      </div>
    );
  };

  if (checking) return (
    <div style={{ minHeight:"100vh", background:"#f0fdfa", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Loader2 style={{ width:28, height:28, color:"#14b8a6", animation:"v-spin 1s linear infinite" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes v-spin  { to { transform: rotate(360deg); } }
        @keyframes v-modal { from { opacity:0; transform: scale(.96) translateY(12px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes v-toast { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes v-prev  { from { opacity:0; transform: scale(.9); } to { opacity:1; transform: scale(1); } }
        @keyframes v-fade  { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

        .v-root *, .v-root *::before, .v-root *::after { box-sizing: border-box; }
        .v-root { min-height:100vh; background:#f0fdfa; font-family:'Satoshi',system-ui,sans-serif; }

        .v-topbar { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-bottom:1px solid rgba(20,184,166,.12); padding:10px 20px; }
        .v-topbar a { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#64748b; text-decoration:none; }
        .v-topbar a:hover { color:#0d9488; }
        .v-topbar-cur { font-size:12px; font-weight:600; color:#0d9488; }

        .v-layout { display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:1100px; margin:0 auto; padding:14px 14px 20px; align-items:start; }
        @media (max-width:820px) { .v-layout { grid-template-columns:1fr; } }

        .v-card { background:white; border-radius:16px; border:1px solid rgba(20,184,166,.12); box-shadow:0 4px 20px rgba(13,148,136,.1); overflow:hidden; display:flex; flex-direction:column; }
        .v-card-hdr { background:linear-gradient(135deg,#064e3b 0%,#0f766e 50%,#14b8a6 100%); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
        .v-card-hdr h2 { font-size:14px; font-weight:700; color:white; margin:0; }
        .v-card-hdr p  { font-size:11px; color:rgba(255,255,255,.6); margin:2px 0 0; }
        .v-body { padding:14px 16px 16px; flex:1; overflow-y:auto; }

        .v-tabs { display:flex; border-bottom:2px solid rgba(20,184,166,.1); margin-bottom:14px; }
        .v-tab { flex:1; padding:9px 10px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:none; display:flex; align-items:center; justify-content:center; gap:6px; color:#94a3b8; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; font-family:inherit; }
        .v-tab.active { color:#0d9488; border-bottom-color:#14b8a6; background:linear-gradient(180deg,transparent,rgba(20,184,166,.04)); }
        .v-tab:hover:not(.active) { color:#0d9488; background:rgba(20,184,166,.04); }

        .v-row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width:480px) { .v-row2 { grid-template-columns:1fr; } }
        .v-field { margin-bottom:10px; }
        .v-lbl { display:block; font-size:10px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:#0d9488; margin-bottom:4px; }
        .v-inp-wrap { position:relative; }
        .v-inp-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex; align-items:center; }
        .v-inp-icon.top { top:10px; transform:none; }
        .v-inp-wrap:focus-within .v-inp-icon { color:#14b8a6; }
        .v-inp { width:100%; padding:8px 10px 8px 32px; border:1.5px solid #e2f4f2; border-radius:9px; font-size:13px; color:#0f172a; background:#fafffe; outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
        .v-inp:focus { border-color:#14b8a6; box-shadow:0 0 0 3px rgba(20,184,166,.1); background:white; }
        .v-inp::placeholder { color:#b0cec9; }
        .v-inp.ta { min-height:72px; resize:vertical; line-height:1.5; padding-top:9px; }

        .v-cat-row { display:flex; gap:7px; flex-wrap:wrap; }
        .v-cat-pill { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; border:1.5px solid #e2f4f2; background:#fafffe; cursor:pointer; font-size:12px; font-weight:600; color:#64748b; transition:all .2s; white-space:nowrap; }
        .v-cat-pill.sel { box-shadow:0 2px 8px rgba(20,184,166,.2); }
        .v-cat-pill:hover { transform:translateY(-1px); }

        .v-upload { border:1.5px dashed rgba(20,184,166,.35); border-radius:10px; padding:12px 10px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
        .v-upload:hover,.v-upload.drag { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
        .v-upload input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; z-index:2; width:100%; height:100%; }
        .v-upload-t { font-size:12px; font-weight:600; color:#0d9488; }
        .v-upload-s { font-size:10px; color:#94a3b8; margin-top:2px; }

        .v-feat-prev { position:relative; border-radius:10px; overflow:hidden; animation:v-prev .3s ease both; }
        .v-feat-prev img { width:100%; height:90px; object-fit:cover; display:block; }
        .v-feat-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.45),transparent); display:flex; align-items:flex-end; justify-content:space-between; padding:6px 8px; }
        .v-prev-badge { font-size:10px; font-weight:600; color:white; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); padding:2px 8px; border-radius:100px; display:flex; align-items:center; gap:4px; }
        .v-remove-btn { font-size:10px; font-weight:600; color:white; background:rgba(239,68,68,.85); padding:3px 8px; border-radius:100px; border:none; cursor:pointer; display:flex; align-items:center; gap:3px; }

        .v-pill { display:flex; align-items:center; gap:8px; background:linear-gradient(135deg,#f0fdfa,#ccfbf1); border:1px solid rgba(20,184,166,.2); border-radius:9px; padding:8px 12px; margin-top:7px; }
        .v-pill-ico { width:30px; height:30px; background:linear-gradient(135deg,#0d9488,#14b8a6); border-radius:8px; display:flex; align-items:center; justify-content:center; color:white; flex-shrink:0; }
        .v-pill-name { font-size:12px; font-weight:600; color:#0f172a; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .v-pill-size { font-size:10px; color:#64748b; }
        .v-pill-rm { background:none; border:none; cursor:pointer; color:#94a3b8; padding:3px; border-radius:5px; display:flex; align-items:center; transition:all .2s; }
        .v-pill-rm:hover { background:#fee2e2; color:#ef4444; }

        .v-divider { height:1px; background:linear-gradient(90deg,transparent,#e2f4f2,transparent); margin:10px 0; }
        .v-sec-lbl { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#0d9488; margin-bottom:6px; display:flex; align-items:center; gap:5px; }

        .v-submit { width:100%; padding:11px; background:linear-gradient(135deg,#064e3b 0%,#0f766e 40%,#14b8a6 100%); color:white; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; box-shadow:0 4px 16px rgba(20,184,166,.35); margin-top:12px; font-family:inherit; }
        .v-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(20,184,166,.45); }
        .v-submit:disabled { opacity:.7; cursor:not-allowed; }

        .v-bulk-drop { border:2px dashed rgba(20,184,166,.35); border-radius:14px; padding:28px 20px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; }
        .v-bulk-drop.drag,.v-bulk-drop:hover { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
        .v-bulk-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; z-index:2; }
        .v-bulk-drop-icon { width:44px; height:44px; background:linear-gradient(135deg,#064e3b,#14b8a6); border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
        .v-bulk-drop h3 { font-size:14px; font-weight:700; color:#0d9488; margin:0 0 4px; }
        .v-bulk-drop p { font-size:11px; color:#64748b; margin:0; }

        .v-dl-btn { display:inline-flex; align-items:center; gap:6px; background:white; border:1.5px solid #b2f5ea; color:#0d9488; font-size:11px; font-weight:700; padding:7px 14px; border-radius:8px; cursor:pointer; margin-top:12px; text-decoration:none; transition:all .2s; font-family:inherit; }
        .v-dl-btn:hover { background:#f0fdfa; border-color:#14b8a6; transform:translateY(-1px); }

        .v-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid rgba(20,184,166,.15); margin-top:12px; animation:v-fade .3s ease both; }
        .v-table { width:100%; border-collapse:collapse; font-size:11px; }
        .v-table th { background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap; font-size:10px; letter-spacing:.5px; }
        .v-table td { padding:7px 10px; border-bottom:1px solid #f0fdfa; vertical-align:middle; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .v-table tr:last-child td { border-bottom:none; }
        .v-table tr:nth-child(even) td { background:#f8fffd; }
        .v-table tr:hover td { background:#e6fef9; }
        .v-table .err-row td { background:#fff5f5 !important; }

        .v-badge { display:inline-flex; align-items:center; gap:3px; font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; white-space:nowrap; }
        .v-badge.ok  { background:#f0fdfa; color:#0d9488; border:1px solid #b2f5ea; }
        .v-badge.err { background:#fff5f5; color:#ef4444; border:1px solid #fecaca; }

        .v-url-cell { font-size:9px; color:#14b8a6; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px; }

        .v-bulk-stats { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0; }
        .v-stat-chip { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; font-size:11px; font-weight:700; }

        .v-progress-bar { height:6px; background:#e2f4f2; border-radius:100px; overflow:hidden; margin:10px 0; }
        .v-progress-fill { height:100%; background:linear-gradient(90deg,#064e3b,#14b8a6); border-radius:100px; transition:width .3s ease; }

        /* ── Video list ── */
        .v-list-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(20,184,166,.1); background:linear-gradient(to right,#f0fdfa,white); }
        .v-list-hdr h3 { font-size:13px; font-weight:700; color:#0f172a; margin:0; }
        .v-list-hdr p  { font-size:11px; color:#64748b; margin:2px 0 0; }

        .v-row { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #f5fffe; transition:background .15s; }
        .v-row:last-child { border-bottom:none; }
        .v-row:hover { background:#f0fdfa; }

        /* ── FIXED: Thumbnail container ── */
        .v-thumb {
          width:64px; height:46px; border-radius:8px; flex-shrink:0;
          background:linear-gradient(135deg,#e8f5f3,#ccfbf1);
          overflow:hidden; display:flex; align-items:center; justify-content:center;
          border:1px solid rgba(20,184,166,.15); position:relative;
        }
        .v-thumb img {
          width:100%; height:100%; object-fit:cover; display:block;
          transition:opacity .2s;
        }
        .v-thumb img.loading { opacity:0; }
        .v-thumb img.loaded  { opacity:1; }
        .v-thumb-placeholder {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:3px; width:100%; height:100%;
        }
        .v-thumb-placeholder span { font-size:8px; color:#14b8a6; font-weight:600; }

        .v-info { flex:1; min-width:0; }
        .v-title { font-size:13px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .v-cat   { font-size:10px; font-weight:600; color:#14b8a6; text-transform:capitalize; }
        .v-desc  { font-size:10px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .v-list-badge { flex-shrink:0; font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; white-space:nowrap; }

        .v-icon-btn { flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:1.5px solid; cursor:pointer; transition:all .18s; background:none; }
        .v-icon-btn:disabled { opacity:.5; cursor:not-allowed; pointer-events:none; }
        .v-icon-btn.teal { border-color:#b2f5ea; background:#f0fdfa; color:#0d9488; }
        .v-icon-btn.teal:hover { background:#0d9488; color:white; border-color:#0d9488; }
        .v-icon-btn.red  { border-color:#fecaca; background:#fff5f5; color:#ef4444; }
        .v-icon-btn.red:hover  { background:#ef4444; color:white; border-color:#ef4444; }
        .v-refresh-btn { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:#0d9488; background:#f0fdfa; border:1px solid #b2f5ea; padding:5px 10px; border-radius:8px; cursor:pointer; transition:background .2s; }
        .v-refresh-btn:hover { background:#ccfbf1; }

        /* Modals */
        .v-backdrop { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:12px; background:rgba(0,0,0,.5); backdrop-filter:blur(6px); }
        .v-modal { background:white; border-radius:18px; width:100%; max-width:520px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.22); animation:v-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
        .v-modal-hdr { padding:14px 18px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:5; background:linear-gradient(135deg,#064e3b,#0f766e,#14b8a6); }
        .v-modal-hdr p  { color:rgba(255,255,255,.6); font-size:10px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; margin:0 0 2px; }
        .v-modal-hdr h2 { font-size:15px; font-weight:700; color:white; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:380px; }
        .v-modal-close { width:28px; height:28px; border-radius:50%; border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.15); flex-shrink:0; }
        .v-modal-close:hover { background:rgba(255,255,255,.28); }
        .v-modal-body { padding:14px 18px 18px; }
        .v-preview-modal { background:white; border-radius:18px; width:100%; max-width:440px; max-height:85vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:v-modal .3s cubic-bezier(.34,1.56,.64,1) both; }

        .v-err { display:flex; align-items:center; gap:7px; background:#fff5f5; border:1px solid #fecaca; color:#ef4444; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
        .v-ok  { display:flex; align-items:center; gap:7px; background:#f0fdfa; border:1px solid #b2f5ea; color:#0d9488; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
        .v-cancel-btn { flex:1; border:1.5px solid #e2e8f0; background:#f8fafc; color:#64748b; font-weight:600; font-size:13px; padding:9px; border-radius:9px; cursor:pointer; transition:background .2s; font-family:inherit; }
        .v-cancel-btn:hover { background:#f1f5f9; }
        .v-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:10px 22px; border-radius:100px; font-size:13px; font-weight:600; box-shadow:0 8px 30px rgba(13,148,136,.45); z-index:99999; display:flex; align-items:center; gap:7px; white-space:nowrap; animation:v-toast .4s ease both; pointer-events:none; }

        @media (max-width:480px) { .v-layout { padding:10px 10px 14px; gap:10px; } .v-body { padding:10px 12px 12px; } }
      `}</style>

      <div className="v-root">
        <div className="v-topbar">
          <Link href="/admin/auth/dashboard"><ArrowLeft size={13} /> Dashboard</Link>
          <ChevronRight size={11} style={{ color:"#cbd5e1" }} />
          <span className="v-topbar-cur">Videos</span>
        </div>

        <div className="v-layout">

          {/* ══ LEFT CARD ══ */}
          <div className="v-card">
            <div className="v-card-hdr">
              <div>
                <h2>{activeTab === "manual" ? "Upload Video" : "Bulk Import via Excel"}</h2>
                <p>{activeTab === "manual" ? "Add a new video to the library" : "Import multiple videos at once"}</p>
              </div>
              <span style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", display:"inline-block" }} />
            </div>

            <div className="v-body">
              <div className="v-tabs">
                <button className={`v-tab ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
                  <Video size={13} /> Manual Upload
                </button>
                <button className={`v-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
                  <FileSpreadsheet size={13} /> Bulk Import
                </button>
              </div>

              {/* MANUAL FORM */}
              {activeTab === "manual" && (
                <form onSubmit={handleSubmit}>
                  <div className="v-row2">
                    <div className="v-field">
                      <label className="v-lbl">Title</label>
                      <div className="v-inp-wrap">
                        <div className="v-inp-icon"><Type size={13} /></div>
                        <input type="text" className="v-inp" placeholder="Video title…" required maxLength={100}
                          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      </div>
                    </div>
                    <div className="v-field">
                      <label className="v-lbl">Duration</label>
                      <div className="v-inp-wrap">
                        <div className="v-inp-icon"><Clock size={13} /></div>
                        <input type="text" className="v-inp" placeholder="e.g. 3:45"
                          value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="v-field">
                    <label className="v-lbl">Description</label>
                    <div className="v-inp-wrap">
                      <div className="v-inp-icon top"><AlignLeft size={13} /></div>
                      <textarea className="v-inp ta" placeholder="What is this video about…" required maxLength={400}
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="v-field">
                    <label className="v-lbl">Category</label>
                    <div className="v-cat-row">
                      {CATEGORIES.map((cat) => <CatPill key={cat.value} value={cat.value} form={form} setForm={setForm} />)}
                    </div>
                  </div>

                  <div className="v-divider" />

                  <div className="v-row2">
                    <div className="v-field" style={{ marginBottom:0 }}>
                      <div className="v-sec-lbl"><ImageIcon size={11} /> Thumbnail</div>
                      {!thumbnailPreview ? (
                        <div className={`v-upload ${dragThumb ? "drag" : ""}`}
                          onDragOver={(e) => { e.preventDefault(); setDragThumb(true); }}
                          onDragLeave={() => setDragThumb(false)}
                          onDrop={(e) => { e.preventDefault(); setDragThumb(false); handleThumbnail(e.dataTransfer.files[0]); }}>
                          <input type="file" accept="image/*" required onChange={(e) => handleThumbnail(e.target.files[0])} />
                          <ImageIcon size={18} color="#14b8a6" />
                          <div className="v-upload-t">Click or drag</div>
                          <div className="v-upload-s">PNG · JPG · WEBP</div>
                        </div>
                      ) : (
                        <div className="v-feat-prev">
                          <img src={thumbnailPreview} alt="Thumb" />
                          <div className="v-feat-overlay">
                            <div className="v-prev-badge"><Eye size={9} /> Thumbnail</div>
                            <button type="button" className="v-remove-btn" onClick={() => { setThumbnailPreview(null); setThumbnail(null); }}>
                              <Trash2 size={9} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="v-field" style={{ marginBottom:0 }}>
                      <div className="v-sec-lbl"><Play size={11} /> Video File</div>
                      <div className={`v-upload ${dragVideo ? "drag" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDragVideo(true); }}
                        onDragLeave={() => setDragVideo(false)}
                        onDrop={(e) => { e.preventDefault(); setDragVideo(false); handleVideo(e.dataTransfer.files[0]); }}>
                        <input type="file" accept="video/*" required onChange={(e) => handleVideo(e.target.files[0])} />
                        <Play size={18} color="#7c3aed" />
                        <div className="v-upload-t">{videoName ? "Change video" : "Click or drag"}</div>
                        <div className="v-upload-s">MP4 · MOV · AVI</div>
                      </div>
                      {videoName && (
                        <div className="v-pill">
                          <div className="v-pill-ico"><Play size={13} /></div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div className="v-pill-name">{videoName}</div>
                            <div className="v-pill-size">{fmtSize(videoFile?.size)}</div>
                          </div>
                          <button type="button" className="v-pill-rm" onClick={() => { setVideoFile(null); setVideoName(""); }}>
                            <X size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="v-submit" disabled={loading}>
                    {loading
                      ? <><Loader2 size={15} style={{ animation:"v-spin 1s linear infinite" }} /> Uploading…</>
                      : <><Sparkles size={15} /> Publish Video <ChevronRight size={13} /></>}
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
                      Fill in: <b>Title</b>, <b>Category</b> (hospital / equipment / doctors / patients / all),{" "}
                      <b>Description</b>, <b>Duration</b>, <b>Thumbnail</b> &amp; <b>VideoURL</b> (filename or Cloudinary URL).
                    </p>
                    <button className="v-dl-btn" onClick={() => {
                      const wb = XLSX.utils.book_new();
                      const ws = XLSX.utils.aoa_to_sheet([
                        ["title","category","description","duration","thumbnail","videourl"],
                        ["e.g. Welcome to Our Hospital","hospital","A short intro","2:30","thumb.png or https://...","video.mp4 or https://..."],
                      ]);
                      ws["!cols"] = [{ wch:35 },{ wch:14 },{ wch:40 },{ wch:10 },{ wch:50 },{ wch:50 }];
                      XLSX.utils.book_append_sheet(wb, ws, "Video Import");
                      XLSX.writeFile(wb, "video_bulk_import_template.xlsx");
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
                    <div className={`v-bulk-drop ${bulkDragOver ? "drag" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setBulkDragOver(true); }}
                      onDragLeave={() => setBulkDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setBulkDragOver(false); handleExcelFile(e.dataTransfer.files[0]); }}>
                      <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleExcelFile(e.target.files[0])} />
                      <div className="v-bulk-drop-icon"><FileSpreadsheet size={22} color="white" /></div>
                      <h3>Drop your Excel file here</h3>
                      <p>or click to browse · .xlsx · .xls · .csv</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdfa", border:"1px solid #b2f5ea", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                        <FileSpreadsheet size={15} color="#0d9488" />
                        <span style={{ fontWeight:700, fontSize:12, color:"#0f172a", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{bulkFile.name}</span>
                        <button onClick={resetBulk} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", display:"flex", alignItems:"center", padding:0 }}><X size={13} /></button>
                      </div>

                      {bulkRows.length > 0 && (
                        <div className="v-bulk-stats">
                          <div className="v-stat-chip" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}><Table2 size={11} /> {bulkRows.length} rows</div>
                          <div className="v-stat-chip" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}><CheckCircle2 size={11} /> {validRows.length} valid</div>
                          {invalidRows.length > 0 && <div className="v-stat-chip" style={{ background:"#fff5f5", color:"#ef4444", border:"1px solid #fecaca" }}><AlertCircle size={11} /> {invalidRows.length} invalid</div>}
                        </div>
                      )}

                      {bulkRows.length > 0 && (
                        <>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:".5px", textTransform:"uppercase", color:"#0d9488", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
                            <Eye size={11} /> Preview — click row to inspect
                          </div>
                          <div className="v-table-wrap">
                            <table className="v-table">
                              <thead><tr><th>#</th><th>Status</th><th>Title</th><th>Category</th><th>Duration</th><th>Thumbnail</th><th>Video</th></tr></thead>
                              <tbody>
                                {bulkRows.map((row, i) => (
                                  <tr key={i} className={row.valid ? "" : "err-row"} style={{ cursor:"pointer" }} onClick={() => setPreviewRow(row)}>
                                    <td style={{ color:"#94a3b8", fontSize:10 }}>{i+1}</td>
                                    <td>{row.valid ? <span className="v-badge ok"><CheckCircle2 size={8} /> Valid</span> : <span className="v-badge err"><X size={8} /> Error</span>}</td>
                                    <td style={{ fontWeight:600, color:"#0f172a" }}>{row.title || "—"}</td>
                                    <td>{VALID_CATEGORIES.includes(row.category) ? <span className="v-badge ok">{row.category}</span> : <span className="v-badge err">{row.category||"—"}</span>}</td>
                                    <td style={{ color:"#64748b" }}>{row.duration||"—"}</td>
                                    <td>{row.thumbnail ? <span className="v-url-cell">{row.thumbnail}</span> : <span style={{ color:"#fca5a5",fontSize:10 }}>missing</span>}</td>
                                    <td>{row.videoUrl ? <span className="v-url-cell">{row.videoUrl}</span> : <span style={{ color:"#fca5a5",fontSize:10 }}>missing</span>}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {invalidRows.length > 0 && (
                            <div style={{ marginTop:10, background:"#fff5f5", border:"1px solid #fecaca", borderRadius:9, padding:"10px 12px" }}>
                              <div style={{ fontWeight:700, fontSize:11, color:"#ef4444", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={12} /> Validation Issues</div>
                              {invalidRows.map((row, i) => <div key={i} style={{ fontSize:10, color:"#ef4444", marginBottom:4 }}><b>"{row.title||"untitled"}":</b> {row.errors.join("; ")}</div>)}
                            </div>
                          )}
                        </>
                      )}

                      {bulkErrors.filter(() => !bulkDone).map((err, i) => <div key={i} className="v-err" style={{ marginTop:8 }}><AlertCircle size={12} /> {err}</div>)}

                      {bulkImporting && (
                        <div style={{ marginTop:10 }}>
                          <div style={{ fontSize:11, color:"#0d9488", fontWeight:600, marginBottom:4 }}>Importing {bulkProgress.done} / {bulkProgress.total}...</div>
                          <div className="v-progress-bar"><div className="v-progress-fill" style={{ width:`${(bulkProgress.done/bulkProgress.total)*100}%` }} /></div>
                        </div>
                      )}

                      {bulkDone && <div className="v-ok" style={{ marginTop:10 }}><CheckCircle2 size={13} /><span>Imported {validRows.length - bulkErrors.length} of {validRows.length} videos!{bulkErrors.length > 0 && ` (${bulkErrors.length} failed)`}</span></div>}

                      {!bulkDone && validRows.length > 0 && (
                        <button className="v-submit" style={{ marginTop:14 }} disabled={bulkImporting} onClick={handleBulkImport}>
                          {bulkImporting ? <><Loader2 size={15} style={{ animation:"v-spin 1s linear infinite" }} /> Importing {bulkProgress.done}/{bulkProgress.total}...</> : <><Upload size={15} /> Import {validRows.length} Video{validRows.length!==1?"s":""} <ChevronRight size={13} /></>}
                        </button>
                      )}

                      {bulkDone && <button className="v-submit" style={{ marginTop:10 }} onClick={resetBulk}><RefreshCw size={14} /> Import Another File</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT CARD: VIDEO LIST ══ */}
          <div className="v-card">
            <div className="v-list-hdr">
              <div>
                <h3>All Videos</h3>
                <p>{videos.length} video{videos.length !== 1 ? "s" : ""} in database</p>
              </div>
              <button className="v-refresh-btn" onClick={fetchVideos}><RefreshCw size={11} /> Refresh</button>
            </div>

            <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 200px)" }}>
              {listLoading ? (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 0" }}>
                  <Loader2 style={{ width:24, height:24, color:"#14b8a6", animation:"v-spin 1s linear infinite" }} />
                </div>
              ) : videos.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#94a3b8", fontSize:12 }}>No videos yet.</div>
              ) : (
                videos.map((item) => {
                  const id  = item._id || item.id;
                  const cat = getCatInfo(item.category);
                  const thumbSrc = getThumbSrc(item);
                  const hasThumbError = thumbErrors[id];

                  return (
                    <div key={id} className="v-row">
                      {/* ── FIXED THUMBNAIL ── */}
                      <div className="v-thumb">
                        {thumbSrc && !hasThumbError ? (
                          <img
                            src={thumbSrc}
                            alt={item.title}
                            crossOrigin="anonymous"
                            onError={() => setThumbErrors(prev => ({ ...prev, [id]: true }))}
                            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          />
                        ) : (
                          <div className="v-thumb-placeholder">
                            <Film size={18} color="#14b8a6" />
                            <span>No thumb</span>
                          </div>
                        )}
                      </div>

                      <div className="v-info">
                        <div className="v-title">{item.title}</div>
                        <div className="v-cat" style={{ color: cat.color }}>{item.category}</div>
                        <div className="v-desc">{item.description}</div>
                      </div>

                      {item.duration && (
                        <span className="v-list-badge" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}>
                          {item.duration}
                        </span>
                      )}
                      <span className="v-list-badge" style={{ background:cat.bg, color:cat.color, border:`1.5px solid ${cat.color}33` }}>
                        {item.category}
                      </span>
                      <button className="v-icon-btn teal" title="Edit" onClick={() => openEdit(item)}><Pencil size={12} /></button>
                      <button className="v-icon-btn red" title="Delete" disabled={deletingId === id} onClick={() => handleDelete(id)}>
                        {deletingId === id ? <Loader2 size={12} style={{ animation:"v-spin 1s linear infinite" }} /> : <Trash2 size={12} />}
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
        <div className="v-backdrop" onClick={() => setPreviewRow(null)}>
          <div className="v-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="v-modal-hdr">
              <div><p>Row Preview</p><h2>{previewRow.title || "Untitled"}</h2></div>
              <button className="v-modal-close" onClick={() => setPreviewRow(null)}><X size={13} /></button>
            </div>
            <div className="v-modal-body">
              {previewRow.thumbnail && (
                <img src={previewRow.thumbnail.startsWith("http") ? previewRow.thumbnail : `/${previewRow.thumbnail}`}
                  alt="thumbnail" style={{ width:"100%", height:120, objectFit:"cover", borderRadius:10, marginBottom:10, display:"block" }}
                  onError={(e) => { e.target.style.display="none"; }} />
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                <span className="v-badge ok">{previewRow.category}</span>
                {previewRow.duration && <span className="v-badge ok"><Clock size={8} /> {previewRow.duration}</span>}
                {previewRow.valid ? <span className="v-badge ok"><CheckCircle2 size={8} /> Valid</span> : <span className="v-badge err"><X size={8} /> Has errors</span>}
              </div>
              <p style={{ fontSize:12, color:"#475569", lineHeight:1.6, margin:"0 0 10px" }}>{previewRow.description}</p>
              {previewRow.errors.length > 0 && (
                <div style={{ background:"#fff5f5", border:"1px solid #fecaca", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                  {previewRow.errors.map((err, i) => <div key={i} style={{ fontSize:11, color:"#ef4444", display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={10} /> {err}</div>)}
                </div>
              )}
              <div style={{ background:"#f0fdfa", border:"1px solid #b2f5ea", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#0d9488", marginBottom:4 }}>THUMBNAIL</div>
                <span style={{ fontSize:11, color:"#14b8a6", wordBreak:"break-all" }}>{previewRow.thumbnail || "—"}</span>
              </div>
              {previewRow.videoUrl && (
                <div style={{ background:"#f0fdfa", border:"1px solid #b2f5ea", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#0d9488", marginBottom:4 }}>VIDEO URL / FILE</div>
                  <span style={{ fontSize:11, color:"#14b8a6", wordBreak:"break-all" }}>{previewRow.videoUrl}</span>
                </div>
              )}
              <button className="v-cancel-btn" style={{ marginTop:6, width:"100%" }} onClick={() => setPreviewRow(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <div className="v-backdrop" onClick={closeEdit}>
          <div className="v-modal" onClick={(e) => e.stopPropagation()}>
            <div className="v-modal-hdr">
              <div><p>Editing Video</p><h2>{editItem.title}</h2></div>
              <button className="v-modal-close" onClick={closeEdit}><X size={13} /></button>
            </div>
            <div className="v-modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="v-row2">
                  <div className="v-field">
                    <label className="v-lbl">Title</label>
                    <div className="v-inp-wrap">
                      <div className="v-inp-icon"><Type size={13} /></div>
                      <input type="text" className="v-inp" required maxLength={100}
                        value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                  </div>
                  <div className="v-field">
                    <label className="v-lbl">Duration</label>
                    <div className="v-inp-wrap">
                      <div className="v-inp-icon"><Clock size={13} /></div>
                      <input type="text" className="v-inp" placeholder="e.g. 3:45"
                        value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="v-field">
                  <label className="v-lbl">Description</label>
                  <div className="v-inp-wrap">
                    <div className="v-inp-icon top"><AlignLeft size={13} /></div>
                    <textarea className="v-inp ta" maxLength={400}
                      value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                </div>
                <div className="v-field">
                  <label className="v-lbl">Category</label>
                  <div className="v-cat-row">
                    {CATEGORIES.map((cat) => <CatPill key={cat.value} value={cat.value} form={editForm} setForm={setEditForm} />)}
                  </div>
                </div>
                <div className="v-field">
                  <label className="v-lbl">Replace Thumbnail <span style={{ color:"#94a3b8", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  {editThumbPreview ? (
                    <div className="v-feat-prev">
                      <img src={editThumbPreview} alt="new thumb" />
                      <div className="v-feat-overlay"><div className="v-prev-badge"><CheckCircle2 size={9} /> New thumbnail</div></div>
                      <button type="button" className="v-remove-btn" style={{ position:"absolute", top:6, right:6 }} onClick={() => { setEditThumbFile(null); setEditThumbPreview(null); }}><X size={9} /> Remove</button>
                    </div>
                  ) : (
                    <div className="v-upload" style={{ padding:"10px 12px" }}>
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setEditThumbFile(f); setEditThumbPreview(URL.createObjectURL(f)); } }} />
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:"#0d9488", fontSize:12, fontWeight:600 }}><ImageIcon size={14} /> Click to upload new thumbnail</div>
                      <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>Leave empty to keep existing</p>
                    </div>
                  )}
                </div>
                {editError   && <div className="v-err"><X size={12} /> {editError}</div>}
                {editSuccess && <div className="v-ok"><CheckCircle2 size={12} /> Updated successfully!</div>}
                <div style={{ display:"flex", gap:10 }}>
                  <button type="button" className="v-cancel-btn" onClick={closeEdit}>Cancel</button>
                  <button type="submit" className="v-submit" disabled={editLoading} style={{ flex:2, marginTop:0, padding:"9px" }}>
                    {editLoading ? <><Loader2 size={13} style={{ animation:"v-spin 1s linear infinite" }} /> Saving…</> : <><Save size={13} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {success && <div className="v-toast"><CheckCircle2 size={16} /> Video uploaded successfully!</div>}
    </>
  );
}