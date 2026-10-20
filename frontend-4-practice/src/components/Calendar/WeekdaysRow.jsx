// src/components/Calendar/WeekdaysRow.jsx
import { WEEKDAYS_SHORT } from '../../utils/date';

export default function WeekdaysRow() {
  return (
    <div className="months">
      {WEEKDAYS_SHORT.map((day) => (
        <span key={day}>{day}</span>
      ))}
    </div>
  );
}