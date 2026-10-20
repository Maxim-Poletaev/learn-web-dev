// src/components/TimeSlots.jsx
export default function TimeSlots({
  slots,
  selectedTime,
  onSelectTime,
  loading,
  error,
}) {
  return (
    <div className="time-card">
      <span className="header-time">Доступное время</span>

      <div className="time-slots">
        {loading ? (
          <div style={{ padding: "20px", color: "#6B6661" }}>
            Загрузка…
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "#B00020" }}>
            Ошибка загрузки слотов: {error}
          </div>
        ) : slots.length === 0 ? (
          <div style={{ padding: "20px", color: "#6B6661" }}>
            В этот день нет доступного времени
          </div>
        ) : (
          slots.map((slot) => {
            const classes = ["time-slot"];
            if (!slot.available) classes.push("unavailable");
            if (slot.available && slot.time === selectedTime) {
              classes.push("selected");
            }

            return (
              <button
                key={slot.time}
                type="button"
                className={classes.join(" ")}
                disabled={!slot.available}
                onClick={
                  slot.available ? () => onSelectTime(slot.time) : undefined
                }
              >
                {slot.time}
                {!slot.available && <span>Занято</span>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}