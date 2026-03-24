import type {
  Application,
  AuthUser,
  ExperienceLevel,
  HousingType,
  Message,
  Pet,
  PetCategory,
} from './types';

export const PET_CATEGORIES: Array<{ id: PetCategory; name: string; icon: string }> = [
  { id: 'dog', name: '狗狗', icon: '🐕' },
  { id: 'cat', name: '猫咪', icon: '🐈' },
];

export const PETS: Pet[] = [
  {
    id: '1',
    category: 'dog',
    name: '布鲁诺',
    breed: '金毛寻回犬',
    age: '2岁',
    gender: '公',
    weight: '28 kg',
    vaccinated: true,
    location: '上海市，徐汇区流浪动物保护中心',
    distance: '2.4 km',
    tags: ['已接种疫苗', '活泼亲人'],
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    story:
      '布鲁诺曾在郊外流浪，经过救助后逐渐恢复了安全感。他喜欢奔跑、玩接球，也很享受安静地趴在脚边陪伴人。',
    healthStatus: '已完成体检与体内外驱虫，身体状况稳定。',
    neuteredStatus: '已绝育，恢复良好。',
    requirements: ['在上海有稳定住所，物业允许养犬', '承诺科学喂养，不离不弃', '同意接受定期线上回访'],
  },
  {
    id: '2',
    category: 'cat',
    name: '露娜',
    breed: '英国短毛猫',
    age: '1岁',
    gender: '母',
    weight: '4.5 kg',
    vaccinated: true,
    location: '上海市，静安区宠物领养站',
    distance: '0.8 km',
    tags: ['已驱虫', '安静乖巧'],
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    story:
      '露娜是一只很会观察人的猫咪，熟悉环境后会主动靠近，也喜欢在窗边安静地晒太阳。',
    healthStatus: '身体健康，基础疫苗已补齐。',
    neuteredStatus: '已绝育。',
    requirements: ['封窗领养', '按时接种疫苗', '不离不弃'],
  },
  {
    id: '3',
    category: 'dog',
    name: '小麦',
    breed: '柯基犬',
    age: '10个月',
    gender: '母',
    weight: '11 kg',
    vaccinated: true,
    location: '上海市，浦东新区宠物之家',
    distance: '4.2 km',
    tags: ['爱玩具', '亲小朋友'],
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
    story:
      '小麦活力十足，喜欢和人互动，对陌生环境适应速度快，很适合有时间陪伴的家庭。',
    healthStatus: '定期体检，状态良好。',
    neuteredStatus: '已完成绝育预约，近期可安排手术。',
    requirements: ['每天有稳定遛狗时间', '接受基础训练', '家庭成员达成一致'],
  },
  {
    id: '4',
    category: 'cat',
    name: '年糕',
    breed: '狸花猫',
    age: '2岁',
    gender: '公',
    weight: '5.1 kg',
    vaccinated: true,
    location: '上海市，杨浦区流浪猫救助站',
    distance: '3.1 km',
    tags: ['亲人', '适应力强'],
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800',
    story:
      '年糕很擅长和人建立信任，进入家庭后往往能很快找到自己的小角落，情绪稳定。',
    healthStatus: '驱虫完成，无慢性病史。',
    neuteredStatus: '已绝育。',
    requirements: ['可接受定期复诊', '封窗并做好防坠措施', '承诺长期陪伴'],
  },
];

export const MESSAGES: Message[] = [
  {
    id: '1',
    senderName: '避难所助手 Sarah',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    lastMessage: '您申请领养的小狗“Cookie”资料已审核通过，下一步可以预约线下见面了。',
    time: '10:45 AM',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '2',
    senderName: '资深护理员 张老师',
    avatarUrl: 'https://i.pravatar.cc/150?u=zhang',
    lastMessage: '关于幼猫喂养的注意事项我已经发到您的邮箱了，请查收。',
    time: '昨天',
    unreadCount: 0,
  },
  {
    id: '3',
    senderName: '领养社区管理员',
    avatarUrl: '',
    lastMessage: '欢迎加入我们的温暖大家庭！这里有领养后的经验分享指南。',
    time: '周二',
    unreadCount: 0,
    isSystem: true,
  },
];

export const MOCK_USER: AuthUser = {
  id: 'mock-user-1',
  email: 'demo@qinxin.pet',
  displayName: '苏语诺',
  registeredAt: '2023-11-18T09:00:00.000Z',
  city: '上海',
  source: 'mock',
};

export const MOCK_PASSWORD = '12345678';

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    petId: '1',
    petName: '布鲁诺',
    petImageUrl: PETS[0].imageUrl,
    submitDate: '2024.05.12',
    status: '审核中',
    progress: 45,
    statusColor: 'text-[#396569]',
    applicantName: '苏语诺',
    applicantPhone: '13800138000',
    city: '上海',
    housingType: 'apartment',
    hasYard: false,
    experienceLevel: 'experienced',
    notes: '我长期在家办公，希望给布鲁诺稳定陪伴。',
    createdBy: MOCK_USER.id,
  },
];

export const HOUSING_OPTIONS: Array<{ value: HousingType; label: string }> = [
  { value: 'apartment', label: '公寓' },
  { value: 'villa', label: '别墅' },
  { value: 'rental', label: '租房' },
];

export const EXPERIENCE_OPTIONS: Array<{ value: ExperienceLevel; label: string; description: string }> = [
  { value: 'first-time', label: '第一次尝试', description: '需要更多饲养指导和入门陪跑。' },
  { value: 'experienced', label: '资深宠主', description: '有稳定养宠经验，能快速完成适应与照料。' },
];
