import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const Arrow = () => <span aria-hidden="true">→</span>;

async function api(path, options = {}, token) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}), ...(options.headers || {}) }
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Please try again.");
  return data;
}

function Logo() {
  return <a className="brand" href="#home"><span className="logo">✳</span><span><b>Arun Homeo Clinic</b><small>Care, with consideration</small></span></a>;
}

function Auth({ mode, setMode, onAuth, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", consent: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const payload = mode === "register" ? form : { email: form.email, password: form.password };
      const result = await api(mode === "register" ? "/api/auth/register" : "/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
      onAuth(result);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <section className="portal"><div className="auth-card">
    <button className="back" onClick={onBack}>← Clinic home</button>
    <small className="eyebrow">{mode === "register" ? "Patient account" : "Welcome back"}</small>
    <h1>{mode === "register" ? "Create your account." : "Sign in."}</h1>
    <p className="muted">{mode === "register" ? "Request appointment dates and keep your history in one private place." : "Access your appointment history and account."}</p>
    <form onSubmit={submit} className="form">
      {mode === "register" && <label>Full name<input required maxLength="80" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}
      <label>Email<input required type="email" maxLength="160" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      {mode === "register" && <label>Contact number<input required type="tel" pattern="[+]?[0-9 ()-]{7,20}" autoComplete="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>}
      <label>Password<input required type="password" minLength="10" maxLength="72" autoComplete={mode === "register" ? "new-password" : "current-password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /><small>Use at least 10 characters.</small></label>
      {mode === "register" && <label className="consent"><input type="checkbox" required checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} />I agree to the clinic using these details to manage my account and appointment requests.</label>}
      {error && <p className="error" role="alert">{error}</p>}
      <button className="button wide" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create patient account" : "Sign in"} <Arrow /></button>
    </form>
    <p className="switch">{mode === "register" ? "Already registered?" : "New to the clinic?"} <button onClick={() => setMode(mode === "register" ? "login" : "register")}>{mode === "register" ? "Sign in" : "Create an account"}</button></p>
  </div></section>;
}

function Dashboard({ auth, onLogout, onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const admin = auth.user.role === "ADMIN";
  async function load() {
    setLoading(true);
    try { setAppointments(await api(admin ? "/api/admin/appointments" : "/api/patient/appointments", {}, auth.token)); }
    catch (e) { setMessage(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function request(event) {
    event.preventDefault(); setMessage("");
    try {
      await api("/api/patient/appointments", { method: "POST", body: JSON.stringify({ appointmentDate: date }) }, auth.token);
      setDate(""); setMessage("Request received. The clinic will contact you to confirm availability."); load();
    } catch (e) { setMessage(e.message); }
  }
  async function updateStatus(id, status) {
    try { await api("/api/admin/appointments/" + id + "/status", { method: "PUT", body: JSON.stringify({ status }) }, auth.token); load(); }
    catch (e) { setMessage(e.message); }
  }
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  return <section className="portal"><div className="dashboard">
    <button className="back" onClick={onBack}>← Clinic home</button>
    <div className="dash-head"><div><small className="eyebrow">{admin ? "Clinic administration" : "Patient portal"}</small><h1>{admin ? "Appointment requests." : "Hello, " + auth.user.name.split(" ")[0] + "."}</h1><p className="muted">{admin ? "Review requests and update their status." : "Manage your requests and appointment history."}</p></div><aside className="profile"><b>{auth.user.name}</b><span>{auth.user.email}</span><span>{auth.user.phone}</span></aside></div>
    {message && <p className="success" role="status">{message}</p>}
    {!admin && <form className="request" onSubmit={request}><div><small className="eyebrow">New appointment</small><h2>Request a visit</h2><p className="muted">Choose a preferred date; the clinic will contact you to confirm.</p></div><label>Preferred date<input type="date" required min={today} value={date} onChange={e => setDate(e.target.value)} /></label><button className="button">Send request <Arrow /></button><small className="muted">Please do not include health or symptom details.</small></form>}
    <div className="history-title"><div><small className="eyebrow">{admin ? "All patients" : "Your records"}</small><h2>{admin ? "Appointment requests" : "Appointment history"}</h2></div><span className="badge">{appointments.length} {appointments.length === 1 ? "visit" : "visits"}</span></div>
    {loading ? <p className="muted">Loading appointments…</p> : appointments.length === 0 ? <div className="empty"><b>✳</b><h3>No appointments yet</h3><p>Requests and visit history will appear here.</p></div> : <div className="appointments">{appointments.map(a => <article className="appt" key={a.id}><div className="date"><b>{new Date(a.appointmentDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit" })}</b><span>{new Date(a.appointmentDate + "T00:00:00").toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span></div><div className="appt-info"><b>{admin ? a.patientName : "Clinic appointment"}</b><span>{admin ? a.patientEmail + " · " + a.patientPhone : "Requested " + new Date(a.createdAt).toLocaleDateString("en-IN")}</span></div><span className={"status " + a.status.toLowerCase()}>{a.status.toLowerCase()}</span>{admin && <select aria-label="Update appointment status" value={a.status} onChange={e => updateStatus(a.id, e.target.value)}><option>PENDING</option><option>CONFIRMED</option><option>COMPLETED</option><option>CANCELLED</option></select>}</article>)}</div>}
    <p className="privacy">Account details and appointment history are private. For urgent concerns, contact a qualified medical professional.</p><button className="link signout" onClick={onLogout}>Sign out</button>
  </div></section>;
}

function App() {
  const [auth, setAuth] = useState(() => { try { return JSON.parse(sessionStorage.getItem("clinic-auth") || "null"); } catch { return null; } });
  const [page, setPage] = useState(auth ? "dashboard" : "home");
  const [mode, setMode] = useState("login");
  const [menu, setMenu] = useState(false);
  function showAuth(value) { setMode(value); setPage("auth"); window.scrollTo(0, 0); }
  function done(value) { setAuth(value); sessionStorage.setItem("clinic-auth", JSON.stringify(value)); setPage("dashboard"); }
  function logout() { setAuth(null); sessionStorage.removeItem("clinic-auth"); setPage("home"); }
  function home() { setPage("home"); window.scrollTo(0, 0); }
  return <>
    <div className="topline">A welcoming space for thoughtful, individual care</div>
    <header><nav className="nav wrap"><Logo /><div className={"navlinks " + (menu ? "open" : "")}><a href="#about" onClick={() => setMenu(false)}>Our approach</a><a href="#care" onClick={() => setMenu(false)}>Consultations</a><a href="#visit" onClick={() => setMenu(false)}>Visit us</a></div><div className="nav-actions">{auth ? <><button className="link" onClick={() => setPage("dashboard")}>My {auth.user.role === "ADMIN" ? "admin" : "account"}</button><button className="button compact" onClick={logout}>Sign out</button></> : <><button className="link" onClick={() => showAuth("login")}>Sign in</button><button className="button compact" onClick={() => showAuth("register")}>Create account</button></>}</div><button className="menu" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>☰</button></nav></header>
    {page === "auth" && <Auth mode={mode} setMode={setMode} onAuth={done} onBack={home} />}
    {page === "dashboard" && auth && <Dashboard auth={auth} onLogout={logout} onBack={home} />}
    {page === "home" && <main>
      <section className="hero" id="home"><div className="wrap hero-grid"><div><small className="eyebrow">Welcome to Arun Homeo Clinic</small><h1>Care that starts with <em>listening.</em></h1><p className="lead">A calm, welcoming place for one-to-one homeopathic consultations. We take time to understand your concerns and discuss a considered next step together.</p><div className="actions"><button className="button" onClick={() => showAuth("register")}>Request an appointment <Arrow /></button><a className="button secondary" href="#about">Explore our approach</a></div><p className="trust"><i />Personal attention in a thoughtful setting</p></div><div className="art"><div className="art-inner"><svg viewBox="0 0 420 420" role="img" aria-label="Leafy plant in a terracotta pot"><circle cx="210" cy="185" r="130" fill="#edf1e8"/><path d="M210 330c-5-82 0-144 17-234M213 252c-58-14-74-50-65-82 42 8 62 39 65 82Zm8-44c53-24 66-61 46-94-39 16-57 49-46 94Zm-8 87c-42-4-65-28-62-55 33-3 59 17 62 55Zm4-17c38-23 61-18 74 3-17 25-45 32-74-3Z" fill="none" stroke="#55795c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M156 330h108l-12 63h-84l-12-63Zm-8-10h124v16H148z" fill="#c87958"/></svg></div><div className="float f1">✳ <span>Time to be heard<small>Every visit begins with you</small></span></div><div className="float f2">⌂ <span>A welcoming clinic<small>Thoughtful care, at your pace</small></span></div></div></div></section>
      <section className="section intro" id="about"><div className="wrap split"><div><small className="eyebrow">A considered approach</small><h2>Good care makes room for your whole story.</h2><p className="muted">Every person is different. Our consultations are an opportunity to talk through what has been on your mind, ask questions, and decide on a way forward together.</p></div><div className="qualities">{[["◌", "Time to listen", "We make space for your questions and what you want to discuss."], ["✳", "Individual attention", "Your conversation guides the consultation and next steps."], ["⌂", "A welcoming space", "A calm, respectful place for a conversation."], ["↗", "Clear conversations", "Feel comfortable asking about your options."]].map(x => <article className="quality" key={x[1]}><i>{x[0]}</i><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section>
      <section className="section services" id="care"><div className="wrap"><small className="eyebrow">How we can help</small><h2>Consultations shaped around you.</h2><p className="muted section-copy">Whether visiting for the first time or returning for a follow-up, the conversation starts with what matters to you.</p><div className="cards">{[["01 / FIRST VISIT", "Initial consultation", "Time to discuss your concerns, relevant history, and what you hope to get from a consultation."], ["02 / ONGOING CARE", "Follow-up visit", "A chance to check in, share changes, ask questions, and discuss what comes next."], ["03 / FOR FAMILIES", "Family consultations", "Individual conversations for family members, with attention to each person's needs."]].map(x => <article className="card" key={x[0]}><small>{x[0]}</small><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section>
      <section className="section approach"><div className="wrap approach-box"><div><small className="eyebrow">Your visit</small><h2>A simple, unhurried conversation.</h2><p>Create a patient account to request an appointment date and keep your history together.</p><button className="button pale" onClick={() => showAuth("register")}>Create patient account <Arrow /></button></div><div className="steps">{[["1", "Create your account", "Keep your name and contact details in one place."], ["2", "Request a date", "Choose a preferred appointment date."], ["3", "Track your history", "Sign in to see appointment dates and status."]].map(x => <div className="step" key={x[0]}><b>{x[0]}</b><span><strong>{x[1]}</strong><small>{x[2]}</small></span></div>)}</div></div></section>
      <section className="section contact" id="visit"><div className="wrap split"><div><small className="eyebrow">Visit the clinic</small><h2>We'd be glad to hear from you.</h2><p className="muted">Appointment requests are not confirmed until the clinic contacts you. Please call ahead to confirm availability.</p><button className="button" onClick={() => showAuth("register")}>Request a visit <Arrow /></button></div><div className="contact-cards"><div><i>⌖</i><span><b>Address</b><small>[Add clinic address and city]</small></span></div><div><i>◷</i><span><b>Clinic hours</b><small>[Add consultation days and hours]</small></span></div><div><i>☎</i><span><b>Phone</b><small>[Add clinic phone number]</small></span></div><small className="muted">Replace these clinic details before publishing.</small></div></div></section>
      <p className="disclaimer wrap">Homeopathic consultations are not a substitute for emergency care or advice from a qualified medical professional. If you have urgent symptoms, seek appropriate medical care.</p>
    </main>}
    <footer><div className="wrap foot"><Logo /><p>A welcoming space for thoughtful, individual care.<small>© {new Date().getFullYear()} Arun Homeo Clinic</small></p></div></footer>
  </>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);

