// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import StepsIndicator from './components/StepsIndicator';
import Calendar from './components/Calendar/Calendar';
import TimeSlots from './components/TimeSlots';
import CalendarButtons from './components/CalendarButtons';
import BookingSummary from './components/BookingSummary';
import Footer from './components/Footer';
import { TODAY, getSlotsForDay } from './data/slots';
import {
  isDateSelectable,
  getFirstSelectableDayOfMonth,
} from './utils/date';

export default function App() {
  // --- Состояние ---
  const [currentMonth, setCurrentMonth] = useState(TODAY.month);
  const [currentYear, setCurrentYear] = useState(TODAY.year);
  const [selectedDate, setSelectedDate] = useState({
    day: TODAY.day,
    month: TODAY.month,
    year: TODAY.year,
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(getSlotsForDay(TODAY.day));

  // --- Выбор дня ---
  function handleSelectDay(day) {
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    setSelectedTime(null);                  // сброс времени
    setSlots(getSlotsForDay(day));          // слоты нового дня
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
    setSelectedDate(null);                  // сбрасываем выбор
    setSelectedTime(null);
    const firstDay = getFirstSelectableDayOfMonth(year, month, TODAY);
    setSlots(firstDay !== null ? getSlotsForDay(firstDay) : []);
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
    if (!isDateSelectable(selectedDate.day, selectedDate.month, selectedDate.year, TODAY)) {
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
            today={TODAY}
            onSelectDay={handleSelectDay}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
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