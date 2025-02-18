'use client';

import { useState, useEffect } from 'react';

export interface UserFormData {
  name: string;
  email: string;
  role: 'user' | 'admin' | 'editor';
  avatar_url?: string;
  password?: string;
  confirmPassword?: string;
}

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function UserForm({ initialData, onSubmit, onCancel, isEdit = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    avatar_url: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(!isEdit);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showPasswordFields) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (formData.password && formData.password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        return;
      }
    }

    // If not updating password, remove password fields from submission
    if (!showPasswordFields) {
      const { password, confirmPassword, ...dataWithoutPassword } = formData;
      onSubmit(dataWithoutPassword);
    } else {
      onSubmit(formData);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
    setPasswordError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-200">
          Avatar URL
        </label>
        <input
          type="text"
          id="avatar_url"
          value={formData.avatar_url || ''}
          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          placeholder="https://example.com/avatar.jpg"
        />
        {formData.avatar_url && (
          <div className="mt-2">
            <img 
              src={formData.avatar_url} 
              alt="Avatar preview" 
              className="h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/img/star-placeholder.jpeg';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-200">
          Role
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as UserFormData['role'] })}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {isEdit && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
          </button>
        </div>
      )}

      {(!isEdit || showPasswordFields) && (
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              {isEdit ? 'New Password' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password || ''}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required={!isEdit || showPasswordFields}
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={handleConfirmPasswordChange}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              required={!isEdit || showPasswordFields}
              minLength={8}
            />
          </div>

          {passwordError && (
            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
          )}

          {showPasswordFields && (
            <p className="text-gray-400 text-sm mt-1">
              Password must be at least 8 characters long
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isEdit ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
} 