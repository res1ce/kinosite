"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete();
    } finally {
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Подтвердить
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-500 hover:text-gray-600 text-sm font-medium"
        >
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700"
    >
      <Trash2 size={18} />
    </button>
  );
}
