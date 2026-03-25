import React, { useEffect, useState } from 'react';
import { ArrowLeft, Camera, CalendarDays, LoaderCircle, MapPin, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AuthProfileUpdate, ProfileGender } from '../types';

const GENDER_OPTIONS: ProfileGender[] = ['女', '男', '不透露'];

interface FormState extends AuthProfileUpdate {}

async function compressAvatar(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('头像读取失败，请换一张图片重试。'));
      nextImage.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('浏览器暂不支持头像处理，请稍后重试。');
    }

    const scale = Math.max(size / image.width, size / image.height);
    const targetWidth = image.width * scale;
    const targetHeight = image.height * scale;

    context.fillStyle = '#edeeef';
    context.fillRect(0, 0, size, size);
    context.drawImage(image, (size - targetWidth) / 2, (size - targetHeight) / 2, targetWidth, targetHeight);

    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function ProfileDetailsScreen() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState<FormState>({
    displayName: '',
    gender: '不透露',
    address: '',
    birthDate: '',
    avatarUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      displayName: user.displayName,
      gender: user.gender ?? '不透露',
      address: user.address ?? '',
      birthDate: user.birthDate ?? '',
      avatarUrl: user.avatarUrl ?? '',
    });
  }, [user]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatusMessage((current) => (current.type === 'error' ? { type: null, text: '' } : current));
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: '请上传 jpg、png 或 webp 图片文件。' });
      return;
    }

    setUploadingAvatar(true);
    setStatusMessage({ type: null, text: '' });

    try {
      const avatarUrl = await compressAvatar(file);
      setForm((current) => ({ ...current, avatarUrl }));
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '头像处理失败，请稍后重试。',
      });
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setStatusMessage({ type: 'error', text: '请先登录后再编辑个人资料。' });
      return;
    }

    if (!form.displayName.trim()) {
      setStatusMessage({ type: 'error', text: '请填写姓名。' });
      return;
    }

    setSaving(true);
    setStatusMessage({ type: null, text: '' });

    try {
      await updateProfile({
        displayName: form.displayName.trim(),
        gender: form.gender,
        address: form.address.trim(),
        birthDate: form.birthDate,
        avatarUrl: form.avatarUrl,
      });
      setStatusMessage({ type: 'success', text: '个人资料已保存。' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '保存失败，请稍后重试。',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#f8f9fa]/80 px-6 py-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#041920] shadow-sm transition-colors hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#396569]">Personal Info</p>
          <h1 className="font-headline text-xl font-bold tracking-tight text-[#041920]">个人资料</h1>
        </div>
        <button
          form="profile-details-form"
          type="submit"
          disabled={!user || saving || uploadingAvatar}
          className="inline-flex min-w-16 items-center justify-center rounded-full bg-[#041920] px-4 py-2 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : '保存'}
        </button>
      </header>

      <main className="mt-4 px-6">
        {!user ? (
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-[#041920]">登录后完善你的资料</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              头像、姓名和居住信息会帮助你更快完成领养申请，也方便后续审核联系。
            </p>
            <button
              type="button"
              onClick={() => navigate('/auth?redirect=/profile/details')}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#041920] px-6 font-headline font-bold text-white"
            >
              登录 / 注册
            </button>
          </section>
        ) : (
          <form id="profile-details-form" className="space-y-6" onSubmit={handleSubmit}>
            <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
              <div className="bg-[radial-gradient(circle_at_top_right,_rgba(188,235,239,0.55),_transparent_35%),linear-gradient(135deg,_rgba(243,244,245,0.95),_rgba(255,255,255,1))] px-6 py-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#bcebef] ring-4 ring-white/80">
                      {form.avatarUrl ? (
                        <img src={form.avatarUrl} alt={`${form.displayName || '用户'}头像`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-headline font-bold text-[#396569]">
                          {(form.displayName || user.displayName).slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#396569]">Profile Card</p>
                      <h2 className="mt-2 font-headline text-2xl font-bold tracking-tight text-[#041920]">
                        {form.displayName || '填写你的姓名'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">上传头像并补充基础资料，提交申请时会自动带出部分信息。</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#041920] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0b2b36]">
                      {uploadingAvatar ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      上传头像
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                    </label>
                    {form.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => updateField('avatarUrl', '')}
                        className="inline-flex items-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#396569] shadow-sm transition-colors hover:bg-[#f3f4f5]"
                      >
                        移除头像
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {statusMessage.text && (
              <div
                className={`rounded-3xl px-5 py-4 text-sm leading-6 ${
                  statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#396569]">Basic Details</p>
                <h3 className="mt-2 font-headline text-2xl font-bold tracking-tight text-[#041920]">基础信息</h3>
              </div>

              <div className="space-y-5">
                <label className="flex flex-col gap-2">
                  <span className="ml-1 text-xs font-bold text-gray-400">姓名</span>
                  <div className="flex items-center gap-3 rounded-3xl bg-[#f3f4f5] px-4 py-4">
                    <UserRound className="h-5 w-5 text-[#396569]" />
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(event) => updateField('displayName', event.target.value)}
                      placeholder="请输入姓名"
                      className="w-full bg-transparent text-sm text-[#041920] outline-none placeholder:text-gray-400"
                    />
                  </div>
                </label>

                <div className="flex flex-col gap-2">
                  <span className="ml-1 text-xs font-bold text-gray-400">性别</span>
                  <div className="grid grid-cols-3 gap-3">
                    {GENDER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('gender', option)}
                        className={`rounded-3xl px-4 py-4 text-sm font-bold transition-colors ${
                          form.gender === option ? 'bg-[#396569] text-white' : 'bg-[#f3f4f5] text-gray-500 hover:bg-[#edeeef]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="ml-1 text-xs font-bold text-gray-400">地址</span>
                  <div className="flex items-start gap-3 rounded-3xl bg-[#f3f4f5] px-4 py-4">
                    <MapPin className="mt-0.5 h-5 w-5 text-[#396569]" />
                    <textarea
                      value={form.address}
                      onChange={(event) => updateField('address', event.target.value)}
                      placeholder="请输入常住地址"
                      rows={3}
                      className="w-full resize-none bg-transparent text-sm leading-6 text-[#041920] outline-none placeholder:text-gray-400"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="ml-1 text-xs font-bold text-gray-400">出生日期</span>
                  <div className="flex items-center gap-3 rounded-3xl bg-[#f3f4f5] px-4 py-4">
                    <CalendarDays className="h-5 w-5 text-[#396569]" />
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(event) => updateField('birthDate', event.target.value)}
                      className="w-full bg-transparent text-sm text-[#041920] outline-none"
                    />
                  </div>
                </label>
              </div>
            </section>
          </form>
        )}
      </main>
    </div>
  );
}
