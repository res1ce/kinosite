"use client";

import { useState } from "react";
import SingleImageUploader from "@/components/SingleImageUploader";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  experience: string;
  photo: string;
  description: string;
  order: number;
}

export default function TeamMemberCard({ 
  member, 
  index, 
  totalMembers,
  moveTeamMember,
  updateTeamMember,
  deleteTeamMember
}: { 
  member: TeamMember;
  index: number;
  totalMembers: number;
  moveTeamMember: (fd: FormData) => Promise<void>;
  updateTeamMember: (fd: FormData) => Promise<void>;
  deleteTeamMember: (fd: FormData) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="group p-6 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start gap-6">
        {/* Photo */}
        <div className="flex-shrink-0">
          {member.photo ? (
            <div 
              className="w-20 h-20 bg-cover bg-center rounded-xl border-2 border-gray-200 dark:border-gray-600"
              style={{ backgroundImage: `url(${member.photo})` }}
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {member.name}
          </h4>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-1">
            {member.position}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Опыт: {member.experience}
          </p>
            <div 
            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: member.description }}
            />
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-start gap-2">
          {/* Move buttons */}
          <div className="flex flex-col gap-1">
            {index > 0 && (
              <form action={moveTeamMember}>
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  title="Переместить вверх"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </form>
            )}
            
            {index < totalMembers - 1 && (
              <form action={moveTeamMember}>
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  title="Переместить вниз"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Edit/Delete buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <form action={deleteTeamMember}>
              <input type="hidden" name="id" value={member.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm(`Удалить ${member.name} из команды?`)) {
                    e.preventDefault();
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="Удалить"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Редактирование участника
          </h5>
          
          <form action={updateTeamMember} className="space-y-4">
            <input type="hidden" name="id" value={member.id} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя и фамилия *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={member.name}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Должность *
                </label>
                <input
                  type="text"
                  name="position"
                  defaultValue={member.position}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Опыт работы *
                </label>
                <input
                  type="text"
                  name="experience"
                  defaultValue={member.experience}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Фотография
                </label>
                <SingleImageUploader 
                  name="photo" 
                  initialUrl={member.photo} 
                  variant="blue" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                defaultValue={member.description}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Сохранить изменения
              </button>
              
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Отменить
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}