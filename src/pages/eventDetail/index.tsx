import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { CalendarEvent, FamilyMember } from '../../types';
import { mockEvents, mockMembers } from '../../data/mockData';

const EventDetailPage: React.FC = () => {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [members] = useState<FamilyMember[]>(mockMembers);

  useEffect(() => {
    const eventId = Taro.getCurrentInstance().router?.params.id;
    if (eventId) {
      const foundEvent = mockEvents.find(e => e.id === eventId);
      setEvent(foundEvent || null);
    }
  }, []);

  const getMemberById = (id: string): FamilyMember | undefined => {
    return members.find(m => m.id === id);
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      pickup: '🚗 接送',
      medical: '🏥 看病',
      payment: '💳 缴费',
      birthday: '🎂 生日',
      anniversary: '💕 纪念日',
      meeting: '📋 会议',
      travel: '✈️ 出行',
      other: '📌 其他'
    };
    return labels[category] || '📌 其他';
  };

  const getLightenColor = (color: string): string => {
    return color + '80';
  };

  const handleShare = () => {
    Taro.navigateTo({
      url: '/pages/shareConfirm/index'
    });
  };

  const handleEdit = () => {
    Taro.switchTab({
      url: '/pages/event/index'
    });
  };

  const handleToggleChecklist = (itemId: string) => {
    if (!event) return;
    setEvent({
      ...event,
      checklist: event.checklist?.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  if (!event) {
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <View className={styles.card}>
            <Text>事件不存在</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View
        className={styles.header}
        style={{
          '--event-color': event.color,
          '--event-color-light': getLightenColor(event.color)
        } as React.CSSProperties}
      >
        <View className={styles.backBtn} onClick={() => Taro.navigateBack()}>
          ←
        </View>
        <Text className={styles.eventCategory}>{getCategoryLabel(event.category)}</Text>
        <Text className={styles.eventTitle}>{event.title}</Text>
        <Text className={styles.eventTime}>
          📅 {event.date}
          {event.startTime && ` ${event.startTime}${event.endTime ? `-${event.endTime}` : ''}`}
        </Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>📝 基本信息</Text>

          {event.description && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📄</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>描述</Text>
                <Text className={styles.infoValue}>{event.description}</Text>
              </View>
            </View>
          )}

          {event.location && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📍</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>地点</Text>
                <Text className={styles.infoValue}>{event.location}</Text>
              </View>
            </View>
          )}

          {event.reminder?.enabled && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>⏰</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>提醒</Text>
                <Text className={styles.infoValue}>
                  提前 {event.reminder.minutes >= 60 ? `${event.reminder.minutes / 60}小时` : `${event.reminder.minutes}分钟`}
                </Text>
              </View>
            </View>
          )}

          {event.repeatRule && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>🔄</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>重复</Text>
                <Text className={styles.infoValue}>
                  {event.repeatRule.type === 'daily' ? '每天' :
                   event.repeatRule.type === 'weekly' ? '每周' :
                   event.repeatRule.type === 'monthly' ? '每月' : '每年'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>👥 参与成员</Text>
          {event.memberIds.map((memberId) => {
            const member = getMemberById(memberId);
            if (!member) return null;
            return (
              <View key={memberId} className={styles.memberRow}>
                <Image
                  src={member.avatar}
                  className={styles.memberAvatar}
                  style={{ '--member-color': member.color } as React.CSSProperties}
                />
                <View className={styles.infoContent}>
                  <Text className={styles.memberName}>{member.name}</Text>
                  <Text className={styles.memberRole}>
                    {member.role === 'admin' ? '管理员' : '成员'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {event.checklist && event.checklist.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.cardTitle}>✅ 待办清单</Text>
            <View className={styles.checklistSection}>
              {event.checklist.map((item) => (
                <View key={item.id} className={styles.checklistItem}>
                  <View
                    className={`${styles.checkbox} ${item.completed ? styles.checked : ''}`}
                    onClick={() => handleToggleChecklist(item.id)}
                  >
                    {item.completed && '✓'}
                  </View>
                  <Text className={`${styles.checklistText} ${item.completed ? styles.completed : ''}`}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {event.photos && event.photos.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.cardTitle}>📷 相关照片</Text>
            <View className={styles.photoGrid}>
              {event.photos.map((photo, index) => (
                <View key={index} className={styles.photoItem}>
                  <Image src={photo} className={styles.photo} mode="aspectFill" />
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.actionRow}>
          <View className={styles.shareBtn} onClick={handleShare}>
            转发给亲友
          </View>
          <View className={styles.editBtn} onClick={handleEdit}>
            编辑事件
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventDetailPage;
