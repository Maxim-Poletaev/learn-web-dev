// src/components/BookingSummary.jsx
import { formatSelectedDate } from '../utils/date';

export default function BookingSummary({ selectedDate, selectedTime }) {
  let text;

  if (!selectedDate) {
    text = selectedTime ? "дата не выбрана • " + selectedTime : "—";
  } else {
    const datePart = formatSelectedDate(selectedDate);
    const timePart = selectedTime || "время не выбрано";
    text = datePart + " • " + timePart;
  }

  return (
    <div className="booking-summary" aria-live="polite">
      <span className="booking-summary__label">Вы выбрали:</span>
      <span className="booking-summary__value">{text}</span>
    </div>
  );
}