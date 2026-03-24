import React from 'react';
import { ChevronRight, HelpCircle, LogOut, Settings, Shield, User, Verified } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../hooks/useApplications';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, mode, signOut } = useAuth();
  const { applications, loading, error } = useApplications(user?.id);

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      // ignore UI-only signout errors
    }
  }

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#f8f9fa]/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#041920]" />
          <span className="font-headline text-xl font-bold tracking-tight text-[#041920]">我的</span>
        </div>
        <button className="rounded-full p-2 transition-colors hover:bg-black/5">
          <Settings className="h-6 w-6 text-[#041920]" />
        </button>
      </header>

      <main className="mt-4 px-6">
        {!user ? (
          <section className="mb-10 rounded-[2rem] bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full bg-[#396569]/10 px-3 py-1 text-[11px] font-bold text-[#396569]">
              {mode === 'supabase' ? 'Supabase Auth' : mode === 'mock' ? '本地演示登录' : '待配置认证'}
            </span>
            <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-[#041920]">登录后同步你的领养进度</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {mode === 'disabled'
                ? '当前还未配置 Supabase 环境变量，接入后即可在这里保存申请记录和查看审核状态。'
                : '注册或登录后，可以保存申请记录、继续填写资料，并在这里查看审核状态。'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/auth?redirect=/profile')}
              disabled={mode === 'disabled'}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#041920] px-6 font-headline font-bold text-white"
            >
              {mode === 'disabled' ? '等待后端配置' : '登录 / 注册'}
            </button>
          </section>
        ) : (
          <section className="mb-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#bcebef] ring-4 ring-[#edeeef]">
                  <span className="font-headline text-3xl font-bold text-[#396569]">
                    {user.displayName.slice(0, 1)}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full border-2 border-white bg-[#396569] p-1.5 text-white">
                  <Verified className="h-3.5 w-3.5 fill-current" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-[#041920]">{user.displayName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">
                  注册日期：{new Date(user.registeredAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-10 grid grid-cols-3 gap-4">
          <div className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-[#f3f4f5] p-4 transition-colors hover:bg-[#edeeef]">
            <span className="font-headline text-2xl font-bold text-[#041920]">{user ? '12' : '--'}</span>
            <span className="text-xs font-medium text-gray-500">关注</span>
          </div>
          <div className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-[#bcebef] p-4 transition-colors hover:bg-[#a1cfd3]">
            <span className="font-headline text-2xl font-bold text-[#3f6b6f]">
              {user ? String(applications.length).padStart(2, '0') : '--'}
            </span>
            <span className="text-xs font-medium text-[#3f6b6f]">申请</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-[#f3f4f5] p-4 transition-colors hover:bg-[#edeeef]">
            <span className="font-headline text-2xl font-bold text-[#041920]">{user ? '48' : '--'}</span>
            <span className="text-xs font-medium text-gray-500">收藏</span>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-[#041920]">申请进度</h3>
            {user && (
              <button
                type="button"
                onClick={() => navigate('/apply')}
                className="text-sm font-bold text-[#396569]"
              >
                去申请
              </button>
            )}
          </div>

          {!user ? (
            <div className="rounded-3xl bg-white p-6 text-sm leading-6 text-gray-500 shadow-sm">
              登录后即可查看你的申请记录和后续进度。
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-3xl bg-white" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-white p-6 text-sm text-red-500 shadow-sm">{error}</div>
          ) : applications.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="font-headline text-xl font-bold text-[#041920]">还没有申请记录</p>
              <p className="mt-2 text-sm text-gray-500">从宠物详情页点击“领养我”，就会进入申请表。</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {applications.map((application) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm"
                >
                  <img
                    src={application.petImageUrl}
                    alt={application.petName}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="flex-grow">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-headline text-base font-bold text-[#041920]">{application.petName}</h4>
                        <p className="text-xs text-gray-400">提交时间：{application.submitDate}</p>
                      </div>
                      <span
                        className={`rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${application.statusColor}`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edeeef]">
                      <div
                        className={`h-full rounded-full ${
                          application.status === '家访预定'
                            ? 'bg-orange-500'
                            : application.status === '已确认'
                              ? 'bg-emerald-600'
                              : 'bg-[#396569]'
                        }`}
                        style={{ width: `${application.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-6">
          <h3 className="mb-4 font-headline text-xl font-bold text-[#041920]">账户设置</h3>
          <div className="overflow-hidden rounded-3xl bg-[#f3f4f5]">
            {[
              { icon: User, label: '个人资料', color: 'text-[#041920]', action: () => navigate(user ? '/apply' : '/auth') },
              { icon: Shield, label: '安全与隐私', color: 'text-[#041920]' },
              { icon: HelpCircle, label: '帮助与支持', color: 'text-[#041920]' },
              user
                ? { icon: LogOut, label: '退出登录', color: 'text-red-500', action: handleSignOut }
                : { icon: User, label: '登录 / 注册', color: 'text-[#396569]', action: () => navigate('/auth?redirect=/profile') },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#edeeef]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className={`font-medium ${item.color}`}>{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </section>

        <p className="mb-8 mt-12 text-center text-[10px] font-bold uppercase tracking-widest text-gray-300">
          Compassion Flow · {mode === 'supabase' ? 'Supabase' : mode === 'mock' ? 'Mock' : 'Pending Setup'}
        </p>
      </main>
    </div>
  );
}
