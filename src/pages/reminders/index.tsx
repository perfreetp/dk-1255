import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { ReminderRecord, FamilyMember } from '../../types';
import { mockReminders } from '../../data/mockData';

const RemindersPage: React.FC = () => {
  const [reminders] = useState<ReminderRecord[]>(mockReminders);
  const [activeTab, setActiveTab] = useState<'pending' | 'sent'>('pending');

  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'pending') {
      return r.status === 'pending';
    }
    return r.status === 'sent' || r.status === 'dismissed';
  });

  const pendingCount = reminders.filter(r => r.status === 'pending').length;
  const sentCount = reminders.filter(r => r.status === 'sent' || r.status === 'dismissed').length;

  const handleDismiss = (reminder: ReminderRecord) => {
    Taro.showToast({
      title: '已忽略提醒',
      icon: 'success'
    });
  };

  const handleSnooze = (reminder: ReminderRecord) => {
    Taro.showToast({
      title: '已延迟提醒',
      icon: 'success'
    });
  };

  const handleViewEvent = (reminder: ReminderRecord) => {
    Taro.navigateTo({
      url: `/pages/eventDetail/index?id=${reminder.eventId}`
    });
  };

  const formatReminderTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) {
      return '已过期';
    }

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}天${hours % 24}小时后`;
    }

    if (hours > 0) {
      return `${hours}小时${minutes}分钟后`;
    }

    return `${minutes}分钟后`;
  };

  const getStatusText = (status: ReminderRecord['status']) => {
    const texts = {
      pending: '待提醒',
      sent: '已提醒',
      dismissed: '已忽略'
    };
    return texts[status];
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.title}>提醒中心</Text>
          <Text className={styles.subtitle}>管理所有事件提醒</Text>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{pendingCount}</Text>
            <Text className={styles.statLabel}>待提醒</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{sentCount}</Text>
            <Text className={styles.statLabel}>已提醒</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{reminders.length}</Text>
            <Text className={styles.statLabel}>总提醒</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabList}>
        <View className={styles.tabBar}>
          <View
            className={`${styles.tabItem} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            待提醒 ({pendingCount})
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'sent' ? styles.active : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            历史提醒 ({sentCount})
          </View>
        </View>

        <View className={styles.reminderList}>
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => (
              <View
                key={reminder.id}
                className={`${styles.reminderCard} ${reminder.status !== 'pending' ? styles.sent : ''}`}
                style={{ '--reminder-color': reminder.event.color } as React.CSSProperties}
              >
                <View className={styles.reminderHeader}>
                  <Text className={styles.reminderTitle}>{reminder.event.title}</Text>
                  <Text className={`${styles.reminderStatus} ${styles[reminder.status]}`}>
                    {getStatusText(reminder.status)}
                  </Text>
                </View>

                <View className={styles.reminderTime}>
                  ⏰ {formatReminderTime(reminder.remindTime)}
                </View>

                <View className={styles.reminderMeta}>
                  {reminder.event.location && (
                    <Text className={styles.reminderLocation}>
                      📍 {reminder.event.location}
                    </Text>
                  )}
                  {reminder.event.startTime && (
                    <Text className={styles.reminderLocation}>
                      🕐 {reminder.event.startTime}
                    </Text>
                  )}
                </View>

                {reminder.status === 'pending' && (
                  <View className={styles.actionRow}>
                    <View
                      className={styles.actionBtn}
                      onClick={() => handleSnooze(reminder)}
                    >
                      稍后提醒
                    </View>
                    <View
                      className={styles.actionBtn}
                      onClick={() => handleDismiss(reminder)}
                    >
                      忽略
                    </View>
                    <View
                      className={`${styles.actionBtn} ${styles.primary}`}
                      onClick={() => handleViewEvent(reminder)}
                    >
                      查看详情
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🔔</Text>
              <Text className={styles.emptyText}>
                {activeTab === 'pending' ? '暂无待提醒事件' : '暂无历史提醒'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default RemindersPage;
