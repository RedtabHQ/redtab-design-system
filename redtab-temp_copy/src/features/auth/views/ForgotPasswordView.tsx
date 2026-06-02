import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { useForgotPassword } from '../hooks/useAuth';

interface FormInputs {
  email: string;
}

const ForgotPasswordView: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>({ mode: 'onBlur' });
  const forgot = useForgotPassword();

  const onSubmit = async (data: FormInputs) => {
    try {
      await forgot.mutateAsync(data.email);
      // show simple success then navigate to login
      navigate('/login', { replace: true });
    } catch (err) {
      // swallow - errors handled via hook consumer in future
      // optionally show toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your account email and we'll send you a link to reset your password.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-redtab focus:border-transparent'}`}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-redtab text-white py-3.5 rounded font-bold text-sm hover:bg-redtab-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
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

export default ForgotPasswordView;
