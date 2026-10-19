// src/components/Calendar/DaysGrid.jsx
import { buildCalendarGrid, isDateSelectable } from '../../utils/date';

export default function DaysGrid({ year, month, selectedDate, today, onSelectDay }) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <div className="grid-days">
      {weeks.map((week, weekIndex) => (
        <div className="grid-row" key={weekIndex}>
          {week.map((cell, cellIndex) => {
            const classes = ["day-cell"];
            if (cell.otherMonth) classes.push("other-month");

            const isToday =
              !cell.otherMonth &&
              cell.day === today.day &&
              month === today.month &&
              year === today.year;
            if (isToday) classes.push("today");

            const isSelected =
              !cell.otherMonth &&
              selectedDate &&
              cell.day === selectedDate.day &&
              month === selectedDate.month &&
              year === selectedDate.year;
            if (isSelected) classes.push("selected");

            const selectable = isDateSelectable(cell.day, month, year, today);
            if (!cell.otherMonth && !selectable) classes.push("disabled");

            const disabled = cell.otherMonth || !selectable;

            return (
              <button
                key={cellIndex}
                type="button"
                className={classes.join(" ")}
                disabled={disabled}
                onClick={disabled ? undefined : () => onSelectDay(cell.day)}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}