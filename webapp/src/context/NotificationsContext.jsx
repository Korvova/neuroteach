import { createContext, useContext, useState } from 'react';

const NotificationsContext = createContext(null);

const initial = [
  { id: 1, text: 'Файл по задаче «Промптинг» проверен', date: '29.07.2025', read: false },
  { id: 2, text: 'Урок «Демонстрация ChatGPT» открыт',  date: '29.07.2025', read: false },
  { id: 3, text: 'Подписка оплачена',                   date: '28.07.2025', read: true  },
];

export function NotificationsProvider({ children }) {
  const [list, setList] = useState(initial);

  const unreadCount  = list.filter((n) => !n.read).length;
  const markRead     = (id) => setList(list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead  = () => setList(list.map((n) => ({ ...n, read: true })));

  return (
    <NotificationsContext.Provider value={{ list, unreadCount, markRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
