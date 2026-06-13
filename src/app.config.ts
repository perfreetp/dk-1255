import { defineAppConfig } from 'tarojs';

export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/event/index',
    'pages/members/index',
    'pages/todo/index',
    'pages/reminders/index',
    'pages/eventDetail/index',
    'pages/checklist/index',
    'pages/shareConfirm/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '家庭日历',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#7F8C8D',
    selectedColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '日历'
      },
      {
        pagePath: 'pages/event/index',
        text: '添加'
      },
      {
        pagePath: 'pages/members/index',
        text: '成员'
      },
      {
        pagePath: 'pages/todo/index',
        text: '待办'
      },
      {
        pagePath: 'pages/reminders/index',
        text: '提醒'
      }
    ]
  }
});
