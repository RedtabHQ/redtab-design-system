import React from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { getRoleDisplay, getUserStatusDisplay } from '@/utils/userHelpers';
import { formatLocalized } from '@/utils/dateFormatter';

const ProfileView: React.FC = () => {
  const user = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  const statusDisplay = getUserStatusDisplay(user.status);

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">Manage your account information and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-redtab to-red-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-white font-black text-2xl border-4 border-white/30">
              {user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-black">{user.username || 'User'}</h2>
              <p className="text-red-100 text-sm mt-1">{getRoleDisplay(user.role)}</p>
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusDisplay.colorClass} bg-white/90`}>
                  {statusDisplay.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mt-1">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-sm font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mt-1">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Role</p>
                <p className="text-sm font-semibold text-gray-900">{getRoleDisplay(user.role)}</p>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mt-1">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                <p className="text-sm font-mono text-gray-900">{user.id}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mt-1">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatLocalized(user.createdAt, 'PPPP')}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button className="flex-1 px-6 py-3 bg-redtab text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl text-sm">
              Edit Profile
            </button>
            <button className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
