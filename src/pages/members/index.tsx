import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { FamilyMember } from '../../types';
import { mockMembers, mockEvents } from '../../data/mockData';

const MembersPage: React.FC = () => {
  const [members] = useState<FamilyMember[]>(mockMembers);
  const [events] = useState(mockEvents);

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const upcoming: Array<{ member: FamilyMember; daysLeft: number }> = [];

    members.forEach(member => {
      if (member.birthday) {
        const birthday = new Date(member.birthday);
        birthday.setFullYear(today.getFullYear());

        if (birthday < today) {
          birthday.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = birthday.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) {
          upcoming.push({ member, daysLeft: diffDays });
        }
      }
    });

    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const getMemberEventsCount = (memberId: string) => {
    return events.filter(e => e.memberIds.includes(memberId) && e.date >= new Date().toISOString().split('T')[0]).length;
  };

  const getTotalUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date >= today).length;
  };

  const getBirthdayCount = () => {
    return members.filter(m => m.birthday).length;
  };

  const handleMemberClick = (member: FamilyMember) => {
    Taro.showToast({
      title: '成员详情开发中',
      icon: 'none'
    });
  };

  const handleAddMember = () => {
    Taro.showToast({
      title: '添加成员开发中',
      icon: 'none'
    });
  };

  const formatBirthday = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View>
            <Text className={styles.groupName}>幸福一家</Text>
            <Text className={styles.memberCount}>共 {members.length} 位成员</Text>
          </View>
          <View className={styles.addBtn} onClick={handleAddMember}>
            + 添加成员
          </View>
        </View>

        <View className={styles.quickStats}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{getTotalUpcomingEvents()}</Text>
            <Text className={styles.statLabel}>待办事件</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{getBirthdayCount()}</Text>
            <Text className={styles.statLabel}>生日记录</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{members.length}</Text>
            <Text className={styles.statLabel}>家庭成员</Text>
          </View>
        </View>
      </View>

      <View className={styles.memberList}>
        {members.map((member) => (
          <View
            key={member.id}
            className={styles.memberCard}
            style={{ '--member-color': member.color } as React.CSSProperties}
            onClick={() => handleMemberClick(member)}
          >
            <View className={styles.avatarWrapper}>
              <Image src={member.avatar} className={styles.avatar} />
              {member.role === 'admin' && (
                <View className={styles.roleBadge}>管</View>
              )}
            </View>

            <View className={styles.memberInfo}>
              <Text className={styles.memberName}>{member.name}</Text>
              <View className={styles.memberMeta}>
                <Text>
                  <Text className={styles.colorDot} style={{ backgroundColor: member.color }} />
                  {member.role === 'admin' ? '管理员' : '成员'}
                </Text>
                {member.birthday && (
                  <Text>生日：{formatBirthday(member.birthday)}</Text>
                )}
              </View>
              {getMemberEventsCount(member.id) > 0 && (
                <Text className={styles.upcomingBadge}>
                  有 {getMemberEventsCount(member.id)} 个待办事件
                </Text>
              )}
            </View>
          </View>
        ))}

        <View className={styles.addMemberCard} onClick={handleAddMember}>
          <Text className={styles.addIcon}>+</Text>
          <Text className={styles.addText}>添加新成员</Text>
        </View>
      </View>

      {upcomingBirthdays.length > 0 && (
        <View className={styles.birthdaySection}>
          <Text className={styles.sectionTitle}>即将到来的生日</Text>
          {upcomingBirthdays.map(({ member, daysLeft }) => (
            <View key={member.id} className={styles.birthdayCard}>
              <Image src={member.avatar} className={styles.birthdayAvatar} />
              <View className={styles.birthdayInfo}>
                <Text className={styles.birthdayName}>{member.name} 的生日</Text>
                <Text className={styles.birthdayDate}>
                  {member.birthday && formatBirthday(member.birthday)}
                </Text>
              </View>
              <View>
                <Text className={styles.daysLeft}>
                  {daysLeft}
                  <Text className={styles.daysLabel}>天后</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default MembersPage;
