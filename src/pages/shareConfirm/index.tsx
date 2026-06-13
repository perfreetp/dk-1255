import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const ShareConfirmPage: React.FC = () => {
  const [shareType, setShareType] = useState<'wechat' | 'link' | 'sms'>('wechat');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const eventData = {
    title: '小明放学接送',
    date: '2026-06-18',
    time: '16:30',
    location: '小明学校门口',
    color: '#45B7D1'
  };

  const getLightenColor = (color: string): string => {
    return color + '80';
  };

  const handleShare = () => {
    if (shareType === 'sms' && !phone) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '分享确认',
      content: '确定要分享这个事件给亲友吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: shareType === 'sms' ? '短信发送成功' : '分享已发送',
            icon: 'success'
          });

          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.card}>
        <View
          className={styles.eventPreview}
          style={{
            '--event-color': eventData.color,
            '--event-color-light': getLightenColor(eventData.color)
          } as React.CSSProperties}
        >
          <Text className={styles.eventTitle}>{eventData.title}</Text>
          <Text className={styles.eventTime}>
            📅 {eventData.date} {eventData.time}
          </Text>
          {eventData.location && (
            <Text className={styles.eventTime}>📍 {eventData.location}</Text>
          )}
        </View>

        <View className={styles.shareSection}>
          <Text className={styles.sectionTitle}>选择分享方式</Text>

          <View
            className={`${styles.shareOption} ${shareType === 'wechat' ? styles.active : ''}`}
            onClick={() => setShareType('wechat')}
          >
            <Text className={styles.optionIcon}>💬</Text>
            <View className={styles.optionContent}>
              <Text className={styles.optionTitle}>微信好友</Text>
              <Text className={styles.optionDesc}>分享到微信聊天</Text>
            </View>
          </View>

          <View
            className={`${styles.shareOption} ${shareType === 'link' ? styles.active : ''}`}
            onClick={() => setShareType('link')}
          >
            <Text className={styles.optionIcon}>🔗</Text>
            <View className={styles.optionContent}>
              <Text className={styles.optionTitle}>生成分享链接</Text>
              <Text className={styles.optionDesc}>生成可访问的链接</Text>
            </View>
          </View>

          <View
            className={`${styles.shareOption} ${shareType === 'sms' ? styles.active : ''}`}
            onClick={() => setShareType('sms')}
          >
            <Text className={styles.optionIcon}>📱</Text>
            <View className={styles.optionContent}>
              <Text className={styles.optionTitle}>短信分享</Text>
              <Text className={styles.optionDesc}>通过短信发送</Text>
            </View>
          </View>
        </View>

        {shareType === 'sms' && (
          <View>
            <Text className={styles.sectionTitle}>接收人手机号</Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="请输入手机号"
              value={phone}
              onInput={(e) => setPhone(e.detail.value)}
            />
          </View>
        )}

        <View>
          <Text className={styles.sectionTitle}>附加消息</Text>
          <Textarea
            className={styles.messageInput}
            placeholder="添加一条消息（可选）"
            value={message}
            onInput={(e) => setMessage(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={() => Taro.navigateBack()}>
          取消
        </View>
        <View className={styles.btnPrimary} onClick={handleShare}>
          确认分享
        </View>
      </View>
    </View>
  );
};

export default ShareConfirmPage;
