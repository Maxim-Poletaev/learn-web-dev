// Названия месяцев в именительном падеже — для заголовка «Октябрь 2026».
export const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// Родительный падеж — для итоговой строки «17 октября 2026».
export const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

// Дни недели. Порядок как у getDay(): 0 = воскресенье.
export const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

// Короткие дни недели для шапки календаря (Пн–Вс).
export const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// compareDates — сравнение двух дат без времени.
// -1 — первая раньше, 0 — равны, 1 — первая позже.
// Обе даты — объекты { day, month, year }.
export function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// isDateSelectable — можно ли выбрать день.
// Раньше today выбирать нельзя.
export function isDateSelectable(day, month, year, today) {
  return compareDates({ day, month, year }, today) >= 0;
}

// buildCalendarGrid — строит сетку календаря для месяца.
// Принимает год и месяц (0-индексный).
// Возвращает массив недель, каждая — массив из 7 ячеек { day, otherMonth }.
export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Сдвиг, чтобы неделя начиналась с понедельника.
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Последний день предыдущего месяца — для «хвоста» в начале сетки.
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  // Дни предыдущего месяца.
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца.
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца — чтобы последняя неделя была полной.
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// getFirstSelectableDayOfMonth — первый доступный день месяца.
// Возвращает число или null, если весь месяц в прошлом.
export function getFirstSelectableDayOfMonth(year, month, today) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (isDateSelectable(d, month, year, today)) return d;
  }
  return null;
}

// formatSelectedDate — строка «Пятница, 17 октября 2026».
// Принимает { day, month, year }.
export function formatSelectedDate(date) {
  const dateObj = new Date(date.year, date.month, date.day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[date.month];
  return dayName + ", " + date.day + " " + monthName + " " + date.year;
}