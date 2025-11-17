"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, ChevronUp, ChevronDown, Edit2, Trash2, X, Check } from "lucide-react";
import SingleImageUploader from "@/components/SingleImageUploader";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  description: string;
  order: number;
}

export default function StaffManagementClient() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    photo: "",
    description: ""
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/staff");
      if (response.ok) {
        const data = await response.json();
        setStaffMembers(data);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: "", role: "", photo: "", description: "" });
        setIsAdding(false);
        fetchStaff();
      }
    } catch (error) {
      console.error("Error adding staff member:", error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({ name: "", role: "", photo: "", description: "" });
        fetchStaff();
      }
    } catch (error) {
      console.error("Error updating staff member:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этого участника команды?")) {
      return;
    }

    try {
      const response = await fetch(`/api/staff?id=${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction })
      });

      if (response.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error("Error moving staff member:", error);
    }
  };

  const startEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      photo: member.photo || "",
      description: member.description
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: "", role: "", photo: "", description: "" });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400">Загрузка...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Управление командой
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Добавляйте и редактируйте информацию о членах команды
              </p>
            </div>
          </div>
        </div>

        {/* Add New Member Button */}
        {!isAdding && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <button
              onClick={() => setIsAdding(true)}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Добавить участника команды
              </div>
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isAdding ? "Добавить участника" : "Редактировать участника"}
              </h2>
              <button
                onClick={cancelEdit}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAdding ? handleAdd : (e) => { e.preventDefault(); editingId && handleUpdate(editingId); }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ФИО *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Роль *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="Актёр, Режиссёр, Оператор и т.д."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Фотография
                </label>
                <SingleImageUploader
                  name="photo"
                  variant="purple"
                  value={formData.photo}
                  onChange={(url) => setFormData({ ...formData, photo: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Описание *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  placeholder="Расскажите о достижениях, опыте работы и интересных фактах..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {isAdding ? "Добавить" : "Сохранить"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        {staffMembers.length > 0 ? (
          <div className="grid gap-6">
            {staffMembers.map((member, index) => (
              <div
                key={member.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="relative w-full md:w-48 h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl overflow-hidden flex-shrink-0">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {member.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-semibold rounded-full">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {member.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {/* Move buttons */}
                      <button
                        onClick={() => handleMove(member.id, "up")}
                        disabled={index === 0}
                        className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        title="Переместить вверх"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleMove(member.id, "down")}
                        disabled={index === staffMembers.length - 1}
                        className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        title="Переместить вниз"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <div className="flex-1"></div>

                      {/* Edit button */}
                      <button
                        onClick={() => startEdit(member)}
                        className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Редактировать
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
              Команда пока не сформирована
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Нажмите кнопку &quot;Добавить участника команды&quot; для начала работы
            </p>
          </div>
        )}
      </div>
    </main>
  );
}


