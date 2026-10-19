// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer>
      <div className="footer-data">
        <img src="/images/logo-white.png" alt="logo" />

        <div className="contact">
          <span className="header-contact">КОНТАКТЫ</span>
          <div className="address">
            <img src="/images/map-icon.png" alt="map-icon" />
            <span className="address-text">ул. Садовая, 15, Москва</span>
          </div>
          <div className="phone-section">
            <img src="/images/phone-icon.png" alt="phone-icon" />
            <span className="phone-text">+7 (495) 123-45-67</span>
          </div>
        </div>

        <div className="operations-hours">
          <span className="header-operations">РЕЖИМ РАБОТЫ</span>
          <span className="hour-section">Пн–Пт: 9:00 – 21:00</span>
          <span className="hour-section">Сб–Вс: 10:00 – 19:00</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026. Все права защищены.</span>
        <span>
          <a href="#">Политика конфиденциальности</a>
        </span>
      </div>
    </footer>
  );
}