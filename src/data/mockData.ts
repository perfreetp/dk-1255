import { FamilyMember, CalendarEvent, FamilyGroup, ReminderRecord } from '../types';

// 模拟家庭成员数据
export const mockMembers: FamilyMember[] = [
  {
    id: 'member-1',
    name: '爸爸',
    avatar: 'https://picsum.photos/id/64/200/200',
    color: '#FF6B6B',
    role: 'admin',
    birthday: '1980-05-15'
  },
  {
    id: 'member-2',
    name: '妈妈',
    avatar: 'https://picsum.photos/id/177/200/200',
    color: '#4ECDC4',
    role: 'admin',
    birthday: '1985-08-20'
  },
  {
    id: 'member-3',
    name: '小明',
    avatar: 'https://picsum.photos/id/338/200/200',
    color: '#45B7D1',
    role: 'member',
    birthday: '2015-03-10'
  },
  {
    id: 'member-4',
    name: '奶奶',
    avatar: 'https://picsum.photos/id/91/200/200',
    color: '#96CEB4',
    role: 'member',
    birthday: '1955-12-01'
  }
];

// 模拟日历事件数据
export const mockEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: '小明放学接送',
    description: '周三兴趣班结束后需要去学校接小明',
    date: '2026-06-18',
    startTime: '16:30',
    endTime: '17:00',
    location: '小明学校门口',
    memberIds: ['member-1'],
    color: '#45B7D1',
    category: 'pickup',
    status: 'pending',
    reminder: { enabled: true, minutes: 30 },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-2',
    title: '爸爸生日',
    description: '家庭聚会庆祝爸爸生日',
    date: '2026-06-15',
    memberIds: ['member-1', 'member-2', 'member-3', 'member-4'],
    color: '#FF6B6B',
    category: 'birthday',
    status: 'pending',
    reminder: { enabled: true, minutes: 1440 },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-3',
    title: '妈妈体检',
    description: '年度健康体检，需空腹',
    date: '2026-06-20',
    startTime: '09:00',
    endTime: '11:00',
    location: '市第一医院体检中心',
    memberIds: ['member-2'],
    color: '#4ECDC4',
    category: 'medical',
    status: 'pending',
    reminder: { enabled: true, minutes: 60 },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-4',
    title: '水费缴纳',
    description: '季度水费账单',
    date: '2026-06-25',
    memberIds: ['member-1', 'member-2'],
    color: '#FFEAA7',
    category: 'payment',
    status: 'pending',
    reminder: { enabled: true, minutes: 1440 },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-5',
    title: '结婚纪念日',
    description: '爸爸妈妈结婚10周年',
    date: '2026-07-01',
    memberIds: ['member-1', 'member-2'],
    color: '#DDA0DD',
    category: 'anniversary',
    status: 'pending',
    reminder: { enabled: true, minutes: 1440 },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-6',
    title: '周末家庭出游',
    description: '去郊外野餐烧烤',
    date: '2026-06-21',
    startTime: '10:00',
    endTime: '16:00',
    location: '东湖公园',
    memberIds: ['member-1', 'member-2', 'member-3', 'member-4'],
    color: '#98D8C8',
    category: 'travel',
    status: 'pending',
    reminder: { enabled: true, minutes: 180 },
    checklist: [
      { id: 'item-1', text: '准备食材', completed: false },
      { id: 'item-2', text: '购买饮料', completed: false },
      { id: 'item-3', text: '带上野餐垫', completed: true },
      { id: 'item-4', text: '准备户外玩具', completed: false }
    ],
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-7',
    title: '小明家长会',
    description: '期末家长会',
    date: '2026-06-19',
    startTime: '15:00',
    endTime: '16:30',
    location: '小明学校多功能厅',
    memberIds: ['member-1', 'member-2'],
    color: '#45B7D1',
    category: 'meeting',
    status: 'pending',
    reminder: { enabled: true, minutes: 60 },
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'event-8',
    title: '物业费缴纳',
    description: '月度物业费',
    date: '2026-06-22',
    memberIds: ['member-1'],
    color: '#F7DC6F',
    category: 'payment',
    status: 'completed',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  }
];

// 模拟家庭群组
export const mockFamilyGroup: FamilyGroup = {
  id: 'family-1',
  name: '幸福一家',
  members: mockMembers,
  createdAt: '2026-01-01T00:00:00Z'
};

// 模拟提醒记录
export const mockReminders: ReminderRecord[] = [
  {
    id: 'reminder-1',
    eventId: 'event-1',
    event: mockEvents[0],
    remindTime: '2026-06-18T16:00:00Z',
    status: 'pending',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'reminder-2',
    eventId: 'event-2',
    event: mockEvents[1],
    remindTime: '2026-06-14T00:00:00Z',
    status: 'sent',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'reminder-3',
    eventId: 'event-3',
    event: mockEvents[2],
    remindTime: '2026-06-20T08:00:00Z',
    status: 'pending',
    createdAt: '2026-06-01T10:00:00Z'
  }
];
