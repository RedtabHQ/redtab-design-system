import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { InlineSpinner } from '../Spinner';

interface LoginFormInputs {
  email: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export const AuthPage = () => {
  const { t } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      twoFactorCode: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError('');

    try {
      // Simulate login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Login attempt:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('loginFailed');
      setServerError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-redtab to-redtab-dark p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="w-10 h-10 rounded-lg bg-redtab flex items-center justify-center">
                <span className="text-white font-bold text-lg">RT</span>
              </div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold tracking-tight">Redtab Credit</div>
              <div className="text-sm text-red-100 font-medium">SNPL Platform</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                {t('platformTitle')}
              </h1>
              <p className="text-red-100 text-lg leading-relaxed">
                {t('platformDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
                <div className="text-red-100 text-sm font-medium">{t('stats.totalDisbursed')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-red-100 text-sm font-medium">{t('stats.activeMerchants')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">98.5%</div>
                <div className="text-red-100 text-sm font-medium">{t('stats.recoveryRate')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">&lt;2s</div>
                <div className="text-red-100 text-sm font-medium">{t('stats.avgDecisionTime')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-red-100 text-sm">
          {t('copyright')}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-9 h-9 rounded-lg bg-redtab flex items-center justify-center">
                <span className="text-white font-bold">RT</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">Redtab Pay</div>
              <div className="text-xs text-gray-500 font-medium">SNPL Platform</div>
            </div>
          </div>

          {/* Login card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('welcomeBack')}</h2>
              <p className="text-gray-500">{t('signInToAccessDashboard')}</p>
            </div>

            {serverError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">{t('authenticationError')}</p>
                  <p className="text-sm text-red-700 mt-1">{serverError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                  {t('emailAddress')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@redtab.xyz"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-redtab focus:border-transparent'
                    }`}
                    {...register('email', {
                      required: tValidation('email.required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: tValidation('email.invalid'),
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-900">
                    {t('password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs text-redtab hover:text-redtab-dark font-semibold transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('enterYourPassword')}
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200 focus:ring-redtab focus:border-transparent'
                    }`}
                    {...register('password', {
                      required: tValidation('password.required'),
                      minLength: {
                        value: 6,
                        message: tValidation('password.minLength', { count: 6 }),
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 text-redtab border-gray-300 rounded focus:ring-redtab focus:ring-2"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  {t('keepMeSignedIn')}
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-redtab text-white py-3.5 rounded font-bold text-sm hover:bg-redtab-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <InlineSpinner size="md" variant="white" />
                    {t('signingIn')}
                  </span>
                ) : (
                  t('signIn')
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">{t('demoCredentials')}</p>
              <div className="text-xs text-gray-600 space-y-1 font-mono">
                <p>Email: admin@redtab.xyz</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {t('needHelp')} <button className="text-redtab hover:text-redtab-dark font-semibold transition-colors">{t('contactSupport')}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
