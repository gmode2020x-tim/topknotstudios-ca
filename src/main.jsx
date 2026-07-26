import React from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Save,
  Scissors,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { defaultGallery, normalizeGallery, normalizeServices } from "./galleryData.js";
import "./styles.css";

const config = {
  siteUrl: import.meta.env.VITE_SITE_URL || "https://topknotstudios.ca",
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || "",
  phone: import.meta.env.VITE_CONTACT_PHONE || "519 221 9634",
  email: import.meta.env.VITE_CONTACT_EMAIL || "jodie@topknotstudios.ca",
  address:
    import.meta.env.VITE_STUDIO_ADDRESS ||
    "216 King Street East, Ingersoll Ontario, N5C 1H2",
};

const emailSubject = encodeURIComponent("Appointment request for Top Knot Studios");
const emailBody = encodeURIComponent(
  "Hi Top Knot Studios,\n\nI would like to request an appointment.\n\nService:\nPreferred date/time:\nHair goals or notes:\n\nThank you,"
);

const appointmentRequestHref = `mailto:${config.email}?subject=${emailSubject}&body=${emailBody}`;
const mapsHref = "https://www.google.com/maps?cid=7959846592753645575";

const productNotes = [
  {
    title: "Colour support",
    text: "Redken colour options help support root touch-ups, glossing, toning, grey coverage, and refresh services.",
  },
  {
    title: "Tone maintenance",
    text: "Blonde and colour appointments include practical care guidance for keeping tone and shine looking intentional.",
  },
  {
    title: "Take-home care",
    text: "Product recommendations are based on your hair, your routine, and how much upkeep you realistically want.",
  },
];

const prepNotes = [
  "New colour clients start with a consultation.",
  "Arrive with your regular styling routine in mind.",
  "Photos are welcome for direction, not a promise of an exact copy.",
];

const policyItems = [
  {
    title: "Booking requests",
    text: "Some colour and event appointments may need a consultation before the time is confirmed.",
  },
  {
    title: "Cancellations",
    text: "Please give at least 24 hours notice when cancelling or rescheduling.",
  },
  {
    title: "Late arrivals",
    text: "Late arrivals may need to be shortened or rescheduled to protect the next guest.",
  },
];

const paymentEmail = "jodie@topknotstudios.ca";

const stylistBio = {
  name: "Jodie Hill",
  title: "Owner stylist",
  image: "/images/studio/jodie-hill-bio.jpg",
  text:
    "With over 20 years of experience behind the chair, Jodie Hill is passionate about helping every client feel confident, current, and beautiful. She keeps up to date with the latest styles, techniques, and trends through ongoing Redken education based out of Toronto, bringing fresh, modern looks into the studio.",
  specialty:
    "Jodie specializes in colours and highlights, creating personalized styles that suit each client's hair, lifestyle, and personality. Her goal is for every guest to leave feeling happy, comfortable, and excited about their new look.",
};

function bookingHref() {
  return appointmentRequestHref;
}

function phoneHref() {
  return config.phone ? `tel:${config.phone.replace(/[^+\d]/g, "")}` : "";
}

function categoryServiceImage(category) {
  return category.items?.[0]?.src || "/images/studio/studio-main.jpg";
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

function moveItem(categories, imageId, nextCategoryId) {
  let movedItem = null;
  const withoutItem = categories.map((category) => ({
    ...category,
    items: category.items.filter((item) => {
      if (item.id === imageId) movedItem = item;
      return item.id !== imageId;
    }),
  }));

  if (!movedItem) return categories;

  return withoutItem.map((category) =>
    category.id === nextCategoryId
      ? { ...category, items: [{ ...movedItem, alt: movedItem.alt || `${category.label} hairstyle example` }, ...category.items] }
      : category,
  );
}

function isHeicFile(file) {
  const name = file.name?.toLowerCase() || "";
  const type = file.type?.toLowerCase() || "";
  return type.includes("heic") || type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif");
}

function loadImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(blob);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Browser could not decode this image file."));
    };

    image.src = url;
  });
}

async function loadUploadImage(file) {
  try {
    return await loadImageFromBlob(file);
  } catch (decodeError) {
    if (!isHeicFile(file)) {
      throw decodeError;
    }

    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
    return loadImageFromBlob(convertedBlob);
  }
}

