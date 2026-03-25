export type PetCategory = 'dog' | 'cat';
export type HousingType = 'apartment' | 'villa' | 'rental';
export type ExperienceLevel = 'first-time' | 'experienced';
export type ApplicationStatus = '审核中' | '资料待补充' | '家访预定' | '已确认';
export type DataMode = 'supabase' | 'mock' | 'disabled';
export type ProfileGender = '女' | '男' | '不透露';

export interface Pet {
  id: string;
  category: PetCategory;
  name: string;
  breed: string;
  age: string;
  gender: '公' | '母';
  weight: string;
  vaccinated: boolean;
  location: string;
  distance: string;
  tags: string[];
  imageUrl: string;
  story: string;
  healthStatus: string;
  neuteredStatus: string;
  requirements: string[];
}

export interface Message {
  id: string;
  senderName: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline?: boolean;
  isSystem?: boolean;
}

export interface Application {
  id: string;
  petId: string;
  petName: string;
  petImageUrl: string;
  submitDate: string;
  status: ApplicationStatus;
  progress: number;
  statusColor: string;
  applicantName: string;
  applicantPhone: string;
  city: string;
  housingType: HousingType;
  hasYard: boolean;
  experienceLevel: ExperienceLevel;
  notes: string;
  createdBy: string;
}

export interface AdoptionApplicationInput {
  petId: string;
  applicantName: string;
  phone: string;
  city: string;
  housingType: HousingType;
  hasYard: boolean;
  experienceLevel: ExperienceLevel;
  notes: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  registeredAt: string;
  city?: string;
  avatarUrl?: string;
  gender?: ProfileGender;
  address?: string;
  birthDate?: string;
  source: DataMode;
}

export interface AuthProfileUpdate {
  displayName: string;
  gender: ProfileGender;
  address: string;
  birthDate: string;
  avatarUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  displayName?: string;
}
