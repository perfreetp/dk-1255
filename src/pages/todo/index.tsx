import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { CalendarEvent } from '../../types';
import { useApp } from '../../store/AppContext';

const TodoPage: React.FC = () => {
  const { events, members, toggleEventComplete } = useApp();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        dayName: i === 0 ? '今天' : `周${weekDays[date.getDay()]}`,
        dayDate: date.getDate(),
        dateStr: date.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const weekDays = getWeekDays();
  const todayDateStr = weekDays[selectedDayIndex].dateStr;

  const todayEvents = useMemo(() => {
    const dayEvents = events.filter(event => event.date === todayDateStr);
    return dayEvents;
  }, [events, todayDateStr]);

  const pendingEvents = todayEvents.filter(e => e.status === 'pending');
  const completedEvents = todayEvents.filter(e => e.status === 'completed');

  const getMemberById = (id: string) => {
    return members.find(m => m.id === id);
  };

  const handleToggleComplete = (event: CalendarEvent, e: any) => {
    e.stopPropagation();
    toggleEventComplete(event.id);
  };

  const handleEventClick = (event: CalendarEvent) => {
    Taro.navigateTo({
      url: `/pages/eventDetail/index?id=${event.id}`
    });
  };

  const handleAddTodo = () => {
    Taro.switchTab({
      url: '/pages/event/index'
    });
  };

  const getCategoryColor = (category: string): string => {
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
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      pickup: '接送',
      medical: '看病',
      payment: '缴费',
      birthday: '生日',
      anniversary: '纪念日',
      meeting: '会议',
      travel: '出行',
      other: '其他'
    };
    return labels[category] || '其他';
  };

  const getChecklistProgress = (event: CalendarEvent) => {
    if (!event.checklist || event.checklist.length === 0) return null;
    const completed = event.checklist.filter(item => item.completed).length;
    const total = event.checklist.length;
    const percentage = (completed / total) * 100;
    return { completed, total, percentage };
  };

  const renderEventCard = (event: CalendarEvent) => {
    const progress = getChecklistProgress(event);
    const color = getCategoryColor(event.category);

    return (
      <View
        key={event.id}
        className={`${styles.todoCard} ${event.status === 'completed' ? styles.completed : ''}`}
        style={{ '--todo-color': color } as React.CSSProperties}
        onClick={() => handleEventClick(event)}
      >
        {progress && (
          <View
            className={styles.checklistBadge}
            style={{ backgroundColor: color }}
          >
            {progress.completed}/{progress.total}
          </View>
        )}

        <View className={styles.todoHeader}>
          <View
            className={`${styles.checkbox} ${event.status === 'completed' ? styles.checked : ''}`}
            onClick={(e) => handleToggleComplete(event, e)}
          >
            {event.status === 'completed' && <Text className={styles.checkMark}>✓</Text>}
          </View>

          <View className={styles.todoContent}>
            <Text className={`${styles.todoTitle} ${event.status === 'completed' ? styles.completedTitle : ''}`}>
              {event.title}
            </Text>
            <View className={styles.todoMeta}>
              <Text
                className={styles.todoTag}
                style={{ color: event.status === 'completed' ? '#95A5A6' : color } as React.CSSProperties}
              >
                {getCategoryLabel(event.category)}
              </Text>
              {event.startTime && (
                <Text className={styles.todoTime}>{event.startTime}</Text>
              )}
              {event.location && (
                <Text className={styles.todoTime}>📍 {event.location}</Text>
              )}
            </View>

            {progress && (
              <>
                <View className={styles.progressBar}>
                  <View
                    className={styles.progress}
                    style={{ width: `${progress.percentage}%`, backgroundColor: color } as React.CSSProperties}
                  />
                </View>
                <Text className={styles.progressText}>
                  完成 {progress.completed}/{progress.total} 项
                </Text>
              </>
            )}
          </View>

          {event.memberIds.length > 0 && (
            <View className={styles.memberAvatars}>
              {event.memberIds.slice(0, 2).map((memberId) => {
                const member = getMemberById(memberId);
                return member ? (
                  <Image
                    key={memberId}
                    src={member.avatar}
                    className={styles.todoMember}
                  />
                ) : null;
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.title}>本周待办</Text>
          <Text className={styles.subtitle}>家庭成员的日程安排</Text>
        </View>
      </View>

      <View className={styles.weekNav}>
        <View className={styles.weekNavInner}>
          {weekDays.map((day, index) => (
            <View
              key={day.dateStr}
              className={`${styles.dayItem} ${selectedDayIndex === index ? styles.active : ''}`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <Text className={styles.dayName}>{day.dayName}</Text>
              <Text className={styles.dayDate}>{day.dayDate}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.todoSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {selectedDayIndex === 0 ? '今日待办' : `${weekDays[selectedDayIndex].dayName}待办`}
          </Text>
          <View className={styles.filterBtn} onClick={() => setShowCompleted(!showCompleted)}>
            <Text>{showCompleted ? '隐藏已完成' : '显示已完成'}</Text>
          </View>
        </View>

        {todayEvents.length > 0 ? (
          <View className={styles.todoList}>
            {pendingEvents.length > 0 && (
              <>
                <Text className={styles.subsectionTitle}>待完成 ({pendingEvents.length})</Text>
                {pendingEvents.map(renderEventCard)}
              </>
            )}

            {showCompleted && completedEvents.length > 0 && (
              <>
                <Text className={styles.subsectionTitle}>已完成 ({completedEvents.length})</Text>
                {completedEvents.map(renderEventCard)}
              </>
            )}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>✅</Text>
            <Text className={styles.emptyText}>今日暂无待办事项</Text>
          </View>
        )}
      </View>

      <View className={styles.fab} onClick={handleAddTodo}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  );
};

export default TodoPage;
