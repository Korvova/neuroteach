import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

/* мок‑данные */
const initParticipants = [
  { id: 1, first: 'Анна', last: 'Иванова', email: 'anna@mail.ru', group: 'A‑101', lessons: 5, courses: 1, lastLogin: '28.07.25' },
  { id: 2, first: 'Борис', last: 'Кузнецов', email: 'boris@mail.ru', group: 'A‑101', lessons: 2, courses: 0, lastLogin: '27.07.25' },
];
const initGroups = [{ id: 1, name: 'A‑101', members: [1, 2] }];
const initPayments = [
  { id: 1, date: '01.07.25', qty: 30, amount: 60000, status: 'Оплачен' },
];

export function ModeratorProvider({ children }) {
  const [participants, setP] = useState(initParticipants);
  const [groups, setG] = useState(initGroups);
  const [payments, setPay] = useState(initPayments);
  const [slots, setSlots] = useState(30);

  /* helpers */
  const addParticipant = (p) => {
    setP([...participants, { id: Date.now(), ...p }]);
    setSlots((s) => s - 1);
  };
  const editParticipant = (p) =>
    setP(participants.map((x) => (x.id === p.id ? p : x)));

  const addGroup = (g) =>
    setG([...groups, { id: Date.now(), ...g, members: [] }]);

  const buySlots = (qty) => {
    setSlots((s) => s + qty);
    setPay([
      ...payments,
      {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        qty,
        amount: qty * 2000,
        status: 'Ждёт поступления',
      },
    ]);
  };

  return (
    <Ctx.Provider
      value={{
        participants,
        groups,
        payments,
        slots,
        addParticipant,
        editParticipant,
        addGroup,
        buySlots,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useMod = () => useContext(Ctx);
