// Захардкоженные данные, имитирующие ответ сервера.

// «Сегодня» — захардкожено, чтобы проверка была предсказуемой.
// В реальном проекте: new Date() и приведение к { day, month, year }.
export const TODAY = { day: 17, month: 9, year: 2026 };

// Слоты для чётных дней. Занято 12:00 и 13:00.
export const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

// Слоты для нечётных дней. Занято 11:00 и 16:00.
export const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "19:30", available: true },
];

// getSlotsForDay — «запрос» слотов на конкретный день.
// Чётные и нечётные дни получают разные наборы.
export function getSlotsForDay(day) {
  return day % 2 === 0 ? SLOTS_EVEN_DAY.slice() : SLOTS_ODD_DAY.slice();
}