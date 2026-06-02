import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Moon,
  Sun,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/common/LanguageSelector';

const SettingsView: React.FC = () => {
  const { t } = useTranslation('admin');
  const { t: tCommon } = useTranslation('common');

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false,
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          {t('settings')}
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          {t('manageSettings')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <Globe size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {t('language.title')}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('language.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <LanguageSelector showLabel={false} />
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {t('notifications.title')}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('notifications.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('notifications.email')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('notifications.emailDesc')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-redtab"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('notifications.push')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('notifications.pushDesc')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) =>
                    setNotifications({ ...notifications, push: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-redtab"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 bg-purple-50 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {t('privacy.title')}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('privacy.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('privacy.profileVisibility')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('privacy.profileVisibilityDesc')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, profileVisible: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-redtab"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <EyeOff size={18} className="text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('privacy.activityVisibility')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('privacy.activityVisibilityDesc')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.activityVisible}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, activityVisible: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-redtab"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('privacy.twoFactor')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('privacy.twoFactorDesc')}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-redtab text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors">
                {tCommon('enable')}
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 bg-amber-50 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {t('appearance.title')}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('appearance.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-redtab bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'light'
                        ? 'bg-redtab text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Sun size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('appearance.lightMode')}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-redtab bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-redtab text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Moon size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {t('appearance.darkMode')}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button className="px-8 py-3 border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm">
            {tCommon('resetToDefaults')}
          </button>
          <button className="px-8 py-3 bg-redtab text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl text-sm">
            {tCommon('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
