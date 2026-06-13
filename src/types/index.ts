// 家庭成员类型
export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: 'admin' | 'member';
  birthday?: string;
  anniversary?: string;
}

// 事件类型
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  memberIds: string[];
  color: string;
  repeatRule?: RepeatRule;
  photos?: string[];
  reminder?: Reminder;
  category: EventCategory;
  status: 'pending' | 'completed';
  checklist?: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

// 事件分类
export type EventCategory =
  | 'pickup'      // 接送
  | 'medical'     // 看病
  | 'payment'     // 缴费
  | 'birthday'    // 生日
  | 'anniversary' // 纪念日
  | 'meeting'     // 会议
  | 'travel'      // 出行
  | 'other';      // 其他

// 重复规则
export interface RepeatRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  endAfterCount?: number;
}

// 提醒设置
export interface Reminder {
  enabled: boolean;
  minutes: number; // 提前多少分钟
}

// 待办清单项
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  memberId?: string;
}

// 提醒记录
export interface ReminderRecord {
  id: string;
  eventId: string;
  event: CalendarEvent;
  remindTime: string;
  status: 'pending' | 'sent' | 'dismissed';
  createdAt: string;
}

// 家庭群组
export interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  createdAt: string;
}

// 分享记录
export interface ShareRecord {
  id: string;
  eventId: string;
  event: CalendarEvent;
  sharedAt: string;
  confirmStatus: 'pending' | 'confirmed' | 'rejected';
  confirmTime?: string;
  sharedTo?: string;
}
