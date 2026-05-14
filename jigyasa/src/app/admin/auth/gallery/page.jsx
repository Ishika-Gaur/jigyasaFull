"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import * as XLSX from "xlsx"; // npm install xlsx
import {
  ImagePlus, Layers, Tag, Type, AlignLeft, Stethoscope,
  Users, Cpu, Upload, CheckCircle2, Loader2, Sparkles,
  ChevronRight, X, Star, Grid3X3, Eye, Trash2, Pencil,
  RefreshCw, ArrowLeft, Save, Images, LayoutGrid,
  FileSpreadsheet, Download, AlertCircle, Table2,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import Link from "next/link";

const API = "http://localhost:4000/api";

const CATEGORIES = [
  { value: "equipment", label: "Equipment", icon: Cpu,         color: "#06b6d4", bg: "rgba(6,182,212,0.08)"   },
  { value: "doctors",   label: "Doctors",   icon: Stethoscope, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  { value: "patients",  label: "Patients",  icon: Users,       color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
];

const VALID_CATEGORIES = ["equipment", "doctors", "patients"];

// ── Find the real header row index (0-based) in the worksheet ──
function findHeaderRowIndex(ws) {
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z100");
  for (let r = range.s.r; r <= Math.min(range.e.r, 10); r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      if (cell && String(cell.v ?? "").toLowerCase().trim() === "title") {
        return r;
      }
    }
  }
  return 0;
}

// ── Parse worksheet into rows using the correct header row ──
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
    if (hintVal.startsWith("e.g.") || hintVal.startsWith("short") || hintVal.startsWith("name") || hintVal.includes("max") || hintVal.includes("cloudinary")) {
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

// ── Check if a value looks like a valid image (URL or local filename) ──
function isValidImage(val) {
  if (!val) return false;
  const lower = val.toLowerCase();
  // Accept http/https URLs
  if (lower.startsWith("http://") || lower.startsWith("https://")) return true;
  // Accept local filenames with image extensions
  if (/\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(lower)) return true;
  return false;
}

// ── Parse a single data row object into a gallery item ──
function parseRow(row) {
  const normalize = (s) => s.toLowerCase().replace(/[\s_]+/g, "");
  const get = (key) => {
    const normKey = normalize(key);
    const match = Object.keys(row).find((k) => normalize(k) === normKey);
    return match ? String(row[match] ?? "").trim() : "";
  };

  const title       = get("title");
  const category    = get("category").toLowerCase().trim();
  const description = get("description");
  const featuredImage =
    get("featuredimage") ||
    get("featuredimageurl") ||
    get("featured") ||
    get("coverimage") ||
    "";

  // ✅ FIX 1: Accept both http URLs and local filenames
  const images = [];
  for (let i = 1; i <= 20; i++) {
    const val =
      get(`image${i}`) ||
      get(`image${i}url`) ||
      get(`img${i}`) ||
      "";
    if (isValidImage(val)) images.push(val);
  }

  // Skip sample/placeholder rows
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.startsWith("e.g.") ||
    lowerTitle === "title" ||
    lowerTitle === "(optional)" ||
    title === ""
  ) {
    return null;
  }

  const errors = [];
  if (!title)                               errors.push("Title is required");
  if (!VALID_CATEGORIES.includes(category)) errors.push(`Category must be equipment, doctors, or patients (got: "${category}")`);
  if (!description)                         errors.push("Description is required");
  // ✅ FIX 2: Accept both http URLs and local filenames for featured image
  if (!isValidImage(featuredImage))         errors.push("Featured image is required (URL or filename like ultraSound.png)");

  return { title, category, description, featuredImage, images, errors, valid: errors.length === 0 };
}

export default function AddGallery() {
  const [checking,  setChecking]  = useState(true);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("manual");

  // ── Manual form state ──
  const [form,            setForm]            = useState({ title: "", category: "equipment", description: "" });
  const [featuredImage,   setFeaturedImage]   = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState(null);
  const [images,          setImages]          = useState([]);
  const [imagePreviews,   setImagePreviews]   = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [dragOver,        setDragOver]        = useState(false);
  const [dragOverMulti,   setDragOverMulti]   = useState(false);

  // ── Bulk import state ──
  const [bulkFile,       setBulkFile]       = useState(null);
  const [bulkRows,       setBulkRows]       = useState([]);
  const [bulkDragOver,   setBulkDragOver]   = useState(false);
  const [bulkImporting,  setBulkImporting]  = useState(false);
  const [bulkProgress,   setBulkProgress]   = useState({ done: 0, total: 0 });
  const [bulkErrors,     setBulkErrors]     = useState([]);
  const [bulkDone,       setBulkDone]       = useState(false);
  const [previewRow,     setPreviewRow]     = useState(null);

  // ── Gallery list state ──
  const [gallery,     setGallery]     = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deletingId,  setDeletingId]  = useState(null);

  // ── Edit modal state ──
  const [editItem,        setEditItem]        = useState(null);
  const [editForm,        setEditForm]        = useState({ title: "", category: "equipment", description: "" });
  const [editFeatFile,    setEditFeatFile]    = useState(null);
  const [editFeatPreview, setEditFeatPreview] = useState(null);
  const [editLoading,     setEditLoading]     = useState(false);
  const [editError,       setEditError]       = useState("");
  const [editSuccess,     setEditSuccess]     = useState(false);

  // ── Image manager modal state ──
  const [imgMgrItem,     setImgMgrItem]     = useState(null);
  const [imgMgrPreviews, setImgMgrPreviews] = useState([]);
  const [newImgFiles,    setNewImgFiles]    = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);
  const [imgMgrLoading,  setImgMgrLoading]  = useState(false);
  const [imgMgrError,    setImgMgrError]    = useState("");
  const [toDelete,       setToDelete]       = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try   { await axios.get(`${API}/auth/me`, { withCredentials: true }); }
      catch { router.push("/admin"); }
      finally { setChecking(false); }
    };
    checkAuth();
  }, []);

  const fetchGallery = async () => {
    setListLoading(true);
    try {
      const res = await axios.get(`${API}/gallery`, { withCredentials: true });
      setGallery(res.data);
    } catch {}
    finally { setListLoading(false); }
  };

  useEffect(() => { if (!checking) fetchGallery(); }, [checking]);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload  = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // ── Manual form handlers ──
  const handleFeaturedImage = (file) => {
    if (file?.type.startsWith("image/")) {
      setFeaturedImage(file);
      setFeaturedPreview(URL.createObjectURL(file));
    }
  };

  const handleImages = (files) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages(arr);
    setImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (i) => {
    setImages(images.filter((_, idx) => idx !== i));
    setImagePreviews(imagePreviews.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const featuredBase64 = await convertToBase64(featuredImage);
      const imagesBase64   = await Promise.all(images.map((img) => convertToBase64(img)));
      await axios.post(`${API}/gallery`, { ...form, featuredImage: featuredBase64, images: imagesBase64 }, { withCredentials: true });
      setSuccess(true);
      setForm({ title: "", category: "equipment", description: "" });
      setFeaturedImage(null); setFeaturedPreview(null);
      setImages([]); setImagePreviews([]);
      setTimeout(() => setSuccess(false), 4000);
      fetchGallery();
    } catch (err) {
      alert(`Upload failed: ${err?.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  // ── Excel parse ──
  const handleExcelFile = (file) => {
    if (!file) return;
    setBulkFile(file);
    setBulkRows([]);
    setBulkErrors([]);
    setBulkDone(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheetName =
          wb.SheetNames.find((n) => n.toLowerCase().includes("gallery")) ||
          wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];

        const rawRows = parseWorksheet(ws);

        if (!rawRows.length) {
          setBulkErrors(["No data rows found. Make sure you filled in rows below the header."]);
          return;
        }

        const parsed = rawRows.map((row) => parseRow(row)).filter(Boolean);

        if (!parsed.length) {
          setBulkErrors(["All rows were skipped (empty or sample data). Please fill in your real data."]);
          return;
        }

        setBulkRows(parsed);
      } catch (err) {
        setBulkErrors([`Failed to parse file: ${err.message}`]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validRows   = bulkRows.filter((r) => r.valid);
  const invalidRows = bulkRows.filter((r) => !r.valid);

  // ✅ FIX 3: resolveImage handles both http URLs and local filenames
  // Local filenames are fetched from your public /images/ folder and converted to base64
  const resolveImage = async (nameOrUrl) => {
    if (!nameOrUrl) return null;
    // Already a remote URL — send as-is (backend will use useUrls flag)
    if (nameOrUrl.toLowerCase().startsWith("http")) return { value: nameOrUrl, isUrl: true };
    // Local filename — fetch from public folder and convert to base64
    try {
      const res  = await fetch(`/${nameOrUrl}`);
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
      throw new Error(`Could not load image "${nameOrUrl}": ${err.message}`);
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
        // Resolve featured image
        const featuredResolved = await resolveImage(row.featuredImage);

        // Resolve all gallery images
        const imagesResolved = (
          await Promise.all(row.images.map((img) => resolveImage(img).catch(() => null)))
        ).filter(Boolean);

        // If featured is a remote URL, all images must also be remote URLs (useUrls: true)
        // If featured is base64, send everything as base64 (useUrls: false)
        const allAreUrls =
          featuredResolved.isUrl && imagesResolved.every((r) => r.isUrl);

        await axios.post(
          `${API}/gallery`,
          {
            title:         row.title,
            category:      row.category,
            description:   row.description,
            featuredImage: featuredResolved.value,
            images:        imagesResolved.map((r) => r.value),
            useUrls:       allAreUrls,
          },
          { withCredentials: true }
        );
      } catch (err) {
        errs.push(`Row ${i + 1} ("${row.title}"): ${err?.response?.data?.message || err.message}`);
      }
      setBulkProgress({ done: i + 1, total: validRows.length });
    }

    setBulkErrors(errs);
    setBulkImporting(false);
    setBulkDone(true);
    fetchGallery();
  };

  const resetBulk = () => {
    setBulkFile(null); setBulkRows([]); setBulkErrors([]); setBulkDone(false); setBulkImporting(false);
  };

  // ── Gallery list actions ──
  const handleDelete = async (id) => {
    if (!confirm("Delete this gallery item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/gallery/${id}`, { withCredentials: true });
      setGallery((prev) => prev.filter((g) => g.id !== id));
    } catch { alert("Failed to delete gallery item."); }
    finally { setDeletingId(null); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({ title: item.title || "", category: item.category || "equipment", description: item.description || "" });
    setEditFeatFile(null); setEditFeatPreview(null); setEditError(""); setEditSuccess(false);
  };
  const closeEdit = () => { setEditItem(null); setEditFeatFile(null); setEditFeatPreview(null); setEditError(""); setEditSuccess(false); };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true); setEditError("");
    try {
      const payload = { ...editForm };
      if (editFeatFile) payload.featuredImage = await convertToBase64(editFeatFile);
      await axios.patch(`${API}/gallery/${editItem.id}`, payload, { withCredentials: true });
      setGallery((prev) => prev.map((g) => g._id === editItem.id ? { ...g, ...editForm } : g));
      setEditSuccess(true);
      setTimeout(() => { setEditSuccess(false); closeEdit(); }, 1800);
    } catch (err) {
      setEditError(err?.response?.data?.message || "Update failed.");
    } finally { setEditLoading(false); }
  };

  const openImgMgr = (item) => {
    setImgMgrItem(item);
    const previews = (item.images || []).map((_, i) => `${API}/gallery/${item.id}/image/${i}`);
    setImgMgrPreviews(previews);
    setNewImgFiles([]); setNewImgPreviews([]); setToDelete([]); setImgMgrError("");
  };
  const closeImgMgr = () => { setImgMgrItem(null); setNewImgFiles([]); setNewImgPreviews([]); setToDelete([]); setImgMgrError(""); };

  const toggleToDelete = (i) =>
    setToDelete((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const handleImgMgrSubmit = async () => {
    setImgMgrLoading(true); setImgMgrError("");
    try {
      const newBase64 = await Promise.all(newImgFiles.map((f) => convertToBase64(f)));
      await axios.patch(`${API}/gallery/${imgMgrItem.id}/images`, { deleteIndices: toDelete, addImages: newBase64 }, { withCredentials: true });
      fetchGallery();
      closeImgMgr();
    } catch (err) {
      setImgMgrError(err?.response?.data?.message || "Failed to update images.");
    } finally { setImgMgrLoading(false); }
  };

  if (checking) return (
    <div style={{ minHeight:"100vh", background:"#f0fdfa", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Loader2 style={{ width:28, height:28, color:"#14b8a6", animation:"g-spin 1s linear infinite" }} />
    </div>
  );

  const CatChip = ({ value, form, setForm }) => {
    const cat = CATEGORIES.find((c) => c.value === value);
    const sel = form.category === value;
    const CatIcon = cat.icon;
    return (
      <div className={`g-cat-pill ${sel ? "sel" : ""}`}
        style={{ borderColor: sel ? cat.color : undefined, background: sel ? cat.bg : undefined, color: sel ? cat.color : undefined }}
        onClick={() => setForm({ ...form, category: value })}>
        <CatIcon size={13} />{cat.label}{sel && <CheckCircle2 size={11} />}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes g-spin  { to { transform: rotate(360deg); } }
        @keyframes g-modal { from { opacity:0; transform: scale(.96) translateY(12px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes g-toast { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes g-thumb { from { opacity:0; transform: scale(.8); } to { opacity:1; transform: scale(1); } }
        @keyframes g-fade  { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

        .g-root *, .g-root *::before, .g-root *::after { box-sizing: border-box; }
        .g-root { min-height:100vh; background:#f0fdfa; font-family:'Satoshi',system-ui,sans-serif; }

        .g-topbar { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-bottom:1px solid rgba(20,184,166,.12); padding:10px 20px; }
        .g-topbar a { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#64748b; text-decoration:none; }
        .g-topbar a:hover { color:#0d9488; }
        .g-topbar-cur { font-size:12px; font-weight:600; color:#0d9488; }

        .g-layout { display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:1100px; margin:0 auto; padding:14px 14px 20px; align-items:start; }
        @media (max-width:820px) { .g-layout { grid-template-columns:1fr; } }

        .g-card { background:white; border-radius:16px; border:1px solid rgba(20,184,166,.12); box-shadow:0 4px 20px rgba(13,148,136,.1); overflow:hidden; display:flex; flex-direction:column; }
        .g-card-hdr { background:linear-gradient(135deg,#064e3b 0%,#0f766e 50%,#14b8a6 100%); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
        .g-card-hdr h2 { font-size:14px; font-weight:700; color:white; margin:0; letter-spacing:-.2px; }
        .g-card-hdr p { font-size:11px; color:rgba(255,255,255,.6); margin:2px 0 0; }
        .g-body { padding:14px 16px 16px; flex:1; overflow-y:auto; }

        .g-tabs { display:flex; gap:0; border-bottom:2px solid rgba(20,184,166,.1); margin-bottom:14px; }
        .g-tab { flex:1; padding:9px 10px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:none; display:flex; align-items:center; justify-content:center; gap:6px; color:#94a3b8; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; font-family:inherit; }
        .g-tab.active { color:#0d9488; border-bottom-color:#14b8a6; background:linear-gradient(180deg,transparent,rgba(20,184,166,.04)); }
        .g-tab:hover:not(.active) { color:#0d9488; background:rgba(20,184,166,.04); }

        .g-row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width:480px) { .g-row2 { grid-template-columns:1fr; } }
        .g-field { margin-bottom:10px; }
        .g-lbl { display:block; font-size:10px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:#0d9488; margin-bottom:4px; }
        .g-inp-wrap { position:relative; }
        .g-inp-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex; align-items:center; }
        .g-inp-icon.top { top:10px; transform:none; }
        .g-inp-wrap:focus-within .g-inp-icon { color:#14b8a6; }
        .g-inp { width:100%; padding:8px 10px 8px 32px; border:1.5px solid #e2f4f2; border-radius:9px; font-size:13px; color:#0f172a; background:#fafffe; outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
        .g-inp:focus { border-color:#14b8a6; box-shadow:0 0 0 3px rgba(20,184,166,.1); background:white; }
        .g-inp::placeholder { color:#b0cec9; }
        .g-inp.ta { min-height:72px; resize:vertical; line-height:1.5; padding-top:9px; }

        .g-cat-row { display:flex; gap:7px; flex-wrap:wrap; }
        .g-cat-pill { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; border:1.5px solid #e2f4f2; background:#fafffe; cursor:pointer; font-size:12px; font-weight:600; color:#64748b; transition:all .2s; white-space:nowrap; }
        .g-cat-pill.sel { box-shadow:0 2px 8px rgba(20,184,166,.2); }
        .g-cat-pill:hover { transform:translateY(-1px); }

        .g-upload { border:1.5px dashed rgba(20,184,166,.35); border-radius:10px; padding:12px 10px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
        .g-upload:hover,.g-upload.drag { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
        .g-upload input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; z-index:2; width:100%; height:100%; }
        .g-upload-t { font-size:12px; font-weight:600; color:#0d9488; }
        .g-upload-s { font-size:10px; color:#94a3b8; margin-top:2px; }

        .g-feat-prev { position:relative; border-radius:10px; overflow:hidden; }
        .g-feat-prev img { width:100%; height:90px; object-fit:cover; display:block; }
        .g-feat-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.45),transparent); display:flex; align-items:flex-end; padding:6px 8px; }
        .g-prev-badge { font-size:10px; font-weight:600; color:white; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); padding:2px 8px; border-radius:100px; display:flex; align-items:center; gap:4px; }
        .g-change-btn { position:absolute; top:6px; right:6px; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,.3); color:white; border-radius:100px; font-size:11px; font-weight:600; padding:3px 8px; cursor:pointer; display:flex; align-items:center; gap:4px; z-index:3; }

        .g-thumb-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(60px,1fr)); gap:6px; }
        .g-thumb { position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; animation:g-thumb .25s ease both; }
        .g-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .g-thumb-rm { position:absolute; top:3px; right:3px; width:16px; height:16px; background:rgba(239,68,68,.9); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity .15s; border:none; z-index:3; }
        .g-thumb:hover .g-thumb-rm { opacity:1; }

        .g-submit { width:100%; padding:11px; background:linear-gradient(135deg,#064e3b 0%,#0f766e 40%,#14b8a6 100%); color:white; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; box-shadow:0 4px 16px rgba(20,184,166,.35); margin-top:12px; font-family:inherit; }
        .g-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(20,184,166,.45); }
        .g-submit:disabled { opacity:.7; cursor:not-allowed; }

        .g-bulk-drop { border:2px dashed rgba(20,184,166,.35); border-radius:14px; padding:28px 20px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; }
        .g-bulk-drop.drag,.g-bulk-drop:hover { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
        .g-bulk-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; z-index:2; }
        .g-bulk-drop-icon { width:44px; height:44px; background:linear-gradient(135deg,#064e3b,#14b8a6); border-radius:12px; display:flex; align-items:center; justify-content:margin:0 auto 10px; margin: 0 auto 10px; }
        .g-bulk-drop h3 { font-size:14px; font-weight:700; color:#0d9488; margin:0 0 4px; }
        .g-bulk-drop p { font-size:11px; color:#64748b; margin:0; }

        .g-dl-btn { display:inline-flex; align-items:center; gap:6px; background:white; border:1.5px solid #b2f5ea; color:#0d9488; font-size:11px; font-weight:700; padding:7px 14px; border-radius:8px; cursor:pointer; margin-top:12px; text-decoration:none; transition:all .2s; font-family:inherit; }
        .g-dl-btn:hover { background:#f0fdfa; border-color:#14b8a6; transform:translateY(-1px); }

        .g-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid rgba(20,184,166,.15); margin-top:12px; animation:g-fade .3s ease both; }
        .g-table { width:100%; border-collapse:collapse; font-size:11px; }
        .g-table th { background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap; font-size:10px; letter-spacing:.5px; }
        .g-table td { padding:7px 10px; border-bottom:1px solid #f0fdfa; vertical-align:middle; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .g-table tr:last-child td { border-bottom:none; }
        .g-table tr:nth-child(even) td { background:#f8fffd; }
        .g-table tr:hover td { background:#e6fef9; }
        .g-table .err-row td { background:#fff5f5 !important; }

        .g-badge { display:inline-flex; align-items:center; gap:3px; font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; white-space:nowrap; }
        .g-badge.ok  { background:#f0fdfa; color:#0d9488; border:1px solid #b2f5ea; }
        .g-badge.err { background:#fff5f5; color:#ef4444; border:1px solid #fecaca; }

        .g-img-url { font-size:9px; color:#14b8a6; text-decoration:none; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:130px; }
        .g-img-url:hover { text-decoration:underline; }

        .g-bulk-stats { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0; }
        .g-stat-chip { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; font-size:11px; font-weight:700; }

        .g-progress-bar { height:6px; background:#e2f4f2; border-radius:100px; overflow:hidden; margin:10px 0; }
        .g-progress-fill { height:100%; background:linear-gradient(90deg,#064e3b,#14b8a6); border-radius:100px; transition:width .3s ease; }

        .g-list-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(20,184,166,.1); background:linear-gradient(to right,#f0fdfa,white); }
        .g-list-hdr h3 { font-size:13px; font-weight:700; color:#0f172a; margin:0; }
        .g-list-hdr p  { font-size:11px; color:#64748b; margin:2px 0 0; }
        .g-row { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #f5fffe; transition:background .15s; }
        .g-row:last-child { border-bottom:none; }
        .g-row:hover { background:#f0fdfa; }
        .g-row-thumb { width:54px; height:40px; border-radius:8px; flex-shrink:0; background:#e8f5f3; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .g-row-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .g-row-info { flex:1; min-width:0; }
        .g-row-title { font-size:13px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .g-row-cat   { font-size:10px; font-weight:600; color:#14b8a6; text-transform:capitalize; }
        .g-row-desc  { font-size:10px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .g-pill { flex-shrink:0; font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; white-space:nowrap; }
        .g-icon-btn { flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:1.5px solid; cursor:pointer; transition:all .18s; background:none; }
        .g-icon-btn:disabled { opacity:.5; cursor:not-allowed; pointer-events:none; }
        .g-icon-btn.teal   { border-color:#b2f5ea; background:#f0fdfa; color:#0d9488; }
        .g-icon-btn.teal:hover   { background:#0d9488; color:white; border-color:#0d9488; }
        .g-icon-btn.purple { border-color:#ddd6fe; background:#faf5ff; color:#7c3aed; }
        .g-icon-btn.purple:hover { background:#7c3aed; color:white; border-color:#7c3aed; }
        .g-icon-btn.red    { border-color:#fecaca; background:#fff5f5; color:#ef4444; }
        .g-icon-btn.red:hover    { background:#ef4444; color:white; border-color:#ef4444; }
        .g-refresh-btn { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:#0d9488; background:#f0fdfa; border:1px solid #b2f5ea; padding:5px 10px; border-radius:8px; cursor:pointer; transition:background .2s; }
        .g-refresh-btn:hover { background:#ccfbf1; }

        .g-backdrop { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:12px; background:rgba(0,0,0,.5); backdrop-filter:blur(6px); }
        .g-modal { background:white; border-radius:18px; width:100%; max-width:520px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.22); animation:g-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
        .g-modal-hdr { padding:16px 20px 14px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:5; }
        .g-modal-hdr-info p  { color:rgba(255,255,255,.6); font-size:10px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; margin:0 0 2px; }
        .g-modal-hdr-info h2 { font-size:16px; font-weight:700; color:white; margin:0; }
        .g-modal-close { width:28px; height:28px; border-radius:50%; border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.15); flex-shrink:0; }
        .g-modal-close:hover { background:rgba(255,255,255,.28); }
        .g-modal-body { padding:16px 20px 20px; }

        .g-preview-modal { background:white; border-radius:18px; width:100%; max-width:460px; max-height:85vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:g-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
        .g-preview-img { width:100%; height:120px; object-fit:cover; border-radius:10px; margin-bottom:10px; display:block; }
        .g-preview-imgs { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-top:8px; }
        .g-preview-imgs img { width:100%; aspect-ratio:1; object-fit:cover; border-radius:8px; border:1.5px solid #e2f4f2; }

        .g-imgmgr-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(72px,1fr)); gap:7px; }
        .g-imgmgr-cell { position:relative; aspect-ratio:1; border-radius:8px; overflow:hidden; cursor:pointer; transition:all .18s; }
        .g-imgmgr-cell img { width:100%; height:100%; object-fit:cover; display:block; transition:opacity .2s; }
        .g-imgmgr-cell.marked img { opacity:.3; }
        .g-imgmgr-cell.marked::after { content:'✕'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900; color:#ef4444; }
        .g-imgmgr-cell:not(.marked):hover { transform:scale(1.04); }

        .g-err { display:flex; align-items:center; gap:7px; background:#fff5f5; border:1px solid #fecaca; color:#ef4444; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
        .g-ok  { display:flex; align-items:center; gap:7px; background:#f0fdfa; border:1px solid #b2f5ea; color:#0d9488; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }

        .g-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:10px 22px; border-radius:100px; font-size:13px; font-weight:600; box-shadow:0 8px 30px rgba(13,148,136,.45); z-index:99999; display:flex; align-items:center; gap:7px; white-space:nowrap; animation:g-toast .4s ease both; pointer-events:none; }
        .g-cancel-btn { flex:1; border:1.5px solid #e2e8f0; background:#f8fafc; color:#64748b; font-weight:600; font-size:13px; padding:9px; border-radius:9px; cursor:pointer; transition:background .2s; font-family:inherit; }
        .g-cancel-btn:hover { background:#f1f5f9; }
        .g-divider { height:1px; background:linear-gradient(90deg,transparent,#e2f4f2,transparent); margin:10px 0; }
        .g-sec-lbl { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#0d9488; margin-bottom:8px; display:flex; align-items:center; gap:5px; }

        @media (max-width:480px) { .g-layout { padding:10px 10px 16px; gap:10px; } .g-body { padding:10px 12px 12px; } .g-card-hdr { padding:12px 14px; } }
      `}</style>

      <div className="g-root">

        <div className="g-topbar">
          <Link href="/admin/auth/dashboard"><ArrowLeft size={13} /> Dashboard</Link>
          <ChevronRight size={11} style={{ color:"#cbd5e1" }} />
          <span className="g-topbar-cur">Gallery</span>
        </div>

        <div className="g-layout">

          {/* ══ LEFT CARD ══ */}
          <div className="g-card">
            <div className="g-card-hdr">
              <div>
                <h2>{activeTab === "manual" ? "Add Gallery Item" : "Bulk Import via Excel"}</h2>
                <p>{activeTab === "manual" ? "Upload & publish new content" : "Import multiple items at once"}</p>
              </div>
              <span style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", display:"inline-block" }} />
            </div>

            <div className="g-body">

              <div className="g-tabs">
                <button className={`g-tab ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
                  <ImagePlus size={13} /> Manual Entry
                </button>
                <button className={`g-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
                  <FileSpreadsheet size={13} /> Bulk Import
                </button>
              </div>

              {/* ══ MANUAL FORM ══ */}
              {activeTab === "manual" && (
                <form onSubmit={handleSubmit}>
                  <div className="g-field">
                    <label className="g-lbl">Title</label>
                    <div className="g-inp-wrap">
                      <div className="g-inp-icon"><Type size={13} /></div>
                      <input type="text" className="g-inp" placeholder="e.g. Modern MRI Scanner Room" required maxLength={80}
                        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>
                  </div>

                  <div className="g-field">
                    <label className="g-lbl">Description</label>
                    <div className="g-inp-wrap">
                      <div className="g-inp-icon top"><AlignLeft size={13} /></div>
                      <textarea className="g-inp ta" placeholder="Describe this gallery item..." required maxLength={300}
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                  </div>

                  <div className="g-field">
                    <label className="g-lbl">Category</label>
                    <div className="g-cat-row">
                      {CATEGORIES.map((cat) => (
                        <CatChip key={cat.value} value={cat.value} form={form} setForm={setForm} />
                      ))}
                    </div>
                  </div>

                  <div className="g-divider" />

                  <div className="g-row2">
                    <div className="g-field" style={{ marginBottom:0 }}>
                      <div className="g-sec-lbl"><Star size={11} /> Featured Image</div>
                      {!featuredPreview ? (
                        <div className={`g-upload ${dragOver ? "drag" : ""}`}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFeaturedImage(e.dataTransfer.files[0]); }}>
                          <input type="file" accept="image/*" required onChange={(e) => handleFeaturedImage(e.target.files[0])} />
                          <ImagePlus size={18} color="#14b8a6" />
                          <div className="g-upload-t">Click or drag</div>
                          <div className="g-upload-s">PNG · JPG · WEBP</div>
                        </div>
                      ) : (
                        <div className="g-feat-prev">
                          <img src={featuredPreview} alt="Featured" />
                          <div className="g-feat-overlay"><div className="g-prev-badge"><Eye size={9} /> Featured</div></div>
                          <button type="button" className="g-change-btn" onClick={() => { setFeaturedPreview(null); setFeaturedImage(null); }}><X size={10} /> Change</button>
                        </div>
                      )}
                    </div>

                    <div className="g-field" style={{ marginBottom:0 }}>
                      <div className="g-sec-lbl"><Grid3X3 size={11} /> Gallery Images</div>
                      {imagePreviews.length === 0 ? (
                        <div className={`g-upload ${dragOverMulti ? "drag" : ""}`}
                          onDragOver={(e) => { e.preventDefault(); setDragOverMulti(true); }}
                          onDragLeave={() => setDragOverMulti(false)}
                          onDrop={(e) => { e.preventDefault(); setDragOverMulti(false); handleImages(e.dataTransfer.files); }}>
                          <input type="file" accept="image/*" multiple onChange={(e) => handleImages(e.target.files)} />
                          <Upload size={18} color="#14b8a6" />
                          <div className="g-upload-t">Select multiple</div>
                          <div className="g-upload-s">Hold Ctrl to multi-select</div>
                        </div>
                      ) : (
                        <div>
                          <div className="g-thumb-grid">
                            {imagePreviews.map((src, i) => (
                              <div key={i} className="g-thumb" style={{ animationDelay:`${i * 0.04}s` }}>
                                <img src={src} alt="" />
                                <button type="button" className="g-thumb-rm" onClick={() => removePreview(i)}><X size={8} /></button>
                              </div>
                            ))}
                            <label style={{ cursor:"pointer", aspectRatio:"1", borderRadius:8, border:"1.5px dashed rgba(20,184,166,.35)", background:"#f0fdfa", display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <input type="file" accept="image/*" multiple style={{ display:"none" }}
                                onChange={(e) => { const all = [...images, ...Array.from(e.target.files)]; setImages(all); setImagePreviews(all.map((f) => URL.createObjectURL(f))); }} />
                              <ImagePlus size={14} color="#14b8a6" />
                            </label>
                          </div>
                          <div style={{ fontSize:10, color:"#64748b", marginTop:4 }}>{imagePreviews.length} image{imagePreviews.length !== 1 ? "s" : ""}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="g-submit" disabled={loading}>
                    {loading
                      ? <><Loader2 size={15} style={{ animation:"g-spin 1s linear infinite" }} /> Publishing...</>
                      : <><Sparkles size={15} /> Publish Item <ChevronRight size={13} /></>}
                  </button>
                </form>
              )}

              {/* ══ BULK IMPORT ══ */}
              {activeTab === "bulk" && (
                <div>
                  <div style={{ background:"linear-gradient(135deg,#f0fdfa,#e6fef9)", border:"1px solid #b2f5ea", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:22, height:22, background:"linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ color:"white", fontWeight:900, fontSize:11 }}>1</span>
                      </div>
                      <span style={{ fontWeight:700, fontSize:12, color:"#0d9488" }}>Download the Template</span>
                    </div>
                    <p style={{ fontSize:11, color:"#64748b", margin:"0 0 8px", lineHeight:1.5 }}>
                      Fill in: <b>Title</b>, <b>Category</b> (equipment/doctors/patients), <b>Description</b>, and image filenames <b>or</b> Cloudinary URLs.
                    </p>
                    <a href="/gallery_bulk_import_template.xlsx" download="gallery_bulk_import_template.xlsx" className="g-dl-btn">
                      <Download size={12} /> Download Excel Template
                    </a>
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:22, height:22, background:"linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"white", fontWeight:900, fontSize:11 }}>2</span>
                    </div>
                    <span style={{ fontWeight:700, fontSize:12, color:"#0d9488" }}>Upload Filled Spreadsheet</span>
                  </div>

                  {!bulkFile ? (
                    <div className={`g-bulk-drop ${bulkDragOver ? "drag" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setBulkDragOver(true); }}
                      onDragLeave={() => setBulkDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setBulkDragOver(false); handleExcelFile(e.dataTransfer.files[0]); }}>
                      <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => handleExcelFile(e.target.files[0])} />
                      <div className="g-bulk-drop-icon">
                        <FileSpreadsheet size={22} color="white" />
                      </div>
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
                        <div className="g-bulk-stats">
                          <div className="g-stat-chip" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}>
                            <Table2 size={11} /> {bulkRows.length} rows parsed
                          </div>
                          <div className="g-stat-chip" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}>
                            <CheckCircle2 size={11} /> {validRows.length} valid
                          </div>
                          {invalidRows.length > 0 && (
                            <div className="g-stat-chip" style={{ background:"#fff5f5", color:"#ef4444", border:"1px solid #fecaca" }}>
                              <AlertCircle size={11} /> {invalidRows.length} invalid
                            </div>
                          )}
                        </div>
                      )}

                      {bulkRows.length > 0 && (
                        <>
                          <div style={{ fontSize:10, fontWeight:700, letterSpacing:".5px", textTransform:"uppercase", color:"#0d9488", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
                            <Eye size={11} /> Preview — click a row to inspect
                          </div>
                          <div className="g-table-wrap">
                            <table className="g-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Status</th>
                                  <th>Title</th>
                                  <th>Category</th>
                                  <th>Featured</th>
                                  <th>Images</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bulkRows.map((row, i) => (
                                  <tr key={i} className={row.valid ? "" : "err-row"} style={{ cursor:"pointer" }} onClick={() => setPreviewRow(row)}>
                                    <td style={{ color:"#94a3b8", fontSize:10 }}>{i + 1}</td>
                                    <td>
                                      {row.valid
                                        ? <span className="g-badge ok"><CheckCircle2 size={8} /> Valid</span>
                                        : <span className="g-badge err"><X size={8} /> Error</span>}
                                    </td>
                                    <td style={{ fontWeight:600, color:"#0f172a" }}>{row.title || <span style={{ color:"#cbd5e1" }}>—</span>}</td>
                                    <td>
                                      {row.category && VALID_CATEGORIES.includes(row.category)
                                        ? <span className="g-badge ok">{row.category}</span>
                                        : <span className="g-badge err">{row.category || "—"}</span>}
                                    </td>
                                    <td>
                                      {row.featuredImage
                                        ? <span className="g-img-url">{row.featuredImage}</span>
                                        : <span style={{ color:"#fca5a5", fontSize:10 }}>missing</span>}
                                    </td>
                                    <td style={{ color:"#64748b" }}>{row.images.length} img{row.images.length !== 1 ? "s" : ""}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {invalidRows.length > 0 && (
                            <div style={{ marginTop:10, background:"#fff5f5", border:"1px solid #fecaca", borderRadius:9, padding:"10px 12px" }}>
                              <div style={{ fontWeight:700, fontSize:11, color:"#ef4444", marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
                                <AlertCircle size={12} /> Validation Issues
                              </div>
                              {invalidRows.map((row, i) => (
                                <div key={i} style={{ fontSize:10, color:"#ef4444", marginBottom:4 }}>
                                  <b>Row "{row.title || "untitled"}":</b> {row.errors.join("; ")}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      {bulkErrors.map((err, i) => (
                        <div key={i} className="g-err" style={{ marginTop:8 }}><AlertCircle size={12} /> {err}</div>
                      ))}

                      {bulkImporting && (
                        <div style={{ marginTop:10 }}>
                          <div style={{ fontSize:11, color:"#0d9488", fontWeight:600, marginBottom:4 }}>
                            Importing {bulkProgress.done} / {bulkProgress.total}...
                          </div>
                          <div className="g-progress-bar">
                            <div className="g-progress-fill" style={{ width:`${(bulkProgress.done / bulkProgress.total) * 100}%` }} />
                          </div>
                        </div>
                      )}

                      {bulkDone && (
                        <div className="g-ok" style={{ marginTop:10 }}>
                          <CheckCircle2 size={13} />
                          <span>
                            Imported {validRows.length - bulkErrors.length} of {validRows.length} items successfully!
                            {bulkErrors.length > 0 && ` (${bulkErrors.length} failed)`}
                          </span>
                        </div>
                      )}

                      {!bulkDone && validRows.length > 0 && (
                        <button className="g-submit" style={{ marginTop:14 }}
                          disabled={bulkImporting || validRows.length === 0}
                          onClick={handleBulkImport}>
                          {bulkImporting
                            ? <><Loader2 size={15} style={{ animation:"g-spin 1s linear infinite" }} /> Importing {bulkProgress.done}/{bulkProgress.total}...</>
                            : <><Upload size={15} /> Import {validRows.length} Item{validRows.length !== 1 ? "s" : ""} <ChevronRight size={13} /></>}
                        </button>
                      )}

                      {bulkDone && (
                        <button className="g-submit" style={{ marginTop:10 }} onClick={resetBulk}>
                          <RefreshCw size={14} /> Import Another File
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* ══ RIGHT CARD: GALLERY LIST ══ */}
          <div className="g-card">
            <div className="g-list-hdr">
              <div>
                <h3>All Gallery Items</h3>
                <p>{gallery.length} item{gallery.length !== 1 ? "s" : ""} in database</p>
              </div>
              <button className="g-refresh-btn" onClick={fetchGallery}>
                <RefreshCw size={11} /> Refresh
              </button>
            </div>

            <div>
              {listLoading ? (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 0" }}>
                  <Loader2 style={{ width:24, height:24, color:"#14b8a6", animation:"g-spin 1s linear infinite" }} />
                </div>
              ) : gallery.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#94a3b8", fontSize:12 }}>No gallery items yet.</div>
              ) : (
                gallery.map((item) => {
                  const cat = CATEGORIES.find((c) => c.value === item.category) || CATEGORIES[0];
                  return (
                    <div key={item.id} className="g-row">
                      <div className="g-row-thumb">
                        {item.has_featured
                          ? <img src={`${API}/gallery/${item.id}/featured`} alt={item.title} />
                          : <LayoutGrid size={16} color="#14b8a6" />}
                      </div>
                      <div className="g-row-info">
                        <div className="g-row-title">{item.title}</div>
                        <div className="g-row-cat">{item.category}</div>
                        <div className="g-row-desc">{item.description}</div>
                      </div>
                      <span className="g-pill" style={{ background:"#f0fdfa", color:"#0d9488", border:"1px solid #b2f5ea" }}>{item.imageCount || 0}img</span>
                      <span className="g-pill" style={{ background:cat.bg, color:cat.color, border:`1.5px solid ${cat.color}33` }}>{item.category}</span>
                      <button className="g-icon-btn purple" title="Manage images" onClick={() => openImgMgr(item)}><Images size={12} /></button>
                      <button className="g-icon-btn teal"   title="Edit details"   onClick={() => openEdit(item)}><Pencil size={12} /></button>
                      <button className="g-icon-btn red"    title="Delete item"    disabled={deletingId === item.id} onClick={() => handleDelete(item.id)}>
                        {deletingId === item.id ? <Loader2 size={12} style={{ animation:"g-spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ══ ROW PREVIEW MODAL ══ */}
      {previewRow && (
        <div className="g-backdrop" onClick={() => setPreviewRow(null)}>
          <div className="g-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="g-modal-hdr" style={{ background:"linear-gradient(135deg,#064e3b,#0f766e,#14b8a6)" }}>
              <div className="g-modal-hdr-info">
                <p>Row Preview</p>
                <h2>{previewRow.title || "Untitled"}</h2>
              </div>
              <button className="g-modal-close" onClick={() => setPreviewRow(null)}><X size={13} /></button>
            </div>
            <div className="g-modal-body">
              {previewRow.featuredImage && (
                <img src={previewRow.featuredImage.startsWith("http") ? previewRow.featuredImage : `/${previewRow.featuredImage}`}
                  alt="featured" className="g-preview-img" onError={(e) => { e.target.style.display = "none"; }} />
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                <span className="g-badge ok">{previewRow.category}</span>
                {previewRow.valid
                  ? <span className="g-badge ok"><CheckCircle2 size={8} /> Valid</span>
                  : <span className="g-badge err"><X size={8} /> Has errors</span>}
                <span className="g-badge ok">{previewRow.images.length} gallery images</span>
              </div>
              <p style={{ fontSize:12, color:"#475569", lineHeight:1.6, margin:"0 0 10px" }}>{previewRow.description}</p>
              {previewRow.errors.length > 0 && (
                <div style={{ background:"#fff5f5", border:"1px solid #fecaca", borderRadius:9, padding:"8px 12px", marginBottom:10 }}>
                  {previewRow.errors.map((err, i) => (
                    <div key={i} style={{ fontSize:11, color:"#ef4444", display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={10} /> {err}</div>
                  ))}
                </div>
              )}
              {previewRow.images.length > 0 && (
                <>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:".5px", textTransform:"uppercase", color:"#0d9488", marginBottom:6 }}>Gallery Images</div>
                  <div className="g-preview-imgs">
                    {previewRow.images.map((url, i) => (
                      <img key={i}
                        src={url.startsWith("http") ? url : `/${url}`}
                        alt="" onError={(e) => { e.target.style.border = "2px solid #fecaca"; }} />
                    ))}
                  </div>
                </>
              )}
              <button className="g-cancel-btn" style={{ marginTop:14, width:"100%" }} onClick={() => setPreviewRow(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {editItem && (
        <div className="g-backdrop" onClick={closeEdit}>
          <div className="g-modal" onClick={(e) => e.stopPropagation()}>
            <div className="g-modal-hdr" style={{ background:"linear-gradient(135deg,#064e3b,#0f766e,#14b8a6)" }}>
              <div className="g-modal-hdr-info"><p>Editing</p><h2>{editItem.title}</h2></div>
              <button className="g-modal-close" onClick={closeEdit}><X size={13} /></button>
            </div>
            <div className="g-modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="g-field">
                  <label className="g-lbl">Title</label>
                  <div className="g-inp-wrap">
                    <div className="g-inp-icon"><Type size={13} /></div>
                    <input type="text" className="g-inp" required maxLength={80} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  </div>
                </div>
                <div className="g-field">
                  <label className="g-lbl">Description</label>
                  <div className="g-inp-wrap">
                    <div className="g-inp-icon top"><AlignLeft size={13} /></div>
                    <textarea className="g-inp ta" maxLength={300} style={{ minHeight:72 }} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                </div>
                <div className="g-field">
                  <label className="g-lbl">Category</label>
                  <div className="g-cat-row">
                    {CATEGORIES.map((cat) => <CatChip key={cat.value} value={cat.value} form={editForm} setForm={setEditForm} />)}
                  </div>
                </div>
                <div className="g-field">
                  <label className="g-lbl">Replace Featured <span style={{ color:"#94a3b8", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  {editFeatPreview ? (
                    <div className="g-feat-prev">
                      <img src={editFeatPreview} alt="new featured" style={{ height:80 }} />
                      <div className="g-feat-overlay"><div className="g-prev-badge"><CheckCircle2 size={9} /> New image</div></div>
                      <button type="button" className="g-change-btn" onClick={() => { setEditFeatFile(null); setEditFeatPreview(null); }}><X size={10} /> Remove</button>
                    </div>
                  ) : (
                    <div className="g-upload" style={{ padding:"10px 12px" }}>
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setEditFeatFile(f); setEditFeatPreview(URL.createObjectURL(f)); } }} />
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:"#0d9488", fontSize:12, fontWeight:600 }}><ImagePlus size={14} /> Click to upload new featured image</div>
                      <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>Leave empty to keep existing</p>
                    </div>
                  )}
                </div>
                {editError   && <div className="g-err"><X size={12} /> {editError}</div>}
                {editSuccess && <div className="g-ok"><CheckCircle2 size={12} /> Updated successfully!</div>}
                <div style={{ display:"flex", gap:10 }}>
                  <button type="button" className="g-cancel-btn" onClick={closeEdit}>Cancel</button>
                  <button type="submit" className="g-submit" disabled={editLoading} style={{ flex:2, marginTop:0, padding:"9px" }}>
                    {editLoading ? <><Loader2 size={13} style={{ animation:"g-spin 1s linear infinite" }} /> Saving...</> : <><Save size={13} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══ IMAGE MANAGER MODAL ══ */}
      {imgMgrItem && (
        <div className="g-backdrop" onClick={closeImgMgr}>
          <div className="g-modal" style={{ maxWidth:540 }} onClick={(e) => e.stopPropagation()}>
            <div className="g-modal-hdr" style={{ background:"linear-gradient(135deg,#3b0764,#6d28d9,#8b5cf6)" }}>
              <div className="g-modal-hdr-info"><p>Image Manager</p><h2>{imgMgrItem.title}</h2></div>
              <button className="g-modal-close" onClick={closeImgMgr}><X size={13} /></button>
            </div>
            <div className="g-modal-body">
              {imgMgrPreviews.length > 0 && (
                <>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:".6px", textTransform:"uppercase", color:"#7c3aed", marginBottom:8 }}>Saved Images — click to mark for deletion</p>
                  <div className="g-imgmgr-grid" style={{ marginBottom:14 }}>
                    {imgMgrPreviews.map((src, i) => (
                      <div key={i} className={`g-imgmgr-cell ${toDelete.includes(i) ? "marked" : ""}`} onClick={() => toggleToDelete(i)}>
                        <img src={src} alt="" />
                      </div>
                    ))}
                  </div>
                  {toDelete.length > 0 && <p style={{ fontSize:11, color:"#ef4444", fontWeight:600, marginBottom:10 }}>⚠ {toDelete.length} image{toDelete.length !== 1 ? "s" : ""} marked for deletion</p>}
                </>
              )}
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:".6px", textTransform:"uppercase", color:"#0d9488", marginBottom:8 }}>Add New Images</p>
              {newImgPreviews.length > 0 && (
                <div className="g-imgmgr-grid" style={{ marginBottom:10 }}>
                  {newImgPreviews.map((src, i) => (
                    <div key={i} className="g-imgmgr-cell">
                      <img src={src} alt="" />
                      <button style={{ position:"absolute", top:3, right:3, width:18, height:18, background:"rgba(239,68,68,.9)", border:"none", borderRadius:"50%", color:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                        onClick={() => { setNewImgFiles(newImgFiles.filter((_,idx)=>idx!==i)); setNewImgPreviews(newImgPreviews.filter((_,idx)=>idx!==i)); }}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="g-upload" style={{ padding:"10px 12px" }}>
                <input type="file" accept="image/*" multiple onChange={(e) => { const arr = Array.from(e.target.files).filter((f) => f.type.startsWith("image/")); setNewImgFiles((p) => [...p, ...arr]); setNewImgPreviews((p) => [...p, ...arr.map((f) => URL.createObjectURL(f))]); }} />
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, color:"#0d9488", fontSize:12, fontWeight:600 }}><ImagePlus size={14} /> Click to add more images</div>
                <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>You can select multiple files at once</p>
              </div>
              {imgMgrError && <div className="g-err" style={{ marginTop:10 }}><X size={12} /> {imgMgrError}</div>}
              <div style={{ display:"flex", gap:10, marginTop:14 }}>
                <button className="g-cancel-btn" onClick={closeImgMgr}>Cancel</button>
                <button onClick={handleImgMgrSubmit}
                  disabled={imgMgrLoading || (toDelete.length === 0 && newImgFiles.length === 0)}
                  style={{ flex:2, padding:"9px", background:"linear-gradient(135deg,#3b0764,#6d28d9,#8b5cf6)", color:"white", border:"none", borderRadius:9, fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:(imgMgrLoading||(toDelete.length===0&&newImgFiles.length===0))?"not-allowed":"pointer", opacity:(imgMgrLoading||(toDelete.length===0&&newImgFiles.length===0))?.6:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                  {imgMgrLoading ? <><Loader2 size={13} style={{ animation:"g-spin 1s linear infinite" }} /> Saving...</> : <><CheckCircle2 size={13} /> Apply Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="g-toast"><CheckCircle2 size={16} /> Gallery item published successfully!</div>
      )}
      <Footer />
    </>
  );
}