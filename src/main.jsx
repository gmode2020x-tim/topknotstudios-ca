import React from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  CreditCard,
  Instagram,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import "./styles.css";

const config = {
  siteUrl: import.meta.env.VITE_SITE_URL || "https://topknotstudios.ca",
  bookingUrl: import.meta.env.VITE_SQUARE_BOOKING_URL || "",
  depositPaymentUrl: import.meta.env.VITE_DEPOSIT_PAYMENT_URL || "",
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || "",
  phone: import.meta.env.VITE_CONTACT_PHONE || "(519) 123-4567",
  email: import.meta.env.VITE_CONTACT_EMAIL || "hello@topknotstudios.ca",
};

const services = [
  {
    name: "Cut + Style",
    description: "Custom cut with a wash, finish, and shape that grows out cleanly.",
    price: "Starting at $60",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Colour Refresh",
    description: "Root touch-up, gloss, or all-over refresh for lived-in colour.",
    price: "Starting at $95",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Blonding Consultation",
    description: "A personal plan for blonde goals, maintenance, timing, and budget.",
    price: "Complimentary",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Event Styling",
    description: "Soft waves, polished updos, and special-occasion finishing.",
    price: "Starting at $65",
    duration: "45-60 min",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85",
  },
];

const portfolioImages = [
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=700&q=85",
];

function bookingHref() {
  return config.bookingUrl || "#booking";
}

function instagramHref() {
  return config.instagramUrl || "https://www.instagram.com/";
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleBookingClick = (event) => {
    if (!config.bookingUrl) {
      event.preventDefault();
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Top Knot Studios home">
          <span>Top Knot</span>
          <small>Studios</small>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>
            Gallery
          </a>
          <a href="#policies" onClick={() => setMenuOpen(false)}>
            Policies
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
          <a className="button small" href={bookingHref()} onClick={handleBookingClick}>
            Book online
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Top Knot Studios</h1>
            <p>
              Private, one-on-one hair appointments in Ingersoll, Ontario.
              Thoughtful cuts, lived-in colour, and styles that feel like you.
            </p>
            <div className="hero-actions">
              <a className="button" href={bookingHref()} onClick={handleBookingClick}>
                <CalendarDays />
                Book online
              </a>
              <a className="button secondary" href="#services">
                <Scissors />
                View services
              </a>
            </div>
            <p className="location-line">
              <MapPin />
              Ingersoll, Ontario
            </p>
          </div>
          <div className="hero-image" role="img" aria-label="Stylist finishing a client's hair" />
        </section>

        <section className="section services" id="services" aria-labelledby="services-title">
          <div className="section-heading">
            <span>Services</span>
            <h2 id="services-title">Thoughtful hair, tailored to you.</h2>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.name}>
                <img src={service.image} alt="" />
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <dl>
                    <div>
                      <dt>Price</dt>
                      <dd>{service.price}</dd>
                    </div>
                    <div>
                      <dt>Time</dt>
                      <dd>{service.duration}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="booking-section" id="booking" aria-labelledby="booking-title">
          <div className="booking-copy">
            <span>Book your appointment</span>
            <h2 id="booking-title">Your time is reserved just for you.</h2>
            <p>
              Book securely through Square Appointments. A credit card may be captured
              to hold your spot, and deposits can be required for select services.
            </p>
            <ul>
              <li>
                <LockKeyhole />
                Secure booking
              </li>
              <li>
                <CreditCard />
                Secure payments
              </li>
              <li>
                <ShieldCheck />
                Deposit-ready
              </li>
            </ul>
            <div className="booking-actions">
              <a className="button" href={bookingHref()} onClick={handleBookingClick}>
                Book online
              </a>
              {config.depositPaymentUrl ? (
                <a className="button secondary" href={config.depositPaymentUrl}>
                  Pay deposit
                </a>
              ) : null}
            </div>
          </div>
          <div className="booking-widget">
            {config.bookingUrl ? (
              <iframe title="Top Knot Studios online booking" src={config.bookingUrl} />
            ) : (
              <div className="booking-placeholder">
                <CalendarDays />
                <strong>Square Appointments</strong>
                <p>
                  Add `VITE_SQUARE_BOOKING_URL` to `.env.local` after the Square
                  account is configured.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
          <div className="section-heading">
            <span>Recent work</span>
            <h2 id="gallery-title">Real people. Real results.</h2>
          </div>
          <div className="gallery-strip">
            {portfolioImages.map((image, index) => (
              <img src={image} alt="" key={image} />
            ))}
          </div>
          <a className="button secondary centered" href={instagramHref()} target="_blank" rel="noreferrer">
            <Instagram />
            View gallery
          </a>
        </section>

        <section className="policies" id="policies" aria-labelledby="policies-title">
          <div>
            <span>Policies</span>
            <h2 id="policies-title">Clear expectations before you book.</h2>
          </div>
          <div className="policy-list">
            <article>
              <h3>Booking & deposits</h3>
              <p>Some colour and event services may require a deposit to reserve the appointment.</p>
            </article>
            <article>
              <h3>Cancellations</h3>
              <p>Please give at least 24 hours notice when rescheduling or cancelling.</p>
            </article>
            <article>
              <h3>Late arrivals</h3>
              <p>Late arrivals may need to be shortened or rescheduled to protect the next guest.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="brand footer-brand">
          <span>Top Knot</span>
          <small>Studios</small>
        </div>
        <p>A private hair studio in Ingersoll, Ontario offering personal, one-on-one hair services.</p>
        <address>
          <a href={`tel:${config.phone.replace(/[^+\d]/g, "")}`}>
            <Phone />
            {config.phone}
          </a>
          <a href={`mailto:${config.email}`}>
            <Mail />
            {config.email}
          </a>
          <span>
            <MapPin />
            Ingersoll, Ontario
          </span>
          <a href={instagramHref()} target="_blank" rel="noreferrer">
            <Instagram />
            Instagram
          </a>
        </address>
        <a className="button small" href={bookingHref()} onClick={handleBookingClick}>
          Book online
        </a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
