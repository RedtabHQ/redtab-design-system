import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { useResetPassword } from '../hooks/useAuth';

interface FormInputs {
  password: string;
  confirmPassword: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordView: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token') || '';
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>({ mode: 'onBlur' });
  const reset = useResetPassword();

  const onSubmit = async (data: FormInputs) => {
    if (!token) return; // token required
    try {
      await reset.mutateAsync({ token, password: data.password });
      navigate('/login', { replace: true });
    } catch (err) {
      // handle error as needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-6">Choose a new password for your account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">New password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded text-sm focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-redtab focus:border-transparent'}`}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Confirm password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className={`w-full pl-4 pr-4 py-3.5 bg-gray-50 border rounded text-sm focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-redtab focus:border-transparent'}`}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-redtab text-white py-3.5 rounded font-bold text-sm hover:bg-redtab-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {isSubmitting ? 'Resetting...' : 'Reset password'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-500">
            <button onClick={() => navigate('/login')} className="text-redtab hover:underline font-semibold">Back to sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
