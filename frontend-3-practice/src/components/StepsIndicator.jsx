// src/components/StepsIndicator.jsx

// Данные о шагах. active — текущий шаг (3 = «Выбор даты»).
const STEPS = [
  { number: 1, title: "Выбор мастера", active: false },
  { number: 2, title: "Выбор услуги", active: false },
  { number: 3, title: "Выбор даты", active: true },
  { number: 4, title: "Контактные данные", active: false },
  { number: 5, title: "Подтверждение", active: false },
];

export default function StepsIndicator() {
  return (
    <section>
      {STEPS.map((step) => (
        <div key={step.number} className="step-indicator">
          <div className={step.active ? "circle" : "circle empty"}>
            <span>{step.number}</span>
          </div>
          <span className={step.active ? "step-text not-empty" : "step-text"}>
            {step.title}
          </span>
        </div>
      ))}
    </section>
  );
}