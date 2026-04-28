import { api } from "@/lib/api";

// 1. GET ALL COURSES (Untuk daftar ringkas)
export const getCourses = async () => {
  try {
    const res = await api.get("/api/teacher/courses");
    // Axios otomatis memparsing JSON, data ada di res.data
    return res.data?.data || res.data || [];
  } catch (error) {
    console.error("Error getCourses:", error);
    return [];
  }
};

// 2. GET FULL COURSES (Ini kunci agar Module & Materi muncul!)
export const getFullCourses = async () => {
  try {
    // ✅ FIX: Gunakan rute /api/teacher/courses karena biasanya 
    // rute ini di backend sudah di-include dengan module & materi.
    const res = await api.get("/api/teacher/courses");
    
    // Unwrapping data agar selalu mengembalikan array
    const result = res.data?.data || res.data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error getFullCourses:", error.message);
    return [];
  }
};

// 3. CREATE COURSE
export const createCourse = async (data) => {
  // ✅ Menggunakan instance api: Otomatis kirim cookie & JSON headers
  const res = await api.post("/api/teacher/courses", data);
  return res.data;
};

// 4. UPDATE COURSE
export const updateCourse = async (id, data) => {
  const res = await api.put(`/api/teacher/courses/${id}`, data);
  return res.data;
};

// 5. UPDATE MODULE
export const updateModule = async (id, data) => {
  const res = await api.put(`/api/teacher/modules/${id}`, data);
  return res.data;
};

// 6. UPDATE MATERI
export const updateMateri = async (id, data) => {
  const res = await api.put(`/api/teacher/materi/${id}`, data);
  return res.data;
};

// 7. DELETE COURSE (Total Cascade)
export const deleteCourse = async (id) => {
  const res = await api.delete(`/api/teacher/courses/${id}`);
  return res.data;
};

// 8. GET AVAILABLE COURSES (Untuk Pretest/Posttest)
export const getAvailableCourses = async (type) => {
  try {
    const res = await api.get(`/api/courses/available-for-test?type=${type}`);
    return res.data?.data || res.data || [];
  } catch (error) {
    console.error("Error getAvailableCourses:", error);
    return [];
  }
};