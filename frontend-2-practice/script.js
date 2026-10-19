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
  selectedDate: null,
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

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(day, month, year) {
  return compareDates({ day, month, year }, SERVER_DATA.today) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
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

function getSlotsForDay(day) {
  return day % 2 === 0 ? SLOTS_EVEN_DAY.slice() : SLOTS_ODD_DAY.slice();
}

function getFirstSelectableDayOfMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (isDateSelectable(d, month, year)) return d;
  }
  return null;
}

// ============================================================
// 4. РЕНДЕР
// ============================================================
function renderCalendar() {
  const monthYearEl = document.querySelector(".month-year");
  const gridContainer = document.querySelector(".grid-days");
  if (!monthYearEl || !gridContainer) return;

  const { currentYear: year, currentMonth: month, selectedDate } = BOOKING_STATE;
  const today = SERVER_DATA.today;

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
        selectedDate &&
        cell.day === selectedDate.day &&
        month === selectedDate.month &&
        year === selectedDate.year;
      if (isSelected) classes += " selected";

      const selectable = isDateSelectable(cell.day, month, year);
      if (!cell.otherMonth && !selectable) classes += " disabled";

      const disabledAttr = cell.otherMonth || !selectable ? " disabled" : "";

      html +=
        '<button type="button" class="' + classes + '"' +
        ' data-day="' + cell.day + '"' +
        ' data-other="' + cell.otherMonth + '"' +
        disabledAttr + ">" + cell.day + "</button>";
    });
    html += "</div>";
  });

  gridContainer.innerHTML = html;

  const dayCells = gridContainer.querySelectorAll(
    ".day-cell:not(.other-month):not(.disabled)"
  );
  dayCells.forEach(function (cell) {
    cell.addEventListener("click", onDayClick);
  });
}

function renderTimeSlots() {
  const container = document.querySelector(".time-slots");
  if (!container) return;

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
    const disabledAttr = slot.available ? "" : " disabled";

    html +=
      '<button type="button" class="' + classes + '"' +
      ' data-time="' + slot.time + '"' +
      disabledAttr + ">" +
      slot.time + (!slot.available ? " <span>Занято</span>" : "") +
      "</button>";
  });

  container.innerHTML = html;

  const slotButtons = container.querySelectorAll(".time-slot:not(.unavailable)");
  slotButtons.forEach(function (btn) {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

function updateSummary() {
  const valueEl = document.querySelector(".booking-summary__value");
  if (!valueEl) return;

  const { selectedDate, selectedTime } = BOOKING_STATE;

  if (!selectedDate) {
    valueEl.textContent = selectedTime
      ? "дата не выбрана • " + selectedTime
      : "—";
    return;
  }

  const dateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[selectedDate.month];
  const timePart = selectedTime || "время не выбрано";

  valueEl.textContent =
    dayName + ", " + selectedDate.day + " " + monthName + " " +
    selectedDate.year + " • " + timePart;
}

// ============================================================
// 5. ОБРАБОТЧИКИ
// ============================================================

function selectDate(day, month, year) {
  BOOKING_STATE.selectedDate = { day, month, year };
  BOOKING_STATE.selectedTime = null;
  BOOKING_STATE.slots = getSlotsForDay(day);

  renderCalendar();
  renderTimeSlots();
  updateSummary();
}

function onDayClick(event) {
  const cell = event.currentTarget;
  const day = parseInt(cell.dataset.day, 10);
  selectDate(day, BOOKING_STATE.currentMonth, BOOKING_STATE.currentYear);
}

function onTimeSlotClick(event) {
  BOOKING_STATE.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateSummary();
}

function setupMonthNavigation() {
  const prevBtn = document.querySelector(".calendar-nav-prev");
  const nextBtn = document.querySelector(".calendar-nav-next");

  function goToMonth(delta) {
    let m = BOOKING_STATE.currentMonth + delta;
    let y = BOOKING_STATE.currentYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    BOOKING_STATE.currentMonth = m;
    BOOKING_STATE.currentYear = y;

    BOOKING_STATE.selectedDate = null;
    BOOKING_STATE.selectedTime = null;

    const firstDay = getFirstSelectableDayOfMonth(y, m);
    BOOKING_STATE.slots = firstDay !== null ? getSlotsForDay(firstDay) : [];

    renderCalendar();
    renderTimeSlots();
    updateSummary();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goToMonth(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goToMonth(1); });
}

function setupBackButton() {
  const btn = document.querySelector(".booking-back-button");
  if (!btn) return;
  btn.addEventListener("click", function () {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });
}

function setupNextButton() {
  const btn = document.querySelector(".booking-next-btn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    const { selectedDate, selectedTime, slots } = BOOKING_STATE;

    if (!selectedDate) {
      alert("Пожалуйста, выберите дату");
      return;
    }
    if (!isDateSelectable(selectedDate.day, selectedDate.month, selectedDate.year)) {
      alert("Нельзя выбрать дату раньше сегодняшней");
      return;
    }
    if (!selectedTime) {
      alert("Пожалуйста, выберите время");
      return;
    }

    const slot = slots.find(function (s) { return s.time === selectedTime; });
    if (!slot || !slot.available) {
      alert("Выбранное время недоступно. Пожалуйста, выберите другое");
      BOOKING_STATE.selectedTime = null;
      renderTimeSlots();
      updateSummary();
      return;
    }

    const booking = {
      date: {
        day: selectedDate.day,
        month: selectedDate.month,
        year: selectedDate.year,
      },
      time: selectedTime,
    };
    localStorage.setItem("elair-booking", JSON.stringify(booking));

    alert(
      "Выбрано: " +
        booking.date.day + "." + (booking.date.month + 1) + "." + booking.date.year +
        " " + booking.time
    );
  });
}

// ============================================================
// 6. ИНИЦИАЛИЗАЦИЯ
// ============================================================
function init() {
  const today = SERVER_DATA.today;
  BOOKING_STATE.currentMonth = today.month;
  BOOKING_STATE.currentYear = today.year;
  BOOKING_STATE.selectedDate = { day: today.day, month: today.month, year: today.year };
  BOOKING_STATE.selectedTime = null;
  BOOKING_STATE.slots = getSlotsForDay(today.day);

  renderCalendar();
  renderTimeSlots();
  updateSummary();

  setupMonthNavigation();
  setupBackButton();
  setupNextButton();
}

document.addEventListener("DOMContentLoaded", init);