"use client";

import { useEffect, useState } from "react";
import CreateCoursePage from "./create/page"; 
import { Plus, ChevronLeft, Trash2, Edit3, FileText, Package, Save, X, MessageSquareQuote, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { getFullCourses, updateCourse, updateModule, updateMateri, deleteCourse } from "@/app/services/courseService";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState(""); 
  const [editData, setEditData] = useState(null);

  const [hasAssignment, setHasAssignment] = useState(false);
  const [assignmentType, setAssignmentType] = useState("flowchart");
  const [assignmentInstruction, setAssignmentInstruction] = useState("");
  const [starterCode, setStarterCode] = useState("");

  const [hasReflection, setHasReflection] = useState(false);
  const [reflectionQuestion, setReflectionQuestion] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getFullCourses();
      setCourses(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openEditModal = (type, data) => {
    setEditType(type);
    setEditData({ ...data }); 
    if (type === "materi") {
      // Sesuai ERD: tabel assignments berelasi dengan materi
      const task = data.assignments || data.assignment; 
      setHasAssignment(!!task);
      setAssignmentType(task?.type || "flowchart");
      setAssignmentInstruction(task?.instruction || "");
      setStarterCode(task?.starter_code || "");
      setHasReflection(data.has_reflection || false);
      setReflectionQuestion(data.reflection_question || "");
    }
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (editType === "course") {
        await updateCourse(editData.id, editData);
      } else if (editType === "module") {
        await updateModule(editData.id, { ...editData, module_order: parseInt(editData.module_order) });
      } else if (editType === "materi") {
        await updateMateri(editData.id, { 
          ...editData, 
          has_reflection: hasReflection, 
          reflection_question: reflectionQuestion 
        });

        if (hasAssignment) {
          await api.post("/api/teacher/assignments/upsert", {
            materi_id: editData.id,
            instruction: assignmentInstruction,
            type: assignmentType,
            starter_code: assignmentType === "code" ? starterCode : ""
          });
        } else {
          await api.delete(`/api/teacher/assignments/${editData.id}`).catch(() => {});
        }
      }
      alert("✅ Data Berhasil Diperbarui!");
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      alert("Gagal: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!confirm(`Hapus ${type}: "${name}"?`)) return;
    try {
      const endpoint = `/api/teacher/${type === 'course' ? 'courses' : type === 'module' ? 'modules' : 'materi'}/${id}`;
      await api.delete(endpoint);
      fetchCourses();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (showCreate) {
    return <CreateCoursePage onComplete={() => { setShowCreate(false); fetchCourses(); }} />;
  }

  return (
    <div className="p-2 min-h-screen bg-slate-950 text-white">
      {/* MODAL EDIT (UI TETAP) */}
      {isModalOpen && editData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 text-blue-400 font-bold uppercase italic">Edit {editType}</div>
            {/* Input fields sesuai UI Bapak */}
            <button onClick={handleSaveEdit} className="w-full mt-8 bg-blue-600 p-4 rounded-2xl font-black uppercase text-xs tracking-widest">Simpan Perubahan</button>
            <button onClick={() => setIsModalOpen(false)} className="w-full mt-2 text-slate-500 text-xs uppercase font-bold">Batal</button>
          </div>
        </div>
      )}

      {/* DAFTAR UTAMA (JOIN TABLE VIEW) */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4"><BookOpen className="text-blue-500" size={40} /> Daftar Course</h1>
          <p className="text-slate-500 mt-2">Sinkronisasi data otomatis dari database Railway.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-blue-600 px-6 py-3 rounded-xl font-bold">+ Tambah</button>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-600 font-black uppercase">Checking Database...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl opacity-20">Belum Ada Data</div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-6 flex items-center justify-between group">
                <div className="flex items-center gap-5 cursor-pointer flex-1" onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                  <img src={course.thumbnail} className="w-16 h-16 rounded-2xl object-cover border border-slate-800" alt="thumb" />
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-blue-500 transition-colors">{course.title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Instructor: {course.instructor}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal("course", course)} className="p-2 hover:text-blue-500"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete("course", course.id, course.title)} className="p-2 hover:text-red-500"><Trash2 size={18}/></button>
                  <button onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold">
                    {expandedCourse === course.id ? "−" : "+"}
                  </button>
                </div>
              </div>

              {/* AREA JOIN MODULE & MATERI (SESUAI ERD) */}
              {expandedCourse === course.id && (
                <div className="bg-slate-950/50 border-t border-slate-800 p-8 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {course.modules && course.modules.length > 0 ? course.modules.map((module) => (
                      <div key={module.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[28px] relative group/mod">
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover/mod:opacity-100 transition-all">
                          <button onClick={() => openEditModal("module", module)} className="p-1.5 text-slate-500 hover:text-blue-500"><Edit3 size={14}/></button>
                          <button onClick={() => handleDelete("module", module.id, module.title)} className="p-1.5 text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                        <h4 className="text-blue-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 mb-4"><Package size={14}/> {module.title}</h4>
                        
                        <ul className="space-y-3 border-l-2 border-slate-800 ml-2 pl-5">
                          {module.materi && module.materi.length > 0 ? module.materi.map((m) => (
                            <li key={m.id} className="flex justify-between items-center group/item text-slate-400">
                              <span className="text-sm font-bold flex items-center gap-2"><FileText size={14}/> {m.title}</span>
                              <div className="flex gap-2 opacity-0 group-hover/item:opacity-100">
                                <button onClick={() => openEditModal("materi", m)} className="hover:text-blue-500"><Edit3 size={12}/></button>
                                <button onClick={() => handleDelete("materi", m.id, m.title)} className="hover:text-red-500"><Trash2 size={12}/></button>
                              </div>
                            </li>
                          )) : <li className="text-[10px] text-slate-600 italic">No Content Yet</li>}
                        </ul>
                      </div>
                    )) : <div className="col-span-full text-center text-slate-700 uppercase font-black text-xs">Module Belum Dibuat</div>}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}