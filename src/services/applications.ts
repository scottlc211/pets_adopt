import { MOCK_APPLICATIONS, PETS } from '../constants';
import { dataMode } from '../lib/env';
import { supabase } from '../lib/supabase';
import type { AdoptionApplicationInput, Application, ApplicationStatus, AuthUser } from '../types';

const APPLICATIONS_STORAGE_KEY = 'pets_adopt_applications';

function formatSubmitDate(dateValue: string) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function resolveStatusColor(status: ApplicationStatus) {
  if (status === '家访预定') {
    return 'text-orange-500';
  }

  if (status === '已确认') {
    return 'text-emerald-600';
  }

  if (status === '资料待补充') {
    return 'text-amber-600';
  }

  return 'text-[#396569]';
}

function readMockApplications() {
  const raw = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(MOCK_APPLICATIONS));
    return MOCK_APPLICATIONS;
  }

  try {
    const parsed = JSON.parse(raw) as Application[];
    return parsed.length > 0 ? parsed : MOCK_APPLICATIONS;
  } catch {
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(MOCK_APPLICATIONS));
    return MOCK_APPLICATIONS;
  }
}

function writeMockApplications(applications: Application[]) {
  window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
}

function mapApplicationRecord(record: Record<string, unknown>): Application {
  const pet = (record.pet as Record<string, unknown> | null) ?? null;
  const status = (record.status as ApplicationStatus | undefined) ?? '审核中';

  return {
    id: String(record.id),
    petId: String(record.pet_id ?? ''),
    petName: String(pet?.name ?? '待匹配宠物'),
    petImageUrl: String(pet?.image_url ?? ''),
    submitDate: formatSubmitDate(String(record.created_at ?? new Date().toISOString())),
    status,
    progress: Number(record.progress ?? 20),
    statusColor: resolveStatusColor(status),
    applicantName: String(record.applicant_name ?? ''),
    applicantPhone: String(record.applicant_phone ?? ''),
    city: String(record.city ?? ''),
    housingType: (record.housing_type as Application['housingType'] | undefined) ?? 'apartment',
    hasYard: Boolean(record.has_yard),
    experienceLevel: (record.experience_level as Application['experienceLevel'] | undefined) ?? 'first-time',
    notes: String(record.notes ?? ''),
    createdBy: String(record.user_id ?? ''),
  };
}

export async function fetchApplications(userId?: string): Promise<Application[]> {
  if (!userId) {
    return [];
  }

  if (!supabase) {
    if (dataMode === 'disabled') {
      throw new Error('尚未配置 Supabase 数据源，无法读取申请记录。');
    }
    return readMockApplications().filter((application) => application.createdBy === userId);
  }

  const { data, error } = await supabase
    .from('adoption_applications')
    .select(
      'id, pet_id, user_id, applicant_name, applicant_phone, city, housing_type, has_yard, experience_level, notes, status, progress, created_at, pet:pets(name, image_url)',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`读取申请记录失败：${error.message}`);
  }

  return (data ?? []).map((record) => mapApplicationRecord(record as Record<string, unknown>));
}

export async function submitApplication(payload: AdoptionApplicationInput, user: AuthUser): Promise<Application> {
  if (!supabase) {
    if (dataMode === 'disabled') {
      throw new Error('尚未配置 Supabase 数据源，无法提交申请。');
    }

    const pet = PETS.find((item) => item.id === payload.petId);

    if (!pet) {
      throw new Error('未找到对应宠物，请重新选择后再提交。');
    }

    const currentApplications = readMockApplications();
    const nextApplication: Application = {
      id: crypto.randomUUID(),
      petId: payload.petId,
      petName: pet.name,
      petImageUrl: pet.imageUrl,
      submitDate: formatSubmitDate(new Date().toISOString()),
      status: '审核中',
      progress: 15,
      statusColor: resolveStatusColor('审核中'),
      applicantName: payload.applicantName,
      applicantPhone: payload.phone,
      city: payload.city,
      housingType: payload.housingType,
      hasYard: payload.hasYard,
      experienceLevel: payload.experienceLevel,
      notes: payload.notes,
      createdBy: user.id,
    };

    writeMockApplications([nextApplication, ...currentApplications]);
    return nextApplication;
  }

  const { data, error } = await supabase
    .from('adoption_applications')
    .insert({
      pet_id: payload.petId,
      user_id: user.id,
      applicant_name: payload.applicantName,
      applicant_phone: payload.phone,
      city: payload.city,
      housing_type: payload.housingType,
      has_yard: payload.hasYard,
      experience_level: payload.experienceLevel,
      notes: payload.notes,
      status: '审核中',
      progress: 15,
    })
    .select(
      'id, pet_id, user_id, applicant_name, applicant_phone, city, housing_type, has_yard, experience_level, notes, status, progress, created_at, pet:pets(name, image_url)',
    )
    .single();

  if (error) {
    throw new Error(`提交申请失败：${error.message}`);
  }

  return mapApplicationRecord(data as Record<string, unknown>);
}
