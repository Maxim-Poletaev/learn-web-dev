// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }


// ============================================================
// 1. ДАННЫЕ
// ============================================================
const SERVER_DATA = {
  today: { day: 17, month: 9, year: 2026 },
};

const SLOTS_EVEN_DAY = [
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

const SLOTS_ODD_DAY = [
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

// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================
const BOOKING_STATE = {
  currentMonth: 9,
  currentYear: 2026,
  selectedDay: 17,
  selectedTime: null,
  slots: [],
};

// ============================================================
// 3. ЧИСТЫЕ ФУНКЦИИ И ГЛОБАЛЬНЫЕ КОНСТАНТЫ
// ============================================================
const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// compareDates — сравнение двух дат без времени.
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// isDateSelectable — можно ли выбрать день. Раньше today — нельзя.
function isDateSelectable(day, month, year) {
  const today = SERVER_DATA.today;
  return compareDates({ day, month, year }, today) >= 0;
}

// buildCalendarGrid — строит сетку календаря для месяца.
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

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

// getSlotsForDay — «запрос» слотов на конкретный день.
// Чётные и нечётные дни получают разные наборы — чтобы при клике
// на разные дни было видно, что данные действительно обновляются.
function getSlotsForDay(day) {
  return day % 2 === 0 ? SLOTS_EVEN_DAY.slice() : SLOTS_ODD_DAY.slice();
}

// ============================================================
// 4. РЕНДЕР
// ============================================================

// renderCalendar — рисует заголовок и сетку дней.
// После вставки HTML вешает обработчики на активные дни.
function renderCalendar() {
  const monthYearEl = document.querySelector(".month-year");
  const gridContainer = document.querySelector(".grid-days");

  const { currentYear: year, currentMonth: month, selectedDay } = BOOKING_STATE;
  const today = SERVER_DATA.today;

  // Заголовок «Октябрь 2026».
  monthYearEl.textContent = MONTHS_NOMINATIVE[month] + " " + year;

  const weeks = buildCalendarGrid(year, month);

  let html = "";
  weeks.forEach(function (week) {
    html += '<div class="grid-row">';
    week.forEach(function (cell) {
      let classes = "day-cell";
      if (cell.otherMonth) classes += " other-month";

      const isToday =
        !cell.otherMonth &&
        cell.day === today.day &&
        month === today.month &&
        year === today.year;
      if (isToday) classes += " today";

      const isSelected =
        !cell.otherMonth &&
        cell.day === selectedDay &&
        month === BOOKING_STATE.currentMonth;
      if (isSelected) classes += " selected";

      // Прошлые дни — недоступны.
      const selectable = isDateSelectable(cell.day, month, year);
      if (!cell.otherMonth && !selectable) classes += " disabled";

      // data-day нужен, чтобы в обработчике понять, на какой день кликнули.
      // Прошлые дни и дни соседнего месяца — disabled, чтобы не кликались.
      const disabledAttr =
        cell.otherMonth || !selectable ? " disabled" : "";

      html +=
        '<button type="button" class="' + classes + '"' +
        ' data-day="' + cell.day + '"' +
        ' data-other="' + cell.otherMonth + '"' +
        disabledAttr +
        '>' + cell.day + "</button>";
    });
    html += "</div>";
  });

  gridContainer.innerHTML = html;

  // Вешаем обработчики заново — старые ячейки удалены innerHTML.
  const dayCells = gridContainer.querySelectorAll(
    ".day-cell:not(.other-month):not(.disabled)"
  );
  dayCells.forEach(function (cell) {
    cell.addEventListener("click", onDayClick);
  });
}

// renderTimeSlots — рисует кнопки слотов.
function renderTimeSlots() {
  const container = document.querySelector(".time-slots");
  const slots = BOOKING_STATE.slots;

  if (!slots || slots.length === 0) {
    container.innerHTML =
      '<div style="padding:20px;color:#6B6661;">' +
      "В этот день нет доступного времени" +
      "</div>";
    return;
  }

  let html = "";
  slots.forEach(function (slot) {
    let classes = "time-slot";
    if (!slot.available) classes += " unavailable";
    if (slot.available && slot.time === BOOKING_STATE.selectedTime) {
      classes += " selected";
    }

    // Занятые слоты — disabled, чтобы клик не срабатывал и скринридер
    // корректно озвучивал недоступность.
    const disabledAttr = slot.available ? "" : " disabled";

    html +=
      '<button type="button" class="' + classes + '"' +
      ' data-time="' + slot.time + '"' +
      disabledAttr + ">" +
      slot.time +
      (!slot.available ? " <span>Занято</span>" : "") +
      "</button>";
  });

  container.innerHTML = html;

  // Обработчики — только на доступные слоты.
  const slotButtons = container.querySelectorAll(".time-slot:not(.unavailable)");
  slotButtons.forEach(function (btn) {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

// ============================================================
// 5. ОБРАБОТЧИКИ
// ============================================================

// onDayClick — клик по дню. Меняет выбранный день, сбрасывает
// выбранное время (на новом дне слоты другие) и подгружает слоты.
function onDayClick(event) {
  const cell = event.currentTarget;
  const day = parseInt(cell.dataset.day, 10);

  BOOKING_STATE.selectedDay = day;
  // Время сбрасываем — старое может быть занято на новом дне.
  BOOKING_STATE.selectedTime = null;
  // «Запрашиваем» слоты у сервера (пока из имитации).
  BOOKING_STATE.slots = getSlotsForDay(day);

  renderCalendar();
  renderTimeSlots();
}

// onTimeSlotClick — клик по слоту. Сохраняет время и перерисовывает.
function onTimeSlotClick(event) {
  const btn = event.currentTarget;
  BOOKING_STATE.selectedTime = btn.dataset.time;
  renderTimeSlots();
}

// setupMonthNavigation — стрелки «‹» и «›».
// Переходы через границу года: январь назад → декабрь прошлого года,
// декабрь вперёд → январь следующего.
function setupMonthNavigation() {
  const prevBtn = document.querySelector(".calendar-nav-prev");
  const nextBtn = document.querySelector(".calendar-nav-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth -= 1;
      if (BOOKING_STATE.currentMonth < 0) {
        BOOKING_STATE.currentMonth = 11;
        BOOKING_STATE.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth += 1;
      if (BOOKING_STATE.currentMonth > 11) {
        BOOKING_STATE.currentMonth = 0;
        BOOKING_STATE.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

// setupBackButton — кнопка «НАЗАД». Ведёт на предыдущую страницу.
function setupBackButton() {
  const btn = document.querySelector(".booking-back-button");
  if (!btn) return;
  btn.addEventListener("click", function () {
    // Если предыдущей страницы нет — уходим на главную.
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });
}

// setupNextButton — кнопка «ВЫБРАТЬ». Проверяет, что время выбрано,
// и сохраняет дату/время в localStorage для следующего шага.
function setupNextButton() {
  const btn = document.querySelector(".booking-next-btn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    if (!BOOKING_STATE.selectedTime) {
      alert("Пожалуйста, выберите время");
      return;
    }
    const booking = {
      date: {
        day: BOOKING_STATE.selectedDay,
        month: BOOKING_STATE.currentMonth,
        year: BOOKING_STATE.currentYear,
      },
      time: BOOKING_STATE.selectedTime,
    };
    localStorage.setItem("elair-booking", JSON.stringify(booking));
    // Здесь в реальном проекте был бы переход на страницу
    // контактных данных. Пока просто уведомляем.
    alert(
      "Выбрано: " +
        booking.date.day + "." +
        (booking.date.month + 1) + "." +
        booking.date.year + " " + booking.time
    );
  });
}

// ============================================================
// 6. ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
  // Начальное состояние: показываем «сегодня» и его слоты,
  // чтобы пользователь не видел пустой экран.
  const today = SERVER_DATA.today;
  BOOKING_STATE.currentMonth = today.month;
  BOOKING_STATE.currentYear = today.year;
  BOOKING_STATE.selectedDay = today.day;
  BOOKING_STATE.selectedTime = null;
  BOOKING_STATE.slots = getSlotsForDay(today.day);

  renderCalendar();
  renderTimeSlots();

  // Эти обработчики вешаем один раз — их элементы не пересоздаются
  // при перерисовке календаря и слотов.
  setupMonthNavigation();
  setupBackButton();
  setupNextButton();
}

document.addEventListener("DOMContentLoaded", init);