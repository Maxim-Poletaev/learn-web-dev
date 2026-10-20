// src/App.jsx
import { useEffect, useState } from 'react';
import BookingPage from './BookingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchToday } from './api';

export default function App() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchToday();
        if (!cancelled) setToday(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <Header />
        <main>
          <h1>Выберите дату и время</h1>
          <p style={{ padding: "0 48px" }}>Загрузка…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header />
        <main>
          <h1>Выберите дату и время</h1>
          <p style={{ padding: "0 48px", color: "#B00020" }}>
            Не удалось загрузить данные: {error}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return <BookingPage today={today} />;
}