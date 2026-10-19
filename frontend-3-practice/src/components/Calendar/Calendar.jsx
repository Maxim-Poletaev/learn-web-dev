// src/components/Calendar/Calendar.jsx
import CalendarHeader from './CalendarHeader';
import WeekdaysRow from './WeekdaysRow';
import DaysGrid from './DaysGrid';

export default function Calendar({
  year,
  month,
  selectedDate,
  today,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    <div className="calendar-card">
      <CalendarHeader
        year={year}
        month={month}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      <div className="months-grid">
        <WeekdaysRow />
        <DaysGrid
          year={year}
          month={month}
          selectedDate={selectedDate}
          today={today}
          onSelectDay={onSelectDay}
        />
      </div>
    </div>
  );
}