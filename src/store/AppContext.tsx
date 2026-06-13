import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarEvent, FamilyMember, ReminderRecord, FamilyGroup } from '../types';
import { mockEvents, mockMembers, mockReminders } from '../data/mockData';

interface AppState {
  events: CalendarEvent[];
  members: FamilyMember[];
  reminders: ReminderRecord[];
  familyGroup: FamilyGroup;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  toggleEventComplete: (eventId: string) => void;
  addMember: (member: FamilyMember) => void;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (memberId: string) => void;
  updateFamilyGroup: (updates: Partial<FamilyGroup>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [members, setMembers] = useState<FamilyMember[]>(mockMembers);
  const [reminders, setReminders] = useState<ReminderRecord[]>(mockReminders);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup>({
    id: 'family-1',
    name: '幸福一家',
    members: mockMembers,
    createdAt: new Date().toISOString()
  });

  const addEvent = (event: CalendarEvent) => {
    setEvents(prev => [event, ...prev]);
    if (event.reminder?.enabled) {
      const remindTime = new Date(`${event.date}T${event.startTime || '09:00'}`);
      remindTime.setMinutes(remindTime.getMinutes() - event.reminder.minutes);

      const newReminder: ReminderRecord = {
        id: `reminder-${Date.now()}`,
        eventId: event.id,
        event,
        remindTime: remindTime.toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setReminders(prev => [newReminder, ...prev]);
    }
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setReminders(prev => prev.filter(reminder => reminder.eventId !== eventId));
  };

  const toggleEventComplete = (eventId: string) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, status: event.status === 'completed' ? 'pending' : 'completed' as const }
          : event
      )
    );
  };

  const addMember = (member: FamilyMember) => {
    setMembers(prev => [...prev, member]);
    setFamilyGroup(prev => ({
      ...prev,
      members: [...prev.members, member]
    }));
  };

  const updateMember = (memberId: string, updates: Partial<FamilyMember>) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId ? { ...member, ...updates } : member
      )
    );
    setFamilyGroup(prev => ({
      ...prev,
      members: prev.members.map(m =>
        m.id === memberId ? { ...m, ...updates } : m
      )
    }));
  };

  const deleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
    setFamilyGroup(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  const updateFamilyGroup = (updates: Partial<FamilyGroup>) => {
    setFamilyGroup(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        events,
        members,
        reminders,
        familyGroup,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventComplete,
        addMember,
        updateMember,
        deleteMember,
        updateFamilyGroup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
