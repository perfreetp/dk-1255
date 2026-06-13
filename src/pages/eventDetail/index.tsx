import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { CalendarEvent } from '../../types';
import { useApp } from '../../store/AppContext';

const EventDetailPage: React.FC = () => {
  const { events, members, updateEvent, toggleEventComplete } = useApp();
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const eventId = Taro.getCurrentInstance().router?.params.id;
    if (eventId) {
      const foundEvent = events.find(e => e.id === eventId);
      setCurrentEvent(foundEvent || null);
    }
  }, [events]);

  const getMemberById = (id: string) => {
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
    if (!currentEvent) return;
    const eventData = encodeURIComponent(JSON.stringify(currentEvent));
    Taro.navigateTo({
      url: `/pages/shareConfirm/index?event=${eventData}`
    });
  };

  const handleToggleChecklist = (itemId: string) => {
    if (!currentEvent) return;
    const updatedChecklist = currentEvent.checklist?.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateEvent(currentEvent.id, { checklist: updatedChecklist });
    setCurrentEvent(prev => prev ? { ...prev, checklist: updatedChecklist } : null);
  };

  const handleToggleComplete = () => {
    if (!currentEvent) return;
    const newStatus = currentEvent.status === 'completed' ? 'pending' : 'completed';
    updateEvent(currentEvent.id, { status: newStatus });
    setCurrentEvent(prev => prev ? { ...prev, status: newStatus } : null);
  };

  if (!currentEvent) {
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
          '--event-color': currentEvent.color,
          '--event-color-light': getLightenColor(currentEvent.color)
        } as React.CSSProperties}
      >
        <View className={styles.backBtn} onClick={() => Taro.navigateBack()}>
          ←
        </View>
        <Text className={styles.eventCategory}>{getCategoryLabel(currentEvent.category)}</Text>
        <Text className={styles.eventTitle}>{currentEvent.title}</Text>
        <Text className={styles.eventTime}>
          📅 {currentEvent.date}
          {currentEvent.startTime && ` ${currentEvent.startTime}${currentEvent.endTime ? `-${currentEvent.endTime}` : ''}`}
        </Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>📝 基本信息</Text>

          {currentEvent.description && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📄</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>描述</Text>
                <Text className={styles.infoValue}>{currentEvent.description}</Text>
              </View>
            </View>
          )}

          {currentEvent.location && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>📍</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>地点</Text>
                <Text className={styles.infoValue}>{currentEvent.location}</Text>
              </View>
            </View>
          )}

          {currentEvent.reminder?.enabled && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>⏰</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>提醒</Text>
                <Text className={styles.infoValue}>
                  提前 {currentEvent.reminder.minutes >= 60 ? `${currentEvent.reminder.minutes / 60}小时` : `${currentEvent.reminder.minutes}分钟`}
                </Text>
              </View>
            </View>
          )}

          {currentEvent.repeatRule && (
            <View className={styles.infoRow}>
              <Text className={styles.infoIcon}>🔄</Text>
              <View className={styles.infoContent}>
                <Text className={styles.infoLabel}>重复</Text>
                <Text className={styles.infoValue}>
                  {currentEvent.repeatRule.type === 'daily' ? '每天' :
                   currentEvent.repeatRule.type === 'weekly' ? '每周' :
                   currentEvent.repeatRule.type === 'monthly' ? '每月' : '每年'}
                </Text>
              </View>
            </View>
          )}

          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>✓</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>状态</Text>
              <Text className={styles.infoValue}>
                {currentEvent.status === 'completed' ? '已完成' : '未完成'}
              </Text>
            </View>
            <View
              className={styles.toggleBtn}
              onClick={handleToggleComplete}
            >
              {currentEvent.status === 'completed' ? '取消完成' : '标记完成'}
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>👥 参与成员</Text>
          {currentEvent.memberIds.map((memberId) => {
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
          {currentEvent.memberIds.length === 0 && (
            <Text className={styles.emptyText}>暂无参与成员</Text>
          )}
        </View>

        {currentEvent.checklist && currentEvent.checklist.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.cardTitle}>✅ 待办清单</Text>
            <View className={styles.checklistSection}>
              {currentEvent.checklist.map((item) => (
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

        {currentEvent.photos && currentEvent.photos.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.cardTitle}>📷 相关照片</Text>
            <View className={styles.photoGrid}>
              {currentEvent.photos.map((photo, index) => (
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
          <View className={styles.editBtn} onClick={() => {
            Taro.switchTab({
              url: '/pages/event/index'
            });
          }}>
            编辑事件
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventDetailPage;
