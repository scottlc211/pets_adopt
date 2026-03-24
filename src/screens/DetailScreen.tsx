import React from 'react';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  Scissors,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Pet } from '../types';

interface DetailScreenProps {
  pet: Pet | null;
  loading: boolean;
  onBack: () => void;
  onApply: (pet: Pet) => void;
}

export default function DetailScreen({ pet, loading, onBack, onApply }: DetailScreenProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-6">
        <div className="mb-6 h-96 animate-pulse rounded-[2rem] bg-[#edeeef]" />
        <div className="mb-4 h-8 w-40 animate-pulse rounded-full bg-[#edeeef]" />
        <div className="h-5 w-72 animate-pulse rounded-full bg-[#edeeef]" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="font-headline text-2xl font-bold text-[#041920]">没有找到这个毛孩子</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">这条详情可能已经下线，或者当前数据源还没有同步到它。</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#041920] px-6 font-headline font-bold text-white"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      <header className="relative h-[400px] w-full overflow-hidden">
        <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-6">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-xl transition-all hover:bg-black/40 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-xl transition-all hover:bg-black/40 active:scale-95"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-[#f8f9fa] to-transparent" />
      </header>

      <main className="relative -mt-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-[#041920]">{pet.name}</h1>
              <p className="mt-1 text-lg font-medium text-[#396569]">{pet.breed}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#bcebef] px-4 py-1.5 text-sm font-bold text-[#3f6b6f]">
              <ShieldCheck className="h-4 w-4" />
              待领养
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 text-[#396569]" />
            <span>{pet.location}</span>
          </div>
        </motion.div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f3f4f5] p-5 text-center">
            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">年龄</span>
            <span className="text-lg font-bold text-[#041920]">{pet.age}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f3f4f5] p-5 text-center">
            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">性别</span>
            <span className="text-lg font-bold text-[#041920]">{pet.gender}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f3f4f5] p-5 text-center">
            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">体重</span>
            <span className="text-lg font-bold text-[#041920]">{pet.weight}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#bcebef]/30 p-5 text-center">
            <span className="mb-1 text-xs font-bold uppercase tracking-widest text-[#3f6b6f]">已接种疫苗</span>
            <span className="text-lg font-bold text-[#396569]">{pet.vaccinated ? '是' : '否'}</span>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 font-headline text-2xl font-bold text-[#041920]">性格与故事</h2>
          <div className="space-y-4 leading-relaxed text-gray-600">
            <p>{pet.story}</p>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <div className="flex items-start gap-4 rounded-3xl bg-[#edeeef] p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#396569]/10 text-[#396569]">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-[#041920]">健康状况</h3>
              <p className="text-sm leading-relaxed text-gray-500">{pet.healthStatus}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-3xl bg-[#edeeef] p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#396569]/10 text-[#396569]">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-[#041920]">绝育状态</h3>
              <p className="text-sm leading-relaxed text-gray-500">{pet.neuteredStatus}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-headline text-2xl font-bold text-[#041920]">领养要求</h2>
          <ul className="space-y-4">
            {pet.requirements.map((requirement) => (
              <li key={requirement} className="flex items-center gap-3 rounded-2xl bg-[#f3f4f5] p-4">
                <CheckCircle2 className="h-5 w-5 text-[#396569]" />
                <span className="font-medium text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 z-50 flex w-full items-center gap-4 border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-2xl">
        <button
          type="button"
          className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-[#bcebef] text-[#3f6b6f] transition-colors hover:bg-[#a1cfd3] active:scale-95"
        >
          <MessageCircle className="h-6 w-6 fill-current" />
        </button>
        <button
          type="button"
          onClick={() => onApply(pet)}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#041920] font-headline text-lg font-bold text-white shadow-lg shadow-[#041920]/20 transition-all hover:bg-[#1a2e35] active:scale-[0.98]"
        >
          领养我
          <Heart className="h-5 w-5" />
        </button>
      </footer>
    </div>
  );
}
