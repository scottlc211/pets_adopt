import React, { useEffect, useState } from 'react';
import { Heart, Home, Key, MapPin, ShieldCheck, Trees, UserRoundPen } from 'lucide-react';
import { motion } from 'motion/react';
import { EXPERIENCE_OPTIONS, HOUSING_OPTIONS } from '../constants';
import type { AdoptionApplicationInput, AuthUser, DataMode, ExperienceLevel, HousingType, Pet } from '../types';

interface FormState {
  applicantName: string;
  phone: string;
  city: string;
  housingType: HousingType | '';
  hasYard: boolean;
  experienceLevel: ExperienceLevel | '';
  notes: string;
  agreement: boolean;
}

interface ApplicationFormScreenProps {
  pet: Pet | null;
  petLoading: boolean;
  user: AuthUser | null;
  mode: DataMode;
  submitting: boolean;
  submitMessage: { type: 'success' | 'error' | null; text: string };
  onSubmit: (payload: AdoptionApplicationInput) => Promise<void>;
  onOpenAuth: () => void;
  onBrowsePets: () => void;
}

type FormErrors = Partial<Record<keyof FormState | 'pet' | 'auth', string>>;

const housingIcons = {
  apartment: MapPin,
  villa: Home,
  rental: Key,
};

export default function ApplicationFormScreen({
  pet,
  petLoading,
  user,
  mode,
  submitting,
  submitMessage,
  onSubmit,
  onOpenAuth,
  onBrowsePets,
}: ApplicationFormScreenProps) {
  const [form, setForm] = useState<FormState>({
    applicantName: '',
    phone: '',
    city: '',
    housingType: '',
    hasYard: false,
    experienceLevel: '',
    notes: '',
    agreement: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      applicantName: current.applicantName || user.displayName,
      city: current.city || user.city || '',
    }));
  }, [user]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!pet) {
      nextErrors.pet = '请先从宠物详情页选择想申请的毛孩子。';
    }

    if (!user) {
      nextErrors.auth = '请先登录或注册，再提交领养申请。';
    }

    if (!form.applicantName.trim()) {
      nextErrors.applicantName = '请填写申请人姓名。';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = '请填写手机号。';
    } else if (!/^1\d{10}$/.test(form.phone.trim())) {
      nextErrors.phone = '请输入正确的 11 位手机号。';
    }

    if (!form.city.trim()) {
      nextErrors.city = '请填写当前居住城市。';
    }

    if (!form.housingType) {
      nextErrors.housingType = '请选择当前住房类型。';
    }

    if (!form.experienceLevel) {
      nextErrors.experienceLevel = '请选择你的养宠经验。';
    }

    if (!form.notes.trim()) {
      nextErrors.notes = '请简单说明你的领养计划。';
    } else if (form.notes.trim().length < 12) {
      nextErrors.notes = '领养计划至少写 12 个字，方便我们了解你的准备情况。';
    }

    if (!form.agreement) {
      nextErrors.agreement = '提交前请确认你理解并接受领养回访。';
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !pet) {
      return;
    }

    await onSubmit({
      petId: pet.id,
      applicantName: form.applicantName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      housingType: form.housingType,
      hasYard: form.hasYard,
      experienceLevel: form.experienceLevel,
      notes: form.notes.trim(),
    });
  }

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#f8f9fa]/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-[#041920]" />
          <span className="font-headline text-xl font-bold tracking-tight text-[#041920]">领养申请</span>
        </div>
        <button
          type="button"
          onClick={onBrowsePets}
          className="rounded-full bg-[#396569]/10 px-4 py-2 text-xs font-bold text-[#396569] transition-colors hover:bg-[#396569]/15"
        >
          继续探索
        </button>
      </header>

      <main className="mt-4 px-6">
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#f3f4f5] p-6">
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#396569]">
                  Adoption Desk
                </span>
                <h1 className="font-headline text-3xl font-bold tracking-tight text-[#041920]">确认你的领养申请</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                  填好基础资料后，我们会尽快安排回访和后续沟通，让匹配过程更顺畅。
                </p>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#041920] text-white">
                <UserRoundPen className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#bcebef] opacity-50 blur-3xl" />
          </div>
        </section>

        {!user && (
          <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-headline text-lg font-bold text-[#041920]">先登录，申请进度才能同步保存</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  当前为
                  {mode === 'supabase' ? ' Supabase ' : mode === 'mock' ? '本地演示 ' : ' 未配置后端 '}
                  模式，登录后可持续跟踪审核状态。
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                disabled={mode === 'disabled'}
                className="rounded-2xl bg-[#041920] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a2e35]"
              >
                {mode === 'disabled' ? '等待配置' : '登录 / 注册'}
              </button>
            </div>
          </section>
        )}

        {petLoading ? (
          <div className="mb-8 h-32 animate-pulse rounded-3xl bg-[#edeeef]" />
        ) : pet ? (
          <section className="mb-8 rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={pet.imageUrl} alt={pet.name} className="h-24 w-24 rounded-3xl object-cover" />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#bcebef] px-3 py-1 text-[11px] font-bold text-[#3f6b6f]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  已选择申请对象
                </span>
                <h2 className="mt-3 font-headline text-2xl font-bold text-[#041920]">{pet.name}</h2>
                <p className="text-sm font-medium text-[#396569]">
                  {pet.breed} · {pet.age}
                </p>
                <p className="mt-2 text-sm text-gray-500">{pet.location}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
            <p className="font-headline text-xl font-bold text-[#041920]">还没有选择宠物</p>
            <p className="mt-2 text-sm text-gray-500">从详情页点击“领养我”后，会自动把目标宠物带到这里。</p>
          </section>
        )}

        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
          {(errors.pet || errors.auth || submitMessage.text) && (
            <div
              className={`rounded-3xl p-5 text-sm leading-6 ${
                submitMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {errors.pet || errors.auth || submitMessage.text}
            </div>
          )}

          <section className="space-y-5">
            <div>
              <h3 className="font-headline text-2xl font-bold text-[#041920]">基础资料</h3>
              <p className="mt-1 text-sm text-gray-500">请填写真实信息，方便志愿者尽快联系你。</p>
            </div>
            <div className="grid gap-4">
              <label className="flex flex-col gap-2">
                <span className="ml-2 text-xs font-bold text-gray-400">姓名 *</span>
                <input
                  type="text"
                  value={form.applicantName}
                  onChange={(event) => updateField('applicantName', event.target.value)}
                  placeholder="输入真实姓名"
                  className={`rounded-2xl bg-white px-4 py-4 text-[#041920] ring-1 transition-all ${
                    errors.applicantName ? 'ring-rose-300' : 'ring-gray-100 focus:ring-2 focus:ring-[#041920]'
                  }`}
                />
                {errors.applicantName && <span className="ml-2 text-sm text-rose-500">{errors.applicantName}</span>}
              </label>

              <label className="flex flex-col gap-2">
                <span className="ml-2 text-xs font-bold text-gray-400">手机号 *</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="输入 11 位手机号"
                  className={`rounded-2xl bg-white px-4 py-4 text-[#041920] ring-1 transition-all ${
                    errors.phone ? 'ring-rose-300' : 'ring-gray-100 focus:ring-2 focus:ring-[#041920]'
                  }`}
                />
                {errors.phone && <span className="ml-2 text-sm text-rose-500">{errors.phone}</span>}
              </label>

              <label className="flex flex-col gap-2">
                <span className="ml-2 text-xs font-bold text-gray-400">所在城市 *</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  placeholder="例如：上海"
                  className={`rounded-2xl bg-white px-4 py-4 text-[#041920] ring-1 transition-all ${
                    errors.city ? 'ring-rose-300' : 'ring-gray-100 focus:ring-2 focus:ring-[#041920]'
                  }`}
                />
                {errors.city && <span className="ml-2 text-sm text-rose-500">{errors.city}</span>}
              </label>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <h3 className="font-headline text-2xl font-bold text-[#041920]">居住环境</h3>
              <p className="mt-1 text-sm text-gray-500">帮助我们判断居住条件是否适合当前宠物。</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {HOUSING_OPTIONS.map((option) => {
                const Icon = housingIcons[option.value];
                const active = form.housingType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField('housingType', option.value)}
                    className={`rounded-2xl p-4 text-center transition-all active:scale-95 ${
                      active ? 'bg-[#bcebef] text-[#3f6b6f]' : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mx-auto mb-2 h-6 w-6" />
                    <span className="text-xs font-bold">{option.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.housingType && <span className="ml-2 text-sm text-rose-500">{errors.housingType}</span>}

            <div className="flex items-center justify-between rounded-2xl bg-[#f3f4f5] p-4">
              <div className="flex items-center gap-3">
                <Trees className="h-5 w-5 text-[#041920]" />
                <span className="text-sm font-medium text-[#041920]">是否有院子？</span>
              </div>
              <div className="flex rounded-full bg-[#e1e3e4] p-1">
                <button
                  type="button"
                  onClick={() => updateField('hasYard', true)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    form.hasYard ? 'bg-white shadow-sm' : 'text-gray-400'
                  }`}
                >
                  是
                </button>
                <button
                  type="button"
                  onClick={() => updateField('hasYard', false)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    !form.hasYard ? 'bg-white shadow-sm' : 'text-gray-400'
                  }`}
                >
                  否
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <h3 className="font-headline text-2xl font-bold text-[#041920]">养宠经验</h3>
              <p className="mt-1 text-sm text-gray-500">我们会根据经验程度提供不同的入门支持。</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {EXPERIENCE_OPTIONS.map((option) => {
                const active = form.experienceLevel === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateField('experienceLevel', option.value)}
                    className={`rounded-3xl p-5 text-left shadow-sm transition-colors ${
                      active ? 'bg-[#041920] text-white' : 'bg-white text-[#041920]'
                    }`}
                  >
                    <p className="font-headline text-lg font-bold">{option.label}</p>
                    <p className={`mt-2 text-sm leading-6 ${active ? 'text-white/75' : 'text-gray-500'}`}>
                      {option.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
            {errors.experienceLevel && <span className="ml-2 text-sm text-rose-500">{errors.experienceLevel}</span>}
          </section>

          <section className="space-y-5">
            <div>
              <h3 className="font-headline text-2xl font-bold text-[#041920]">领养计划</h3>
              <p className="mt-1 text-sm text-gray-500">简单说说你为什么想领养它，以及日常陪伴安排。</p>
            </div>
            <label className="flex flex-col gap-2">
              <textarea
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                rows={5}
                placeholder="例如：我已经准备好猫砂盆/狗笼，工作日晚上和周末都能稳定陪伴，也接受回访。"
                className={`rounded-3xl bg-white px-4 py-4 text-[#041920] ring-1 transition-all ${
                  errors.notes ? 'ring-rose-300' : 'ring-gray-100 focus:ring-2 focus:ring-[#041920]'
                }`}
              />
              {errors.notes && <span className="ml-2 text-sm text-rose-500">{errors.notes}</span>}
            </label>

            <label className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <input
                type="checkbox"
                checked={form.agreement}
                onChange={(event) => updateField('agreement', event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#041920] accent-[#041920]"
              />
              <span className="text-sm leading-6 text-gray-600">
                我理解领养后需要持续科学喂养，并接受必要的回访与健康追踪。
              </span>
            </label>
            {errors.agreement && <span className="ml-2 text-sm text-rose-500">{errors.agreement}</span>}
          </section>

          <div className="pb-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#041920] to-[#396569] font-headline text-lg font-bold text-white shadow-lg shadow-[#041920]/20 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? '提交中...' : '确认申请'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
