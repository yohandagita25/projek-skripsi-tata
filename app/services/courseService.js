import { api } from "@/lib/api";

// 1. GET ALL COURSES (Daftar Ringkas)
export const getCourses = async () => {
  try {
    const res = await api.get("/api/teacher/courses");
    // ✅ Logic penanganan berbagai format response backend
    const result = res.data?.data || res.data;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error getCourses:", error.message);
    return [];
  }
};

// 2. GET FULL COURSES (Nested Data: Course -> Module -> Materi)
// Ini adalah fungsi utama yang dipanggil di CoursePage Bapak
export const getFullCourses = async () => {
  try {
    // ✅ Pastikan rute ini SAMA dengan yang ada di backend Railway Bapak
    // Jika backend Bapak punya rute khusus nested, gunakan itu. 
    // Jika tidak, rute /api/teacher/courses biasanya sudah me-return nested data.
    const res = await api.get("/api/teacher/courses");
    
    console.log("Cek Data dari Backend:", res.data); // Debugging di console browser

    // ✅ Logic penanganan format: res.data.data (jika dibungkus) atau res.data (jika langsung)
    const result = res.data?.data || res.data;
    
    // Pastikan hasil akhirnya adalah Array
    if (Array.isArray(result)) {
      return result;
    } else if (result && typeof result === 'object' && !Array.isArray(result)) {
      // Jika backend kirim objek tunggal padahal minta list, bungkus jadi array
      return [result];
    }
    
    return [];
  } catch (error) {
    console.error("Error getFullCourses Service:", error.message);
    return [];
  }
};

// 3. CREATE COURSE
export const createCourse = async (data) => {
  const res = await api.post("/api/teacher/courses", data);
  return res.data?.data || res.data;
};

// 4. UPDATE COURSE
export const updateCourse = async (id, data) => {
  const res = await api.put(`/api/teacher/courses/${id}`, data);
  return res.data?.data || res.data;
};

// 5. UPDATE MODULE
export const updateModule = async (id, data) => {
  const res = await api.put(`/api/teacher/modules/${id}`, data);
  return res.data?.data || res.data;
};

// 6. UPDATE MATERI
export const updateMateri = async (id, data) => {
  const res = await api.put(`/api/teacher/materi/${id}`, data);
  return res.data?.data || res.data;
};

// 7. DELETE COURSE
export const deleteCourse = async (id) => {
  const res = await api.delete(`/api/teacher/courses/${id}`);
  return res.data?.data || res.data;
};

// 8. GET AVAILABLE COURSES (Untuk Pretest/Posttest)
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