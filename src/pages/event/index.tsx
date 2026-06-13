import React, { useState } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { EventCategory, RepeatRule, ChecklistItem, CalendarEvent } from '../../types';
import { useApp } from '../../store/AppContext';

const EventPage: React.FC = () => {
  const { addEvent, members } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('other');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [repeatType, setRepeatType] = useState<RepeatRule['type'] | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(30);
  const [photos, setPhotos] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const categories = [
    { key: 'pickup', icon: '🚗', label: '接送' },
    { key: 'medical', icon: '🏥', label: '看病' },
    { key: 'payment', icon: '💳', label: '缴费' },
    { key: 'birthday', icon: '🎂', label: '生日' },
    { key: 'anniversary', icon: '💕', label: '纪念日' },
    { key: 'meeting', icon: '📋', label: '会议' },
    { key: 'travel', icon: '✈️', label: '出行' },
    { key: 'other', icon: '📌', label: '其他' }
  ] as const;

  const repeatOptions = [
    { key: 'daily', label: '每天' },
    { key: 'weekly', label: '每周' },
    { key: 'monthly', label: '每月' },
    { key: 'yearly', label: '每年' }
  ] as const;

  const reminderOptions = [
    { value: 15, label: '提前15分钟' },
    { value: 30, label: '提前30分钟' },
    { value: 60, label: '提前1小时' },
    { value: 180, label: '提前3小时' },
    { value: 1440, label: '提前1天' }
  ];

  const getCategoryColor = (cat: EventCategory): string => {
    const colors: Record<string, string> = {
      pickup: '#45B7D1',
      medical: '#E74C3C',
      payment: '#F39C12',
      birthday: '#FF6B6B',
      anniversary: '#DDA0DD',
      meeting: '#3498DB',
      travel: '#2ECC71',
      other: '#95A5A6'
    };
    return colors[cat] || colors.other;
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleRepeatToggle = (type: RepeatRule['type']) => {
    setRepeatType(prev => prev === type ? null : type);
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist(prev => [
        ...prev,
        {
          id: `item-${Date.now()}`,
          text: newChecklistItem.trim(),
          completed: false
        }
      ]);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        setPhotos(prev => [...prev, ...tempFilePaths]);
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      Taro.showToast({
        title: '请输入事件标题',
        icon: 'none'
      });
      return;
    }

    if (!date) {
      Taro.showToast({
        title: '请选择日期',
        icon: 'none'
      });
      return;
    }

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      memberIds: selectedMembers,
      color: getCategoryColor(category),
      category,
      status: 'pending',
      repeatRule: repeatType ? {
        type: repeatType,
        interval: 1
      } : undefined,
      reminder: reminderEnabled ? {
        enabled: true,
        minutes: reminderMinutes
      } : undefined,
      photos: photos.length > 0 ? photos : undefined,
      checklist: checklist.length > 0 ? checklist : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addEvent(newEvent);

    Taro.showToast({
      title: '事件已保存',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/home/index'
      });
    }, 1500);
  };

  const handleShare = () => {
    if (!title.trim()) {
      Taro.showToast({
        title: '请先填写标题',
        icon: 'none'
      });
      return;
    }

    const tempEvent: CalendarEvent = {
      id: `temp-event-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      memberIds: selectedMembers,
      color: getCategoryColor(category),
      category,
      status: 'pending',
      repeatRule: repeatType ? {
        type: repeatType,
        interval: 1
      } : undefined,
      reminder: reminderEnabled ? {
        enabled: true,
        minutes: reminderMinutes
      } : undefined,
      photos: photos.length > 0 ? photos : undefined,
      checklist: checklist.length > 0 ? checklist : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const eventData = encodeURIComponent(JSON.stringify(tempEvent));
    Taro.navigateTo({
      url: `/pages/shareConfirm/index?event=${eventData}`
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.formCard}>
        <View className={styles.formGroup}>
          <Text className={styles.label}>
            事件标题 <Text className={styles.required}>*</Text>
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入事件标题"
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>事件描述</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请输入事件描述（可选）"
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>事件分类</Text>
          <View className={styles.categoryGrid}>
            {categories.map((cat) => (
              <View
                key={cat.key}
                className={`${styles.categoryItem} ${category === cat.key ? styles.active : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                <Text className={styles.categoryIcon}>{cat.icon}</Text>
                <Text className={styles.categoryText}>{cat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>日期和时间</Text>
          <View className={styles.dateTimeRow}>
            <Input
              className={styles.datePicker}
              type="date"
              value={date}
              onInput={(e) => setDate(e.detail.value)}
              placeholder="选择日期"
            />
            <Input
              className={styles.timePicker}
              type="time"
              value={startTime}
              onInput={(e) => setStartTime(e.detail.value)}
              placeholder="开始时间"
            />
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>地点</Text>
          <Input
            className={styles.input}
            placeholder="请输入事件地点（可选）"
            value={location}
            onInput={(e) => setLocation(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>参与成员</Text>
          <View className={styles.memberSelector}>
            {members.map((member) => (
              <View
                key={member.id}
                className={`${styles.memberItem} ${selectedMembers.includes(member.id) ? styles.selected : ''}`}
                onClick={() => handleMemberToggle(member.id)}
              >
                <Image
                  src={member.avatar}
                  className={`${styles.memberAvatar} ${selectedMembers.includes(member.id) ? styles.selected : ''}`}
                />
                <Text className={styles.memberName}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>重复规则</Text>
          <View className={styles.repeatSelector}>
            {repeatOptions.map((option) => (
              <View
                key={option.key}
                className={`${styles.repeatOption} ${repeatType === option.key ? styles.active : ''}`}
                onClick={() => handleRepeatToggle(option.key)}
              >
                {option.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <View className={styles.switchRow}>
            <Text className={styles.switchLabel}>开启提醒</Text>
            <View
              className={`${styles.switch} ${reminderEnabled ? styles.active : ''}`}
              onClick={() => setReminderEnabled(!reminderEnabled)}
            />
          </View>
          {reminderEnabled && (
            <View className={styles.repeatSelector} style={{ marginTop: 16 }}>
              {reminderOptions.map((option) => (
                <View
                  key={option.value}
                  className={`${styles.repeatOption} ${reminderMinutes === option.value ? styles.active : ''}`}
                  onClick={() => setReminderMinutes(option.value)}
                >
                  {option.label}
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>待办清单</Text>
          <View className={styles.checklistSection}>
            {checklist.map((item) => (
              <View key={item.id} className={styles.checklistItem}>
                <View
                  className={`${styles.checkbox} ${item.completed ? styles.checked : ''}`}
                  onClick={() => handleToggleChecklistItem(item.id)}
                >
                  {item.completed && '✓'}
                </View>
                <Input
                  className={styles.checklistInput}
                  value={item.text}
                  onInput={(e) => {
                    const value = e.detail.value;
                    setChecklist(prev =>
                      prev.map(i => i.id === item.id ? { ...i, text: value } : i)
                    );
                  }}
                />
                <Text onClick={() => handleDeleteChecklistItem(item.id)}>✕</Text>
              </View>
            ))}
            <View className={styles.addChecklistBtn} onClick={handleAddChecklistItem}>
              <Text className={styles.btnText}>+ 添加待办项</Text>
            </View>
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>相关照片</Text>
          <View className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image src={photo} className={styles.photo} mode="aspectFill" />
                <View className={styles.deleteBtn} onClick={() => handleDeletePhoto(index)}>
                  ✕
                </View>
              </View>
            ))}
            {photos.length < 6 && (
              <View className={styles.addPhotoBtn} onClick={handleAddPhoto}>
                <Text className={styles.icon}>+</Text>
                <Text className={styles.text}>添加照片</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleShare}>
          转发给亲友
        </View>
        <View className={styles.btnPrimary} onClick={handleSave}>
          保存事件
        </View>
      </View>
    </View>
  );
};

export default EventPage;
