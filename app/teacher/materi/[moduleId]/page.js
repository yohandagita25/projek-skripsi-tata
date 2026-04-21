"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getMateriByModule,
  createMateri,
  updateMateri,
  deleteMateri,
} from "@/app/services/materiService";

export default function MateriPage() {
  const { moduleId } = useParams();

  const [materi, setMateri] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    video_url: "",
    order_number: "",
  });

  const [editingId, setEditingId] = useState(null);

  // LOAD DATA
  const fetchMateri = async () => {
    const data = await getMateriByModule(moduleId);
    setMateri(data);
  };

  useEffect(() => {
    if (moduleId) fetchMateri();
  }, [moduleId]);

  // INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      module_id: moduleId,
    };

    if (editingId) {
      await updateMateri(editingId, payload);
    } else {
      await createMateri(payload);
    }

    setForm({
      title: "",
      content: "",
      video_url: "",
      order_number: "",
    });

    setEditingId(null);
    fetchMateri();
  };

  // EDIT
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteMateri(id);
    fetchMateri();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Materi Module ID: {moduleId}
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          name="title"
          placeholder="Judul"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="content"
          placeholder="Isi materi"
          value={form.content}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="video_url"
          placeholder="YouTube URL"
          value={form.video_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="order_number"
          placeholder="Urutan"
          value={form.order_number}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          {editingId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-4">
        {materi.map((m) => (
          <div key={m.id} className="border p-4">
            <h2 className="font-bold">{m.title}</h2>
            <p>{m.content}</p>

            {/* VIDEO */}
            {m.video_url && (
              <iframe
                width="100%"
                height="200"
                src={m.video_url.replace("watch?v=", "embed/")}
              ></iframe>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(m)}
                className="bg-yellow-500 text-white px-2"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(m.id)}
                className="bg-red-500 text-white px-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}