import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import type { AuthValidationErrors, UserProfile } from '../types/store';
import {
  enterMasukDemo,
  loginWithDemoAccount,
  registerDemoAccount,
  simulatePasswordReset,
} from '../utils/demoStore';
import {
  validateForgotPasswordEmail,
  validateLoginInput,
  validateRegisterInput,
} from '../utils/storeLogic';
import { BrandLogo } from './BrandLogo';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthScreenProps {
  onAuthenticated: (profile: UserProfile) => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<AuthValidationErrors>({});
  const [formError, setFormError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setFormError('');
    setResetMessage('');
  };

  const handleMasukDemo = () => {
    setErrors({});
    setFormError('');
    const demoUser = enterMasukDemo();
    onAuthenticated(demoUser);
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const validation = validateLoginInput(email, password);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      const profile = loginWithDemoAccount(email, password);
      onAuthenticated(profile);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Unable to sign in. Please check your credentials.'
      );
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const validation = validateRegisterInput(fullName, email, password, confirmPassword);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      const profile = registerDemoAccount(fullName, email, password);
      onAuthenticated(profile);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Unable to register demo account right now.'
      );
    }
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setResetMessage('');
    const emailErr = validateForgotPasswordEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }
    setErrors({});
    const result = simulatePasswordReset(email);
    setResetMessage(result.message);
  };

  return (
    <div
      data-testid="auth-screen"
      className="min-h-screen bg-[#164A91] flex flex-col justify-center px-4 py-8 sm:py-12 relative overflow-hidden"
    >
      {/* Subtle Architectural Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 15%, #F5A623 0%, transparent 32%), radial-gradient(circle at 85% 85%, #3B82F6 0%, transparent 38%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Branded Mobile App Intro & Instant Masuk Demo Card */}
        <div className="lg:col-span-5 text-white space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BrandLogo variant="light" size="md" />
            <span className="px-2.5 py-1 rounded-md bg-white/15 border border-white/25 font-mono text-[11px] font-bold tracking-wider uppercase text-[#F5A623]">
              MOBILE APP DEMO
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl leading-tight tracking-tight [text-wrap:balance]">
              {STORE_CONFIG.tagline}
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Welcome to the interactive <strong className="text-white">YouEdu IQMAX+</strong>{' '}
              mobile shopping app prototype. Sign in, create a local account, or jump straight in
              with <strong className="text-[#F5A623]">Masuk Demo</strong>.
            </p>
          </div>

          {/* Prominent Masuk Demo Card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5A623] text-[#0F1E36] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-white">
                  Instant Lecturer Preview
                </p>
                <p className="text-xs text-blue-100 leading-relaxed mt-0.5">
                  Explore Home, Shop, Cart, Checkout &amp; My Orders immediately with sample demo
                  data — zero personal details needed.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMasukDemo}
              data-testid="masuk-demo-button"
              className="w-full py-3.5 px-5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm tracking-wide transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Masuk Demo</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Authentication Card (Login / Register / Forgot Password) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Mode Switch Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 bg-[#F6F8FB] border-b border-slate-200 p-1.5 gap-1.5">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  data-testid="auth-tab-login"
                  className={`py-2.5 px-4 rounded-xl font-display font-bold text-sm transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#164A91] shadow-xs'
                      : 'text-slate-600 hover:text-[#164A91]'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  data-testid="auth-tab-register"
                  className={`py-2.5 px-4 rounded-xl font-display font-bold text-sm transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-[#164A91] shadow-xs'
                      : 'text-slate-600 hover:text-[#164A91]'
                  }`}
                >
                  Register / Sign Up
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-5">
              {/* Header */}
              <div className="space-y-1">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#164A91]">
                  {mode === 'login'
                    ? 'Local Account Sign In (DEMO)'
                    : mode === 'register'
                      ? 'Create Local Account (DEMO)'
                      : 'Simulated Password Reset (DEMO)'}
                </p>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F1E36]">
                  {mode === 'login'
                    ? 'Sign in to IQMAX+ App'
                    : mode === 'register'
                      ? 'Register New Account'
                      : 'Reset Your Password'}
                </h2>
                <p className="text-xs text-slate-500">
                  {mode === 'login'
                    ? 'Sign in with a previously registered demo account or tap Masuk Demo.'
                    : mode === 'register'
                      ? 'Your account stays saved locally in your browser via localStorage.'
                      : 'Enter your email address to display a simulated password reset confirmation.'}
                </p>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs text-red-700"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="auth-login-email"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-login-email"
                        data-testid="login-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                    </div>
                    {errors.email && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="auth-login-password"
                        className="block text-xs font-semibold text-slate-700"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        data-testid="forgot-password-link"
                        className="text-xs font-semibold text-[#164A91] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-login-password"
                        data-testid="login-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (min. 6 characters)"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    data-testid="login-submit-button"
                    className="w-full py-3.5 px-5 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-sm transition-colors cursor-pointer min-h-[46px]"
                  >
                    Log In
                  </button>

                  <p className="text-center text-xs text-slate-600">
                    New to IQMAX+ App?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="font-bold text-[#164A91] hover:underline cursor-pointer"
                    >
                      Register an account
                    </button>
                  </p>
                </form>
              )}

              {/* REGISTER FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="auth-register-name"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-register-name"
                        data-testid="register-name-input"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Amirah Zulkifli"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                    </div>
                    {errors.fullName && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="auth-register-email"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-register-email"
                        data-testid="register-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="amirah@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                    </div>
                    {errors.email && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="auth-register-password"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="auth-register-password"
                        data-testid="register-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                      {errors.password && (
                        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="auth-register-confirm"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="auth-register-confirm"
                        data-testid="register-confirm-input"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                      {errors.confirmPassword && (
                        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    data-testid="register-submit-button"
                    className="w-full py-3.5 px-5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm transition-colors cursor-pointer min-h-[46px] inline-flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                    <span>Register &amp; Enter App</span>
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD MODE */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
                  {resetMessage && (
                    <div
                      data-testid="forgot-password-confirmation"
                      className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-2.5 text-xs text-emerald-800 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{resetMessage}</span>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="auth-forgot-email"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <KeyRound
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-forgot-email"
                        data-testid="forgot-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91]"
                      />
                    </div>
                    {errors.email && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    data-testid="forgot-submit-button"
                    className="w-full py-3.5 px-5 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-sm cursor-pointer min-h-[46px]"
                  >
                    Simulate Password Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="w-full py-2.5 text-xs font-semibold text-[#164A91] hover:underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                Academic Demonstration Prototype · Stored locally via browser storage (DEMO)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
