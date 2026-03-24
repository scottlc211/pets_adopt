import { PETS } from '../constants';
import { dataMode } from '../lib/env';
import { supabase } from '../lib/supabase';
import type { Pet } from '../types';

function mapPetRecord(record: Record<string, unknown>): Pet {
  return {
    id: String(record.id),
    category: record.category === 'cat' ? 'cat' : 'dog',
    name: String(record.name),
    breed: String(record.breed),
    age: String(record.age),
    gender: record.gender === '母' ? '母' : '公',
    weight: String(record.weight),
    vaccinated: Boolean(record.vaccinated),
    location: String(record.location),
    distance: String(record.distance),
    tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
    imageUrl: String(record.image_url ?? record.imageUrl),
    story: String(record.story),
    healthStatus: String(record.health_status ?? record.healthStatus),
    neuteredStatus: String(record.neutered_status ?? record.neuteredStatus),
    requirements: Array.isArray(record.requirements) ? record.requirements.map(String) : [],
  };
}

export async function fetchPets(): Promise<Pet[]> {
  if (!supabase) {
    if (dataMode === 'disabled') {
      throw new Error('尚未配置 Supabase 数据源，请补充环境变量后再试。');
    }
    return PETS;
  }

  const { data, error } = await supabase
    .from('pets')
    .select(
      'id, category, name, breed, age, gender, weight, vaccinated, location, distance, tags, image_url, story, health_status, neutered_status, requirements',
    )
    .in('category', ['dog', 'cat'])
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`加载宠物数据失败：${error.message}`);
  }

  return (data ?? []).map((record) => mapPetRecord(record as Record<string, unknown>));
}

export async function fetchPetById(petId: string): Promise<Pet | null> {
  if (!supabase) {
    if (dataMode === 'disabled') {
      throw new Error('尚未配置 Supabase 数据源，请补充环境变量后再试。');
    }
    return PETS.find((pet) => pet.id === petId) ?? null;
  }

  const { data, error } = await supabase
    .from('pets')
    .select(
      'id, category, name, breed, age, gender, weight, vaccinated, location, distance, tags, image_url, story, health_status, neutered_status, requirements',
    )
    .eq('id', petId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`读取宠物详情失败：${error.message}`);
  }

  return mapPetRecord(data as Record<string, unknown>);
}