async function normalizeImageFile(file) {
  if (!file.type?.startsWith("image/") && !isHeicFile(file)) {
    throw new Error("Choose an image file.");
  }

  const image = await loadUploadImage(file);
  const outputWidth = 1200;
  const outputHeight = 1500;
  const sourceRatio = image.width / image.height;
  const targetRatio = outputWidth / outputHeight;
  const sourceWidth = sourceRatio > targetRatio ? image.height * targetRatio : image.width;
  const sourceHeight = sourceRatio > targetRatio ? image.height : image.width / targetRatio;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image processing is not available in this browser.");
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;
  context.filter = "brightness(1.08) contrast(0.96) saturate(0.9)";
  context.fillStyle = "#fff8f6";
  context.fillRect(0, 0, outputWidth, outputHeight);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
  return canvas.toDataURL("image/jpeg", 0.84);
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [galleryCategories, setGalleryCategories] = React.useState(defaultGallery);
  const [serviceRows, setServiceRows] = React.useState([]);
  const [activeGallery, setActiveGallery] = React.useState("");

  React.useEffect(() => {
    let ignore = false;

    fetchJson("/api/gallery")
      .then((data) => {
        if (ignore) return;
        const categories = normalizeGallery(data.categories);
        setGalleryCategories(categories.length ? categories : defaultGallery);
        setServiceRows(normalizeServices(data.services));
        setActiveGallery((current) => (categories.find((category) => category.id === current) ? current : ""));
      })
      .catch(() => {
        if (!ignore) setGalleryCategories(defaultGallery);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const activeGalleryCategory = galleryCategories.find((category) => category.id === activeGallery) || null;
  const serviceCategories = galleryCategories.filter((category) => category.label);
  const openGalleryCategory = (categoryId) => {
    setActiveGallery(categoryId);
    closeMenu();
    window.setTimeout(() => {
      document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Top Knot Studios home" onClick={closeMenu}>
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
          <a href="#services" onClick={closeMenu}>
            Services
          </a>
          <a href="#experience" onClick={closeMenu}>
            Experience
          </a>
          <a href="#products" onClick={closeMenu}>
            Products
          </a>
          <a href="#gallery" onClick={closeMenu}>
            Gallery
          </a>
          <a href="#booking" onClick={closeMenu}>
            Booking
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <a className="button small" href={bookingHref()} onClick={closeMenu}>
            Request appointment
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Top Knot Studios</h1>
            <p>
              Private, one-on-one hair appointments in Ingersoll for cuts, colour,
              blonding plans, and event styling with a calm studio pace and
              professional Redken colour care.
            </p>
            <div className="hero-actions">
              <a className="button" href={bookingHref()}>
                <CalendarDays />
                Request appointment
              </a>
              <a className="button secondary" href="#services">
                <Scissors />
                View services
              </a>
            </div>
            <div className="hero-details" aria-label="Studio details">
              <span>
                <MapPin />
                {config.address}
              </span>
              {config.phone ? (
                <a href={phoneHref()}>
                  <Phone />
                  {config.phone}
                </a>
              ) : null}
              <span>
                <Clock />
                By appointment
              </span>
            </div>
          </div>
          <div className="hero-image" role="img" aria-label="Modern salon studio with warm mirrors and styling chairs" />
        </section>

        <section className="section services" id="services" aria-labelledby="services-label">
          <div className="section-heading">
            <span id="services-label">Services</span>
          </div>
          <div className="service-grid">
            {serviceCategories.map((category) => (
              <button
                className="service-card"
                type="button"
                key={category.id}
                onClick={() => openGalleryCategory(category.id)}
              >
                <img src={categoryServiceImage(category)} alt="" loading="lazy" />
                <div>
                  <h3>{category.label}</h3>
                  <p>{category.summary}</p>
                </div>
              </button>
            ))}
          </div>
          {serviceRows.length ? (
            <div className="service-table-wrap" aria-label="Price list">
              <h3>Price list</h3>
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRows.map((service) => (
                    <tr key={service.id}>
                      <td data-label="Service">{service.name}</td>
                      <td data-label="Description">{service.description}</td>
                      <td data-label="Price">{service.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="experience" id="experience" aria-labelledby="experience-title">
          <div className="experience-image" role="img" aria-label="Stylist preparing tools for a private appointment" />
          <div className="experience-copy">
            <span>Studio experience</span>
            <h2 id="experience-title">A quieter chair, a clearer plan.</h2>
            <p>
              Top Knot Studios is built around one-on-one appointments, honest timing,
              Redken-supported colour care, and styles that make sense after you
              leave the salon.
            </p>
            <ul>
              {prepNotes.map((note) => (
                <li key={note}>
                  <CheckCircle2 />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="stylist-bio" aria-labelledby="stylist-bio-title">
          <div className="stylist-bio-heading">
            <img src={stylistBio.image} alt="Jodie Hill" loading="lazy" />
            <div>
              <span>{stylistBio.title}</span>
              <h2 id="stylist-bio-title">{stylistBio.name}</h2>
            </div>
          </div>
          <div className="stylist-bio-copy">
            <p>{stylistBio.text}</p>
            <p>{stylistBio.specialty}</p>
          </div>
        </section>

        <section className="products" id="products" aria-labelledby="products-title">
          <div className="products-copy">
            <span>Redken in studio</span>
            <h2 id="products-title">Colour, gloss, and care with a professional product system.</h2>
            <p>
              Redken is used in the studio for colour services, blonding support,
              styling, and take-home care conversations. The goal is simple: a plan
              that looks polished on appointment day and still makes sense weeks later.
            </p>
            <div className="product-note-list">
              {productNotes.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="products-media" aria-label="Redken product shelves inside Top Knot Studios">
            <img src="/images/studio/redken-color-wall.jpg" alt="" loading="lazy" />
            <img src="/images/studio/redken-care.jpg" alt="" loading="lazy" />
          </div>
        </section>

        <section className="booking-section" id="booking" aria-labelledby="booking-title">
          <div className="booking-copy">
            <span>Booking</span>
            <h2 id="booking-title">Request your appointment.</h2>
            <p>
              Appointments are booked by email or phone. Include the service you are
              interested in, your preferred timing, and any hair goals or notes.
            </p>
            <ul>
              <li>
                <Mail />
                Email request available now at {config.email}
              </li>
              <li>
                <Phone />
                Call or text {config.phone}
              </li>
              <li>
                <CalendarDays />
                Appointment is confirmed directly with the studio
              </li>
              <li>
                <ShieldCheck />
                Payments accepted by e-transfer to {paymentEmail} or cash
              </li>
            </ul>
            <div className="booking-actions">
              <a className="button" href={bookingHref()}>
                Request appointment
              </a>
            </div>
          </div>
          <div className="booking-panel">
            <Mail />
            <h3>Email or call to book.</h3>
            <p>
              Send an appointment request to {config.email}, or call/text {config.phone}.
              Payments are accepted by e-transfer to {paymentEmail} or by cash.
            </p>
            <a href={appointmentRequestHref}>Send appointment request</a>
          </div>
        </section>

        <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
          <div className="section-heading">
            <span>Style gallery</span>
            <h2 id="gallery-title">Hair inspiration, sorted by service direction.</h2>
            <p>
              A curated set of hairstyle references, cropped and finished with the
              same bright salon treatment so the gallery feels cohesive.
            </p>
          </div>
          <div className="gallery-controls" role="tablist" aria-label="Hair gallery categories">
            {galleryCategories.map((category) => (
              <button
                className={category.id === activeGalleryCategory?.id ? "active" : ""}
                type="button"
                role="tab"
                aria-selected={category.id === activeGalleryCategory?.id}
                aria-controls="style-gallery-panel"
                key={category.id}
                onClick={() => openGalleryCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
          {activeGalleryCategory ? (
            <>
              <div className="gallery-intro" id="style-gallery-panel" role="tabpanel">
                <p>{activeGalleryCategory.summary}</p>
                <span>{activeGalleryCategory.items.length} looks</span>
              </div>
              <div className="style-gallery-grid">
                {activeGalleryCategory.items.map((image) => (
                  <img src={image.src} alt={image.alt} key={image.src} loading="lazy" />
                ))}
              </div>
            </>
          ) : (
            <div className="gallery-empty" id="style-gallery-panel" role="tabpanel">
              Select a category to view the image library.
            </div>
          )}
          {config.instagramUrl ? (
            <a className="button secondary centered" href={config.instagramUrl} target="_blank" rel="noreferrer">
              View Instagram
            </a>
          ) : null}
        </section>

        <section className="policies" id="policies" aria-labelledby="policies-title">
          <div>
            <span>Policies</span>
            <h2 id="policies-title">Clear expectations before you book.</h2>
          </div>
          <div className="policy-list">
            {policyItems.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
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
          {config.phone ? (
            <a href={phoneHref()}>
              <Phone />
              {config.phone}
            </a>
          ) : null}
          <a href={`mailto:${config.email}`}>
            <Mail />
            {config.email}
          </a>
          <a href={mapsHref} target="_blank" rel="noreferrer">
            <MapPin />
            {config.address}
          </a>
        </address>
        <a className="button small" href={bookingHref()}>
          Request appointment
        </a>
      </footer>
    </>
  );
}

function AdminApp() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authenticated, setAuthenticated] = React.useState(false);
  const [categories, setCategories] = React.useState(defaultGallery);
  const [services, setServices] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(defaultGallery[0].id);
  const [status, setStatus] = React.useState("Loading gallery.");
  const [error, setError] = React.useState("");
  const [storageConfigured, setStorageConfigured] = React.useState(false);

  const selected = categories.find((category) => category.id === selectedCategory) || categories[0] || defaultGallery[0];

  const loadGallery = React.useCallback(async () => {
    const data = await fetchJson("/api/gallery");
    const nextCategories = normalizeGallery(data.categories);
    setCategories(nextCategories.length ? nextCategories : defaultGallery);
    setServices(normalizeServices(data.services));
    setSelectedCategory((current) => nextCategories.find((category) => category.id === current)?.id || nextCategories[0]?.id || defaultGallery[0].id);
    setAuthenticated(Boolean(data.authenticated));
    setStorageConfigured(Boolean(data.storageConfigured));
    setStatus(data.usingFallback ? "Loaded fallback gallery. Configure Blob storage to save changes." : "Gallery loaded.");
  }, []);

  React.useEffect(() => {
    loadGallery().catch((requestError) => {
      setError(requestError.message);
      setStatus("Gallery API is unavailable.");
    });
  }, [loadGallery]);

  async function login(event) {
    event.preventDefault();
    setError("");
    setStatus("Signing in.");
    try {
      await fetchJson("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setUsername("");
      setPassword("");
      await loadGallery();
      setStatus("Signed in.");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("Sign in failed.");
    }
  }

  async function logout() {
    await fetchJson("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => {});
    setAuthenticated(false);
    setStatus("Signed out.");
  }

  async function save(nextCategories = categories, nextServices = services) {
    setError("");
    setStatus("Saving changes.");
    try {
      const data = await fetchJson("/api/gallery", {
        method: "PUT",
        body: JSON.stringify({
          categories: normalizeGallery(nextCategories),
          services: normalizeServices(nextServices),
        }),
      });
      setCategories(normalizeGallery(data.categories));
      setServices(normalizeServices(data.services));
      setStatus("Saved.");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("Save failed.");
    }
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selected) return;

    setError("");
    setStatus("Normalizing and uploading image.");
    try {
      const image = await normalizeImageFile(file);
      const data = await fetchJson("/api/gallery", {
        method: "POST",
        body: JSON.stringify({
          categoryId: selected.id,
          alt: `${selected.label} hairstyle example`,
          image,
        }),
      });
      setCategories(normalizeGallery(data.categories));
      setStatus("Image uploaded.");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("Upload failed.");
    }
  }

  async function deleteImage(imageId) {
    setError("");
    setStatus("Deleting image.");
    try {
      const data = await fetchJson("/api/gallery", {
        method: "DELETE",
        body: JSON.stringify({ imageId }),
      });
      setCategories(normalizeGallery(data.categories));
      setStatus("Image deleted.");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("Delete failed.");
    }
  }

  function updateCategory(categoryId, patch) {
    setCategories((current) =>
      normalizeGallery(
        current.map((category) => (category.id === categoryId ? { ...category, ...patch } : category)),
      ),
    );
  }

  function addCategory() {
    const id = `category-${Date.now()}`;
    const next = [...categories, { id, label: "New Category", summary: "", items: [] }];
    setCategories(next);
    setSelectedCategory(id);
  }

  function removeCategory(categoryId) {
    const category = categories.find((item) => item.id === categoryId);
    if (!category || category.items.length) {
      setError("Only empty categories can be removed. Move or delete the images first.");
      return;
    }
    const next = categories.filter((item) => item.id !== categoryId);
    setCategories(next);
    setSelectedCategory(next[0]?.id || defaultGallery[0].id);
  }

  function moveImage(imageId, nextCategoryId) {
    setCategories((current) => moveItem(current, imageId, nextCategoryId));
  }

  function addService() {
    setServices((current) => [
      ...current,
      { id: `service-${Date.now()}`, name: "", description: "", price: "" },
    ]);
  }

  function updateService(serviceId, patch) {
    setServices((current) =>
      current.map((service) => (service.id === serviceId ? { ...service, ...patch } : service)),
    );
  }

  function removeService(serviceId) {
    setServices((current) => current.filter((service) => service.id !== serviceId));
  }

  return (
    <main className="admin-shell">
      <section className="admin-topbar">
        <div>
          <a href="/" className="admin-brand">Top Knot Studios</a>
          <h1>Gallery Admin</h1>
          <p>Manage categories, move images, upload normalized salon-style photos, and remove old images.</p>
        </div>
        {authenticated ? (
          <button className="button secondary" type="button" onClick={logout}>
            <LogOut />
            Sign out
          </button>
        ) : null}
      </section>

      {!authenticated ? (
        <form className="admin-login" onSubmit={login}>
          <h2>Administrator login</h2>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" autoComplete="username" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
          </label>
          <button className="button" type="submit">Sign in</button>
          <p>{status}</p>
          {error ? <p className="admin-error">{error}</p> : null}
        </form>
      ) : (
        <section className="admin-grid">
          <aside className="admin-sidebar">
            <div className="admin-actions">
              <button className="button" type="button" onClick={() => save()}>
                <Save />
                Save changes
              </button>
              <button className="button secondary" type="button" onClick={addCategory}>
                <Plus />
                Add category
              </button>
            </div>
            <p className={storageConfigured ? "admin-status" : "admin-warning"}>{status}</p>
            {error ? <p className="admin-error">{error}</p> : null}
            {categories.map((category) => (
              <button
                className={category.id === selected.id ? "admin-category active" : "admin-category"}
                type="button"
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.label}</span>
                <small>{category.items.length} images</small>
              </button>
            ))}
          </aside>

          <section className="admin-panel">
            <div className="admin-service-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Price list</h2>
                  <p>These rows generate the public price table. Library categories do not store prices.</p>
                </div>
                <button className="button secondary" type="button" onClick={addService}>
                  <Plus />
                  Add service
                </button>
              </div>
              <div className="admin-service-list">
                {services.length ? (
                  services.map((service) => (
                    <article className="admin-service-row" key={service.id}>
                      <label>
                        Service
                        <input value={service.name} onChange={(event) => updateService(service.id, { name: event.target.value })} placeholder="Cut + Finish" />
                      </label>
                      <label>
                        Description
                        <input value={service.description} onChange={(event) => updateService(service.id, { description: event.target.value })} placeholder="Wash, cut, and style" />
                      </label>
                      <label>
                        Price
                        <input value={service.price} onChange={(event) => updateService(service.id, { price: event.target.value })} placeholder="From $60" />
                      </label>
                      <button className="admin-delete" type="button" onClick={() => removeService(service.id)}>
                        <Trash2 />
                        Remove
                      </button>
                    </article>
                  ))
                ) : (
                  <p className="admin-empty">No services entered yet. Add a service to publish the price table.</p>
                )}
              </div>
            </div>

            <div className="admin-editor">
              <label>
                Category name
                <input value={selected.label} onChange={(event) => updateCategory(selected.id, { label: event.target.value })} />
              </label>
              <label>
                Gallery summary
                <textarea value={selected.summary} onChange={(event) => updateCategory(selected.id, { summary: event.target.value })} />
              </label>
              <div className="admin-editor-actions">
                <label className="button upload-button">
                  <Upload />
                  Add image
                  <input type="file" accept="image/*,.heic,.heif" onChange={upload} />
                </label>
                <button className="button secondary" type="button" onClick={() => removeCategory(selected.id)}>
                  <Trash2 />
                  Remove empty category
                </button>
              </div>
            </div>

            <div className="admin-image-grid">
              {selected.items.map((image) => (
                <article className="admin-image-card" key={image.id}>
                  <img src={image.src} alt={image.alt} />
                  <label>
                    Move to
                    <select value={selected.id} onChange={(event) => moveImage(image.id, event.target.value)}>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.label}</option>
                      ))}
                    </select>
                  </label>
                  <button className="admin-delete" type="button" onClick={() => deleteImage(image.id)}>
                    <Trash2 />
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(window.location.pathname.startsWith("/admin") ? <AdminApp /> : <App />);
