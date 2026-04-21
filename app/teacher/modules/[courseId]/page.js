"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ModulesPage() {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");

  const fetchModules = async () => {
    const res = await fetch(
      `http://localhost:5000/api/teacher/modules/${courseId}`
    );
    const data = await res.json();
    setModules(data);
  };

  useEffect(() => {
    if (courseId) fetchModules();
  }, [courseId]);

  const createModule = async () => {
    await fetch("http://localhost:5000/api/teacher/modules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: Number(courseId),
        title,
        module_order: Number(order),
      }),
    });

    setTitle("");
    setOrder("");
    fetchModules();
  };

  const deleteModule = async (id) => {
    await fetch(`http://localhost:5000/api/teacher/modules/${id}`, {
      method: "DELETE",
    });

    fetchModules();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Manage Modules (Course {courseId})
      </h1>

      {/* FORM */}
      <div className="flex gap-2">
        <input
          placeholder="Module title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-800 px-3 py-2 rounded-lg"
        />

        <input
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="bg-slate-800 px-3 py-2 rounded-lg w-24"
        />

        <button
          onClick={createModule}
          className="bg-blue-600 px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {modules.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 p-4 rounded-lg flex justify-between"
          >
            <span>
              {m.module_order}. {m.title}
            </span>

            <button
              onClick={() => deleteModule(m.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}