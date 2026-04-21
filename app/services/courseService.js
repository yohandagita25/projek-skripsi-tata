const BASE_URL = "http://localhost:5000/api/teacher";

// 1. GET ALL COURSES (Ringkas)
export const getCourses = async () => {
  const res = await fetch(`${BASE_URL}/courses`, { credentials: "include" });
  return res.json();
};

// 2. GET FULL COURSES (Nested Data)
export const getFullCourses = async () => {
  const res = await fetch("http://localhost:5000/api/courses/courses-full");
  return res.json();
};

// 3. CREATE COURSE
export const createCourse = async (data) => {
  const res = await fetch(`${BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // WAJIB untuk auth
  });
  return res.json();
};

// 4. UPDATE COURSE
export const updateCourse = async (id, data) => {
  const res = await fetch(`${BASE_URL}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // WAJIB agar tidak 401 Unauthorized
  });
  return res.json();
};

// 5. UPDATE MODULE
export const updateModule = async (id, data) => {
  const res = await fetch(`${BASE_URL}/modules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // WAJIB agar tidak 401 Unauthorized
  });
  return res.json();
};

// 6. UPDATE MATERI
export const updateMateri = async (id, data) => {
  const res = await fetch(`${BASE_URL}/materi/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // WAJIB agar tidak 401 Unauthorized
  });
  return res.json();
};

// 7. DELETE COURSE (Total Cascade)
export const deleteCourse = async (id) => {
  const res = await fetch(`${BASE_URL}/courses/${id}`, {
    method: "DELETE",
    credentials: "include", // WAJIB agar tidak 401 Unauthorized
  });
  return res.json();
};

export const getAvailableCourses = async (type) => {
  const res = await fetch(`http://localhost:5000/api/courses/available-for-test?type=${type}`, { 
    credentials: "include" 
  });
  return res.json();
};