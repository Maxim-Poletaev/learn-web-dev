// src/components/Calendar/CalendarHeader.jsx
import { MONTHS_NOMINATIVE } from '../../utils/date';

export default function CalendarHeader({ year, month, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      <span className="month-year">
        {MONTHS_NOMINATIVE[month]} {year}
      </span>
      <div className="calendar-nav">
        <button
          type="button"
          className="calendar-nav-prev"
          aria-label="Предыдущий месяц"
          onClick={onPrevMonth}
        >
          &lt;
        </button>
        <button
          type="button"
          className="calendar-nav-next"
          aria-label="Следующий месяц"
          onClick={onNextMonth}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}