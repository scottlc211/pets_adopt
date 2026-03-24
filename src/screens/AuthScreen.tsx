import React, { useMemo, useState } from 'react';
import { ArrowLeft, HeartHandshake, LoaderCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_PASSWORD, MOCK_USER } from '../constants';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';
type FormErrors = Partial<Record<'displayName' | 'email' | 'password', string>>;

export default function AuthScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, mode } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>((searchParams.get('mode') as AuthMode) || 'login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | null; text: string }>({
    type: null,
    text: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(() => searchParams.get('redirect') || '/profile', [searchParams]);

  function validate() {
    const nextErrors: FormErrors = {};

    if (authMode === 'register' && !displayName.trim()) {
      nextErrors.displayName = '请输入你的称呼或姓名。';
    }

    if (!email.trim()) {
      nextErrors.email = '请输入邮箱地址。';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = '请输入有效的邮箱地址。';
    }

    if (!password.trim()) {
      nextErrors.password = '请输入密码。';
    } else if (password.trim().length < 6) {
      nextErrors.password = '密码至少需要 6 位字符。';
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStatusMessage({ type: null, text: '' });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      if (authMode === 'login') {
        await signIn({ email: email.trim(), password: password.trim() });
        navigate(redirectTo, { replace: true });
      } else {
        const result = await signUp({
          email: email.trim(),
          password: password.trim(),
          displayName: displayName.trim(),
        });

        if (result.requiresEmailConfirmation) {
          setStatusMessage({
            type: 'success',
            text: '注册成功，请先前往邮箱完成确认，再回来登录。',
          });
          setAuthMode('login');
        } else {
          navigate(redirectTo, { replace: true });
        }
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '认证失败，请稍后重试。',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(4,25,32,0.08)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative overflow-hidden bg-[#041920] px-8 py-8 text-white lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(188,235,239,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(57,101,105,0.8),_transparent_40%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Link to="/explore" className="text-sm font-bold text-white/80 transition-colors hover:text-white">
                返回探索
              </Link>
            </div>

            <div className="mt-16 lg:mt-24">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
                Welcome Back
              </span>
              <h1 className="mt-5 font-headline text-4xl font-bold leading-tight tracking-tight">
                让每一次登录，都离一个温暖的家更近一点。
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                注册后可同步申请资料、跟进审核状态，也能在不同设备继续你的领养流程。
              </p>
            </div>

            <div className="mt-auto space-y-4 pt-10">
              <div className="flex items-start gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur">
                <HeartHandshake className="mt-1 h-5 w-5 shrink-0 text-[#bcebef]" />
                <div>
                  <p className="font-bold">申请记录同步</p>
                  <p className="mt-1 text-sm text-white/70">登录后，宠物申请和审核状态会持续保存在你的账户下。</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#bcebef]" />
                <div>
                  <p className="font-bold">
                    {mode === 'supabase' ? 'Supabase 认证' : mode === 'mock' ? '本地演示认证' : '等待后端配置'}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    {mode === 'supabase'
                      ? '已接入 Supabase Auth，可直接配置正式环境。'
                      : mode === 'mock'
                        ? '当前未配置 Supabase，登录信息会保存在浏览器本地。'
                        : '已关闭本地 mock，请补充 Supabase 环境变量后再启用登录。'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto flex h-full max-w-md flex-col">
            <div className="mb-8 flex rounded-2xl bg-[#f3f4f5] p-1">
              {([
                ['login', '登录'],
                ['register', '注册'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAuthMode(value);
                    setErrors({});
                    setStatusMessage({ type: null, text: '' });
                  }}
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                    authMode === value ? 'bg-white text-[#041920] shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-[#041920]">
                {authMode === 'login' ? '登录你的账户' : '创建新账户'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {authMode === 'login'
                  ? '继续查看你的领养申请状态。'
                  : '填写基础信息，马上开始提交领养申请。'}
              </p>
            </div>

            {mode === 'mock' && (
              <div className="mb-6 rounded-3xl bg-[#f3f4f5] p-4 text-sm leading-6 text-gray-600">
                <p className="font-bold text-[#041920]">本地演示账号</p>
                <p>邮箱：{MOCK_USER.email}</p>
                <p>密码：{MOCK_PASSWORD}</p>
              </div>
            )}

            {mode === 'disabled' && (
              <div className="mb-6 rounded-3xl bg-amber-50 p-4 text-sm leading-6 text-amber-700">
                当前已关闭本地 mock。请先配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。
              </div>
            )}

            {statusMessage.text && (
              <div
                className={`mb-6 rounded-3xl p-4 text-sm leading-6 ${
                  statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {authMode === 'register' && (
                <label className="flex flex-col gap-2">
                  <span className="ml-2 text-xs font-bold text-gray-400">称呼 / 姓名 *</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => {
                      setDisplayName(event.target.value);
                      setErrors((current) => ({ ...current, displayName: undefined }));
                    }}
                    className={`rounded-2xl bg-[#f8f9fa] px-4 py-4 ring-1 transition-all ${
                      errors.displayName ? 'ring-rose-300' : 'ring-transparent focus:ring-2 focus:ring-[#041920]'
                    }`}
                    placeholder="输入你的称呼"
                  />
                  {errors.displayName && <span className="ml-2 text-sm text-rose-500">{errors.displayName}</span>}
                </label>
              )}

              <label className="flex flex-col gap-2">
                <span className="ml-2 text-xs font-bold text-gray-400">邮箱 *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({ ...current, email: undefined }));
                  }}
                  className={`rounded-2xl bg-[#f8f9fa] px-4 py-4 ring-1 transition-all ${
                    errors.email ? 'ring-rose-300' : 'ring-transparent focus:ring-2 focus:ring-[#041920]'
                  }`}
                  placeholder="name@example.com"
                />
                {errors.email && <span className="ml-2 text-sm text-rose-500">{errors.email}</span>}
              </label>

              <label className="flex flex-col gap-2">
                <span className="ml-2 text-xs font-bold text-gray-400">密码 *</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((current) => ({ ...current, password: undefined }));
                  }}
                  className={`rounded-2xl bg-[#f8f9fa] px-4 py-4 ring-1 transition-all ${
                    errors.password ? 'ring-rose-300' : 'ring-transparent focus:ring-2 focus:ring-[#041920]'
                  }`}
                  placeholder="至少 6 位字符"
                />
                {errors.password && <span className="ml-2 text-sm text-rose-500">{errors.password}</span>}
              </label>

              <button
                type="submit"
                disabled={submitting || mode === 'disabled'}
                className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#041920] font-headline text-lg font-bold text-white transition-colors hover:bg-[#1a2e35] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
                {authMode === 'login' ? '登录并继续' : '注册并继续'}
              </button>
            </form>

            <p className="mt-auto pt-8 text-sm leading-6 text-gray-400">
              继续操作即表示你同意以真实信息提交领养申请，并接受必要回访。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
