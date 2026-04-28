import { api } from "@/lib/api";

// 1. GET ALL COURSES (Dibutuhkan oleh Student Dashboard)
// ✅ Saya pastikan nama fungsi ini TETAP 'getCourses' sesuai kebutuhan import dashboard
export const getCourses = async () => {
  try {
    const res = await api.get("/api/teacher/courses");
    const result = res.data?.data || res.data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error getCourses:", error.message);
    return [];
  }
};

// 2. GET FULL COURSES (Nested Data untuk Teacher Course Page)
export const getFullCourses = async () => {
  try {
    const res = await api.get("/api/teacher/courses");
    const result = res.data?.data || res.data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error getFullCourses:", error.message);
    return [];
  }
};

// 3. GET SINGLE COURSE DETAIL (Join Table View)
export const getCourseById = async (id) => {
  try {
    const res = await api.get(`/api/teacher/courses/${id}`);
    return res.data?.data || res.data || null;
  } catch (error) {
    console.error("Error getCourseById:", error.message);
    return null;
  }
};

// --- OPERASI CRUD COURSE ---

export const createCourse = async (data) => {
  const res = await api.post("/api/teacher/courses", data);
  return res.data?.data || res.data;
};

export const updateCourse = async (id, data) => {
  const res = await api.put(`/api/teacher/courses/${id}`, data);
  return res.data?.data || res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/api/teacher/courses/${id}`);
  return res.data?.data || res.data;
};

// --- OPERASI CRUD MODUL & MATERI ---

export const updateModule = async (id, data) => {
  const res = await api.put(`/api/teacher/modules/${id}`, data);
  return res.data?.data || res.data;
};

export const updateMateri = async (id, data) => {
  const res = await api.put(`/api/teacher/materi/${id}`, data);
  return res.data?.data || res.data;
};

export const deleteModule = async (id) => {
  const res = await api.delete(`/api/teacher/modules/${id}`);
  return res.data;
};

export const deleteMateri = async (id) => {
  const res = await api.delete(`/api/teacher/materi/${id}`);
  return res.data;
};

// 4. GET AVAILABLE COURSES (Untuk Pretest/Posttest)
export const getAvailableCourses = async (type) => {
  try {
    const res = await api.get(`/api/courses/available-for-test?type=${type}`);
    const result = res.data?.data || res.data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error getAvailableCourses:", error.message);
    return [];
  }
};