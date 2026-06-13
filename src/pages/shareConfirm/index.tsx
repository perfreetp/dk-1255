import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { CalendarEvent } from '../../types';

const ShareConfirmPage: React.FC = () => {
  const [shareType, setShareType] = useState<'wechat' | 'link' | 'sms'>('wechat');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [event, setEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const eventData = Taro.getCurrentInstance().router?.params.event;
    if (eventData) {
      try {
        const decodedData = decodeURIComponent(eventData);
        const parsedEvent = JSON.parse(decodedData);
        setEvent(parsedEvent);
      } catch (error) {
        console.error('[Share] Failed to parse event data:', error);
        Taro.showToast({
          title: '事件数据加载失败',
          icon: 'none'
        });
      }
    } else {
      setEvent({
        id: 'default-event',
        title: '示例事件',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        location: '示例地点',
        memberIds: [],
        color: '#FF6B6B',
        category: 'other',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, []);

  const getLightenColor = (color: string): string => {
    return color + '80';
  };

  const validatePhone = (phoneNum: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phoneNum);
  };

  const handleShare = () => {
    if (shareType === 'sms' && !validatePhone(phone)) {
      Taro.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '分享确认',
      content: `确定要分享"${event?.title}"给亲友吗？`,
      success: (res) => {
        if (res.confirm) {
          if (shareType === 'sms') {
            const smsContent = `【家庭日历】邀请您确认日程：\n事件：${event?.title}\n时间：${event?.date} ${event?.startTime || ''}\n地点：${event?.location || '无'}\n${message ? '\n附加消息：' + message : ''}`;
            Taro.showToast({
              title: `短信已发送给${phone}`,
              icon: 'success',
              duration: 3000
            });
            console.log('[Share] SMS content:', smsContent);
          } else if (shareType === 'link') {
            Taro.setClipboardData({
              data: `https://family-calendar.app/share/${event?.id}`,
              success: () => {
                Taro.showToast({
                  title: '链接已复制到剪贴板',
                  icon: 'success'
                });
              }
            });
          } else {
            Taro.showToast({
              title: '分享已发送',
              icon: 'success'
            });
          }

          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  if (!event) {
    return (
      <View className={styles.container}>
        <View className={styles.card}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.card}>
        <View
          className={styles.eventPreview}
          style={{
            '--event-color': event.color,
            '--event-color-light': getLightenColor(event.color)
          } as React.CSSProperties}
        >
          <Text className={styles.eventTitle}>{event.title}</Text>
          <Text className={styles.eventTime}>
            📅 {event.date} {event.startTime || ''}
          </Text>
          {event.location && (
            <Text className={styles.eventTime}>📍 {event.location}</Text>
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
            <Text className={styles.sectionTitle}>接收人手机号 *</Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="请输入11位手机号码"
              value={phone}
              maxlength={11}
              onInput={(e) => setPhone(e.detail.value)}
            />
            {phone && !validatePhone(phone) && phone.length === 11 && (
              <Text className={styles.errorText}>请输入正确的手机号码</Text>
            )}
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
