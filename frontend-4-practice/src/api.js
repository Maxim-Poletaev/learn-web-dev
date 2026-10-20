// src/api.js
//
// Тонкая обёртка над fetch для запросов к имитационному серверу.
// Все функции возвращают Promise с JSON-данными.

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    // Пытаемся вытащить сообщение об ошибке из тела ответа,
    // если сервер его прислал.
    let message = `Ошибка ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch (_) {
      // тело не JSON — оставляем стандартное сообщение
    }
    throw new Error(message);
  }

  return response.json();
}

// fetchToday — «сегодня» по мнению сервера.
// Возвращает { day, month, year } (month 0-индексный).
export async function fetchToday() {
  return request("/api/booking/today");
}

// fetchSlots — слоты на конкретную дату.
// Принимает { day, month, year }, возвращает { date, slots }.
export async function fetchSlots(date) {
  const url = `/api/slots?day=${date.day}&month=${date.month}&year=${date.year}`;
  return request(url);
}