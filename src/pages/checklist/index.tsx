import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { ChecklistItem } from '../../types';

const ChecklistPage: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: '准备食材', completed: false },
    { id: '2', text: '购买饮料', completed: false },
    { id: '3', text: '带上野餐垫', completed: true },
    { id: '4', text: '准备户外玩具', completed: false }
  ]);

  const handleToggleItem = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateItem = (itemId: string, text: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, text } : item
      )
    );
  };

  const handleAddItem = () => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: '',
      completed: false
    };
    setChecklist(prev => [...prev, newItem]);
  };

  const handleSave = () => {
    Taro.showToast({
      title: '清单已保存',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>清单项目</Text>
          {checklist.map((item) => (
            <View key={item.id} className={styles.checklistItem}>
              <View
                className={`${styles.checkbox} ${item.completed ? styles.checked : ''}`}
                onClick={() => handleToggleItem(item.id)}
              >
                {item.completed && '✓'}
              </View>
              <Input
                className={styles.checklistInput}
                value={item.text}
                placeholder="输入清单内容"
                onInput={(e) => handleUpdateItem(item.id, e.detail.value)}
              />
              <View
                className={styles.deleteBtn}
                onClick={() => handleDeleteItem(item.id)}
              >
                ✕
              </View>
            </View>
          ))}

          <View className={styles.addBtn} onClick={handleAddItem}>
            <Text className={styles.btnText}>+ 添加清单项</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          保存清单
        </View>
      </View>
    </View>
  );
};

export default ChecklistPage;
