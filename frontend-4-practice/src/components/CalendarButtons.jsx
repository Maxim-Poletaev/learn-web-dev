// src/components/CalendarButtons.jsx
export default function CalendarButtons({ onBack, onNext }) {
  return (
    <div className="calendar-buttons">
      <button type="button" className="booking-back-button" onClick={onBack}>
        НАЗАД
      </button>
      <button type="button" className="booking-next-btn" onClick={onNext}>
        ВЫБРАТЬ
      </button>
    </div>
  );
}