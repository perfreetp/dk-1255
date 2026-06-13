import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { CalendarEvent, FamilyMember } from '../../types';
import { mockEvents, mockMembers } from '../../data/mockData';

const HomePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [members] = useState<FamilyMember[]>(mockMembers);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(formatDate(today));
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMonthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const days: Array<{ date: Date | null; dateStr: string }> = [];

    // 填充上月的空白
    for (let i = 0; i < startWeekday; i++) {
      const prevDate = new Date(year, month, -startWeekday + i + 1);
      days.push({ date: null, dateStr: '' });
    }

    // 填充当月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, dateStr: formatDate(date) });
    }

    return {
      year,
      month: month + 1,
      days
    };
  }, [currentDate]);

  const todayStr = useMemo(() => formatDate(new Date()), []);

  const selectedEvents = useMemo(() => {
    return events.filter(event => event.date === selectedDate);
  }, [events, selectedDate]);

  const getEventsForDate = (dateStr: string): CalendarEvent[] => {
    return events.filter(event => event.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (dateStr: string) => {
    if (dateStr) {
      setSelectedDate(dateStr);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    Taro.navigateTo({
      url: `/pages/eventDetail/index?id=${event.id}`
    });
  };

  const handleAddEvent = () => {
    Taro.switchTab({
      url: '/pages/event/index'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getFormatDate = () => {
    const date = new Date();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日 ${weekDay}`;
  };

  const getMemberById = (id: string): FamilyMember | undefined => {
    return members.find(m => m.id === id);
  };

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.greeting}>{getGreeting()}，家人</Text>
          <Text className={styles.date}>{getFormatDate()}</Text>
        </View>
      </View>

      <View className={styles.calendarContainer}>
        <View className={styles.calendarCard}>
          <View className={styles.monthHeader}>
            <Text className={styles.monthTitle}>
              {getMonthData.year}年 {monthNames[getMonthData.month - 1]}
            </Text>
            <View className={styles.navButtons}>
              <View className={styles.navBtn} onClick={handlePrevMonth}>{'<'}</View>
              <View className={styles.navBtn} onClick={handleNextMonth}>{'>'}</View>
            </View>
          </View>

          <View className={styles.weekdayRow}>
            {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
              <Text key={index} className={styles.weekday}>{day}</Text>
            ))}
          </View>

          <View className={styles.daysGrid}>
            {getMonthData.days.map((day, index) => {
              if (!day.date) {
                return <View key={`empty-${index}`} className={`${styles.dayCell} ${styles.empty}`} />;
              }

              const isToday = day.dateStr === todayStr;
              const isSelected = day.dateStr === selectedDate;
              const dayEvents = getEventsForDate(day.dateStr);
              const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();

              return (
                <View
                  key={day.dateStr}
                  className={`
                    ${styles.dayCell}
                    ${isToday ? styles.today : ''}
                    ${isSelected && !isToday ? styles.selected : ''}
                    ${!isCurrentMonth ? styles.otherMonth : ''}
                  `}
                  onClick={() => handleDateClick(day.dateStr)}
                >
                  <Text className={styles.dayText}>{day.date.getDate()}</Text>
                  {dayEvents.length > 0 && (
                    <View className={styles.eventDots}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <View
                          key={i}
                          className={styles.eventDot}
                          style={{ backgroundColor: event.color }}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className={styles.eventsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {selectedDate === todayStr ? '今日日程' : '该日日程'}
          </Text>
          <Text className={styles.viewAll}>查看全部</Text>
        </View>

        {selectedEvents.length > 0 ? (
          selectedEvents.map((event) => (
            <View
              key={event.id}
              className={styles.eventCard}
              style={{ '--event-color': event.color } as React.CSSProperties}
              onClick={() => handleEventClick(event)}
            >
              <View className={styles.eventHeader}>
                <Text className={styles.eventTitle}>{event.title}</Text>
                {event.startTime && (
                  <Text className={styles.eventTime}>
                    {event.startTime}{event.endTime ? `-${event.endTime}` : ''}
                  </Text>
                )}
              </View>
              <View className={styles.eventMeta}>
                {event.location && (
                  <Text className={styles.eventLocation}>📍 {event.location}</Text>
                )}
                {event.memberIds.length > 0 && (
                  <View className={styles.memberAvatars}>
                    {event.memberIds.slice(0, 3).map((memberId) => {
                      const member = getMemberById(memberId);
                      return member ? (
                        <Image
                          key={memberId}
                          src={member.avatar}
                          className={styles.memberAvatar}
                        />
                      ) : null;
                    })}
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📅</Text>
            <Text className={styles.emptyText}>暂无日程安排</Text>
          </View>
        )}
      </View>

      <View className={styles.fab} onClick={handleAddEvent}>
        <Text className={styles.fabText}>+</Text>
      </View>
    </View>
  );
};

export default HomePage;
