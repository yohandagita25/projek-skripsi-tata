import { api } from "@/lib/api";

// 1. GET ALL COURSES (Ringkas)
export const getCourses = async () => {
  const res = await api.get("/teacher/courses");
  return res.json();
};

// 2. GET FULL COURSES (Nested Data)
export const getFullCourses = async () => {
  const res = await api.get("/courses/courses-full");
  return res.json();
};

// 3. CREATE COURSE
export const createCourse = async (data) => {
  const res = await await api.post("/teacher/courses", data);
  return res.json();
};

// 4. UPDATE COURSE
export const updateCourse = async (id, data) => {
  // ✅ ID dimasukkan ke URL, data sebagai body
  const res = await api.put(`/teacher/courses/${id}`, data);
  return res.data;
};

// 5. UPDATE MODULE
export const updateModule = async (id, data) => {
  // ✅ Jauh lebih ringkas tanpa headers dan stringify
  const res = await api.put(`/teacher/modules/${id}`, data);
  return res.data;
};

// 6. UPDATE MATERI
export const updateMateri = async (id, data) => {
  const res = await api.put(`/teacher/materi/${id}`, data);
  return res.data;
};

// 7. DELETE COURSE
export const deleteCourse = async (id) => {
  const res = await api.delete(`/teacher/courses/${id}`);
  return res.data;
};

// 8. GET AVAILABLE COURSES
export const getAvailableCourses = async (type) => {
  // ✅ Ganti http://localhost dengan rute API relatif
  const res = await api.get(`/courses/available-for-test?type=${type}`);
  return res.data;
};