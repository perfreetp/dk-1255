import React, { useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { FamilyMember } from '../../types';
import { useApp } from '../../store/AppContext';

const MembersPage: React.FC = () => {
  const { familyGroup, members, events, addMember, addEvent, updateFamilyGroup } = useApp();
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberBirthday, setNewMemberBirthday] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatarOptions = [
    'https://picsum.photos/id/64/200/200',
    'https://picsum.photos/id/177/200/200',
    'https://picsum.photos/id/338/200/200',
    'https://picsum.photos/id/91/200/200',
    'https://picsum.photos/id/1027/200/200',
    'https://picsum.photos/id/292/200/200',
    'https://picsum.photos/id/312/200/200',
    'https://picsum.photos/id/401/200/200'
  ];

  const memberColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

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
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.memberIds.includes(memberId) && e.date >= today).length;
  };

  const getTotalUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date >= today).length;
  };

  const getBirthdayCount = () => {
    return members.filter(m => m.birthday).length;
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      Taro.showToast({
        title: '请输入家庭群名称',
        icon: 'none'
      });
      return;
    }

    updateFamilyGroup({ name: newGroupName.trim() });

    Taro.showToast({
      title: `已创建"${newGroupName}"家庭群`,
      icon: 'success'
    });

    setShowAddGroupModal(false);
    setNewGroupName('');
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Taro.showToast({
        title: '请输入成员称呼',
        icon: 'none'
      });
      return;
    }

    const randomColor = memberColors[Math.floor(Math.random() * memberColors.length)];
    const avatar = selectedAvatar || avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      avatar: avatar,
      color: randomColor,
      role: 'member',
      birthday: newMemberBirthday || undefined
    };

    addMember(newMember);

    if (newMemberBirthday) {
      const birthdayEvent: any = {
        id: `event-birthday-${Date.now()}`,
        title: `${newMemberName}的生日`,
        date: newMemberBirthday,
        memberIds: [newMember.id],
        color: '#FF6B6B',
        category: 'birthday',
        status: 'pending',
        reminder: { enabled: true, minutes: 1440 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      addEvent(birthdayEvent);
    }

    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberBirthday('');
    setSelectedAvatar('');

    Taro.showToast({
      title: '成员添加成功',
      icon: 'success'
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
            <Text className={styles.groupName}>{familyGroup.name}</Text>
            <Text className={styles.memberCount}>共 {members.length} 位成员</Text>
          </View>
          <View className={styles.headerActions}>
            <View className={styles.addBtn} onClick={() => setShowAddGroupModal(true)}>
              新建群组
            </View>
            <View className={styles.addBtn} onClick={() => setShowAddMemberModal(true)}>
              + 添加成员
            </View>
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

        <View className={styles.addMemberCard} onClick={() => setShowAddMemberModal(true)}>
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

      {showAddGroupModal && (
        <View className={styles.modal}>
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>创建家庭群</Text>

            <View className={styles.formGroup}>
              <Text className={styles.label}>家庭群名称 *</Text>
              <Input
                className={styles.input}
                placeholder="请输入家庭群名称"
                value={newGroupName}
                onInput={(e) => setNewGroupName(e.detail.value)}
              />
            </View>

            <View className={styles.modalButtons}>
              <View className={styles.cancelBtn} onClick={() => setShowAddGroupModal(false)}>
                取消
              </View>
              <View className={styles.confirmBtn} onClick={handleAddGroup}>
                创建
              </View>
            </View>
          </View>
        </View>
      )}

      {showAddMemberModal && (
        <View className={styles.modal}>
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>添加家庭成员</Text>

            <View className={styles.formGroup}>
              <Text className={styles.label}>选择头像</Text>
              <View className={styles.avatarGrid}>
                {avatarOptions.map((avatar, index) => (
                  <View
                    key={index}
                    className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ''}`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <Image src={avatar} className={styles.avatarOptionImg} />
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>成员称呼 *</Text>
              <Input
                className={styles.input}
                placeholder="请输入成员称呼"
                value={newMemberName}
                onInput={(e) => setNewMemberName(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>生日日期</Text>
              <Input
                className={styles.input}
                type="date"
                value={newMemberBirthday}
                onInput={(e) => setNewMemberBirthday(e.detail.value)}
                placeholder="选择生日日期（可选）"
              />
            </View>

            <View className={styles.modalButtons}>
              <View className={styles.cancelBtn} onClick={() => setShowAddMemberModal(false)}>
                取消
              </View>
              <View className={styles.confirmBtn} onClick={handleAddMember}>
                添加
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MembersPage;
