// src/BookingPage.jsx
import { useEffect, useState } from 'react';
import Header from './components/Header';
import StepsIndicator from './components/StepsIndicator';
import Calendar from './components/Calendar/Calendar';
import TimeSlots from './components/TimeSlots';
import CalendarButtons from './components/CalendarButtons';
import BookingSummary from './components/BookingSummary';
import Footer from './components/Footer';
import { fetchSlots } from './api';
import {
  isDateSelectable,
  getFirstSelectableDayOfMonth,
} from './utils/date';

export default function BookingPage({ today }) {
  // --- Состояние календаря ---
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [currentYear, setCurrentYear] = useState(today.year);
  const [selectedDate, setSelectedDate] = useState({
    day: today.day,
    month: today.month,
    year: today.year,
  });
  const [selectedTime, setSelectedTime] = useState(null);

  // --- Состояние слотов ---
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Загружаем слоты каждый раз, когда меняется выбранная дата.
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSlotsLoading(false);
      setSlotsError(null);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        const data = await fetchSlots(selectedDate);
        if (!cancelled) setSlots(data.slots);
      } catch (err) {
        if (!cancelled) setSlotsError(err.message);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // Зависимости — только поля даты. Если бы в deps был весь
    // объект selectedDate, эффект перезапускался бы при каждом
    // новом объекте с теми же значениями.
  }, [selectedDate?.day, selectedDate?.month, selectedDate?.year]);

  // --- Выбор дня ---
  function handleSelectDay(day) {
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setSelectedTime(null);
  }

  // --- Выбор времени ---
  function handleSelectTime(time) {
    setSelectedTime(time);
  }

  // --- Переключение месяца ---
  function handlePrevMonth() {
    let m = currentMonth - 1;
    let y = currentYear;
    if (m < 0) { m = 11; y -= 1; }
    goToMonth(y, m);
  }

  function handleNextMonth() {
    let m = currentMonth + 1;
    let y = currentYear;
    if (m > 11) { m = 0; y += 1; }
    goToMonth(y, m);
  }

  function goToMonth(year, month) {
    setCurrentMonth(month);
    setCurrentYear(year);
    setSelectedTime(null);

    const firstDay = getFirstSelectableDayOfMonth(year, month, today);
    if (firstDay === null) {
      setSelectedDate(null);
      setSlots([]);
    } else {
      setSelectedDate({ day: firstDay, month, year });
    }
  }

  // --- Кнопки ---
  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  }

  function handleNext() {
    if (!selectedDate) {
      alert('Пожалуйста, выберите дату');
      return;
    }
    if (!isDateSelectable(selectedDate.day, selectedDate.month, selectedDate.year, today)) {
      alert('Нельзя выбрать дату раньше сегодняшней');
      return;
    }
    if (!selectedTime) {
      alert('Пожалуйста, выберите время');
      return;
    }
    const slot = slots.find((s) => s.time === selectedTime);
    if (!slot || !slot.available) {
      alert('Выбранное время недоступно. Пожалуйста, выберите другое');
      setSelectedTime(null);
      return;
    }
    const booking = { date: selectedDate, time: selectedTime };
    localStorage.setItem('elair-booking', JSON.stringify(booking));
    alert(
      'Выбрано: ' +
        booking.date.day + '.' +
        (booking.date.month + 1) + '.' +
        booking.date.year + ' ' + booking.time
    );
  }

  return (
    <div className="page">
      <Header />
      <StepsIndicator />

      <main>
        <h1>Выберите дату и время</h1>

        <div className="calendar">
          <Calendar
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            today={today}
            onSelectDay={handleSelectDay}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
            loading={slotsLoading}
            error={slotsError}
          />
        </div>
        <BookingSummary
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
        <CalendarButtons onBack={handleBack} onNext={handleNext} />
        
      </main>

      <Footer />
    </div>
  );
}