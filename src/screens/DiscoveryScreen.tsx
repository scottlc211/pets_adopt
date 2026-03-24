import React, { useDeferredValue, useMemo, useState } from 'react';
import { Heart, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PET_CATEGORIES } from '../constants';
import { usePets } from '../hooks/usePets';
import type { PetCategory } from '../types';

export default function DiscoveryScreen() {
  const navigate = useNavigate();
  const { pets, loading, error } = usePets();
  const [selectedCategory, setSelectedCategory] = useState<PetCategory>('dog');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filteredPets = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return pets.filter((pet) => {
      if (pet.category !== selectedCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [pet.name, pet.breed, pet.location, ...pet.tags].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [deferredSearch, pets, selectedCategory]);

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#f8f9fa]/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#041920]" />
          <span className="font-headline text-xl font-bold tracking-tight text-[#041920]">亲心宠</span>
        </div>
        <button className="rounded-full p-2 transition-colors hover:bg-black/5">
          <Search className="h-6 w-6 text-[#041920]" />
        </button>
      </header>

      <main className="mt-4 px-6">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索狗狗、猫咪、品种或地区"
            className="w-full rounded-2xl border-none bg-[#f3f4f5] py-4 pl-12 pr-4 font-medium transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#396569]/20"
          />
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold tracking-tight text-[#041920]">宠物分类</h2>
              <p className="mt-1 text-sm text-gray-500">目前开放狗狗与猫咪领养</p>
            </div>
            <span className="rounded-full bg-[#396569]/10 px-3 py-1 text-[11px] font-bold text-[#396569]">
              {filteredPets.length} 只
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto px-1 pb-1 no-scrollbar">
            {PET_CATEGORIES.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex shrink-0 flex-col items-center gap-3"
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-transform active:scale-90 ${
                      active
                        ? 'bg-[#396569] text-white shadow-lg shadow-[#396569]/10'
                        : 'bg-[#e1e3e4] text-[#041920]'
                    }`}
                  >
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <span className={`text-sm font-bold ${active ? 'text-[#041920]' : 'text-gray-500'}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="mb-1 font-headline text-3xl font-bold leading-none tracking-tighter text-[#041920]">
              精选推荐
            </h2>
            <p className="text-sm text-gray-500">为你寻找最契合的灵魂伴侣</p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="mb-4 aspect-[4/5] rounded-3xl bg-[#edeeef]" />
                  <div className="mb-2 h-6 w-40 rounded-full bg-[#edeeef]" />
                  <div className="h-4 w-28 rounded-full bg-[#edeeef]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-white p-6 text-sm text-red-500 shadow-sm">{error}</div>
          ) : filteredPets.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="font-headline text-xl font-bold text-[#041920]">暂时没有匹配结果</p>
              <p className="mt-2 text-sm text-gray-500">换个关键词，或切换到另一个分类看看。</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPets.map((pet) => (
                <motion.article
                  key={pet.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/pets/${pet.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-3xl">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-headline text-2xl font-bold text-[#041920]">{pet.name}</h3>
                      <p className="font-medium text-[#396569]">
                        {pet.breed} · {pet.age}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-[#edeeef] px-3 py-1">
                      <MapPin className="h-3 w-3 text-[#396569]" />
                      <span className="text-[10px] font-bold text-[#041920]">{pet.distance}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {pet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#bcebef] px-3 py-1 text-[10px] font-bold text-[#3f6b6f]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
