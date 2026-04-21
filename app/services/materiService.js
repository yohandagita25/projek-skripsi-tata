const BASE_URL = "http://localhost:5000/api/teacher/materi";

// GET by module
export const getMateriByModule = async (moduleId) => {
  const res = await fetch(`${BASE_URL}/${moduleId}`);
  return res.json();
};

// CREATE
export const createMateri = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// UPDATE
export const updateMateri = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// DELETE
export const deleteMateri = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};