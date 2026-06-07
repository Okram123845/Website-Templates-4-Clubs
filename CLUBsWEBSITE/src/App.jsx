import { useState, useEffect, useRef } from "react";

const C = {
  cream: "#FAF7F2",
  creamDark: "#F0EBE1",
  red: "#C0392B",
  redLight: "#E8534A",
  cobalt: "#1B3E8C",
  cobaltLight: "#2E5BBF",
  gold: "#C8872A",
  goldLight: "#E5A94A",
  ink: "#1A1208",
  inkMid: "#3D2E1A",
  inkLight: "#6B5744",
  inkMuted: "#9E8E7E",
};

// All Pexels/Unsplash free-to-use images
const IMAGES = {
  hero: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1600",
  about1: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800",
  about2: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800",
  about3: "https://images.pexels.com/photos/2468339/pexels-photo-2468339.jpeg?auto=compress&cs=tinysrgb&w=800",
  about4: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
  gallery1: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200",
  gallery2: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800",
  gallery3: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
  gallery4: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800",
  gallery5: "https://images.pexels.com/photos/2468339/pexels-photo-2468339.jpeg?auto=compress&cs=tinysrgb&w=800",
  cta: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const NAV_LINKS = ["About", "Schedule", "Gallery", "Membership", "Contact"];

const SCHEDULE = [
  { day: "Mon", time: "19:00", title: "Folk Dance Circle", host: "Elena Ionescu", level: "All levels", bg: "#FDECEA", dot: C.red },
  { day: "Tue", time: "18:30", title: "Traditional Instruments", host: "Mihai Popescu", level: "Beginners", bg: "#EAF0FB", dot: C.cobalt },
  { day: "Wed", time: "20:00", title: "Costume Workshop", host: "Ana Dumitrescu", level: "Open", bg: "#FDF3E3", dot: C.gold },
  { day: "Thu", time: "19:00", title: "Choir Practice", host: "Radu Constantin", level: "Intermediate", bg: "#FDECEA", dot: C.red },
  { day: "Fri", time: "20:30", title: "Open Stage Night", host: "Community", level: "All welcome", bg: "#EAF0FB", dot: C.cobalt },
  { day: "Sat", time: "11:00", title: "Youth Program", host: "Maria Stanescu", level: "Ages 8–16", bg: "#FDF3E3", dot: C.gold },
];

const PLANS = [
  {
    name: "Listener",
    price: 49,
    tagline: "Follow along from the community",
    features: ["Club website & events page", "Member-facing calendar", "Photo gallery access", "Contact form for members"],
    bg: C.cream, textColor: C.ink, priceColor: C.cobalt, border: "#DDD4C5", btnBg: C.cobalt, btnText: "#fff", highlight: false,
  },
  {
    name: "Member",
    price: 69,
    tagline: "The full platform experience",
    features: ["Everything in Listener", "Admin dashboard", "Event creation & management", "Member accounts & comments", "Blog & announcements"],
    bg: C.cobalt, textColor: "#fff", priceColor: C.goldLight, border: C.cobalt, btnBg: C.goldLight, btnText: C.ink, highlight: true,
  },
  {
    name: "Patron",
    price: 99,
    tagline: "Full-featured + custom branding",
    features: ["Everything in Member", "Custom domain setup", "Testimonials & resources", "Priority support", "Onboarding call included"],
    bg: C.cream, textColor: C.ink, priceColor: C.cobalt, border: "#DDD4C5", btnBg: C.cobalt, btnText: "#fff", highlight: false,
  },
];

const STATS = [
  { value: "2014", label: "Founded", color: C.red },
  { value: "150+", label: "Active members", color: C.cobalt },
  { value: "48", label: "Sessions/year", color: C.gold },
  { value: "12", label: "Guest artists", color: C.red },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(28px)",
      transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      background: color + "18",
      color,
      fontSize: "11px",
      fontFamily: "'Inter',sans-serif",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      padding: "5px 12px",
    }}>
      {children}
    </span>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: C.cream, color: C.ink, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        .sans{font-family:'Inter',sans-serif;}
        .nav-item{font-family:'Inter',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:${C.inkMid};cursor:pointer;transition:color 0.2s;}
        .nav-item:hover{color:${C.red};}
        .btn{border:none;padding:14px 32px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:opacity 0.2s,transform 0.15s;}
        .btn:hover{opacity:0.88;transform:translateY(-2px);}
        .btn-outline{background:transparent;border:2px solid ${C.cobalt};color:${C.cobalt};padding:12px 30px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;}
        .btn-outline:hover{background:${C.cobalt};color:#fff;}
        .input{width:100%;border:1.5px solid #DDD4C5;background:#fff;padding:14px 16px;font-family:'Inter',sans-serif;font-size:14px;color:${C.ink};outline:none;transition:border-color 0.2s;border-radius:0;}
        .input:focus{border-color:${C.cobalt};}
        .input::placeholder{color:${C.inkMuted};}
        textarea.input{resize:vertical;min-height:130px;}
        .sched-row{display:grid;grid-template-columns:48px 68px 1fr auto;align-items:center;gap:20px;padding:16px 20px;border-left:4px solid;transition:transform 0.2s;}
        .sched-row:hover{transform:translateX(4px);}
        .gallery-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease;}
        .gallery-wrap{overflow:hidden;cursor:zoom-in;}
        .gallery-wrap:hover .gallery-img{transform:scale(1.06);}
        @media(max-width:900px){
          .hero-grid,.about-grid,.contact-grid{grid-template-columns:1fr!important;}
          .plans-grid{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .gallery-mosaic{grid-template-columns:1fr 1fr!important;grid-template-rows:auto!important;}
          .gallery-mosaic .tall{grid-row:auto!important;}
          .sched-row{grid-template-columns:44px 1fr!important;}
          .sched-time,.sched-level{display:none!important;}
          .desktop-nav{display:none!important;}
          .hero-img-col{display:none!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,247,242,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid #DDD4C5" : "none",
        padding: "0 48px", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "17px", fontWeight: 700 }}>K</span>
          </div>
          <span style={{ fontSize: "19px", fontWeight: 700, letterSpacing: "0.02em" }}>KW Folk Club</span>
        </div>
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map(l => <span key={l} className="nav-item" onClick={() => go(l)}>{l}</span>)}
          <button className="btn" style={{ background: C.red, color: "#fff", padding: "10px 22px" }} onClick={() => go("membership")}>Join now</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="hero-grid">
        {/* left */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "140px 64px 80px" }}>
          <Reveal>
            <Tag color={C.red}>Kitchener–Waterloo · Est. 2014</Tag>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{ fontSize: "clamp(42px,5.5vw,76px)", fontWeight: 700, lineHeight: 1.0, margin: "24px 0 28px" }}>
              Where voices<br />gather &<br />
              <em style={{ color: C.red, fontStyle: "italic" }}>traditions<br />stay alive.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="sans" style={{ fontSize: "16px", color: C.inkLight, lineHeight: 1.8, maxWidth: "400px", marginBottom: "40px", fontWeight: 300 }}>
              A warm circle of singers, dancers, and musicians keeping Romanian folk traditions alive through weekly sessions and seasonal gatherings in KW.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button className="btn" style={{ background: C.red, color: "#fff" }} onClick={() => go("membership")}>Join the club</button>
              <button className="btn-outline" onClick={() => go("schedule")}>See this week</button>
            </div>
          </Reveal>
          <Reveal delay={0.34}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0", marginTop: "56px", borderTop: "1px solid #DDD4C5", paddingTop: "32px" }}>
              {STATS.map(({ value, label, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "30px", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                  <div className="sans" style={{ fontSize: "11px", color: C.inkMuted, marginTop: "5px", letterSpacing: "0.06em" }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* right — photo */}
        <div className="hero-img-col" style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={IMAGES.hero}
            alt="Romanian folk dancers in traditional costume"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.cobalt}55 0%, transparent 55%)` }} />
          {/* floating card */}
          <div style={{ position: "absolute", bottom: "40px", left: "36px", background: "#fff", padding: "20px 24px", maxWidth: "250px", boxShadow: "0 8px 32px rgba(26,18,8,0.18)" }}>
            <div className="sans" style={{ fontSize: "10px", color: C.red, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "8px" }}>Next session</div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: C.ink, marginBottom: "4px" }}>Folk Dance Circle</div>
            <div className="sans" style={{ fontSize: "13px", color: C.inkMuted }}>Monday · 19:00 · All levels</div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: C.cobalt, padding: "100px 64px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }} className="about-grid">
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
              {[IMAGES.about1, IMAGES.about2, IMAGES.about3, IMAGES.about4].map((src, i) => (
                <div key={i} style={{ overflow: "hidden", aspectRatio: "1" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <Tag color="#7EB8F0">Our story</Tag>
              <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "20px 0 24px" }}>
                Built around the<br /><em style={{ color: C.goldLight }}>kitchen-table<br />song circle.</em>
              </h2>
              <p className="sans" style={{ color: "rgba(255,255,255,0.72)", fontSize: "15px", lineHeight: 1.85, marginBottom: "20px", fontWeight: 300 }}>
                KW Folk Club began as six friends trading Romanian ballads on a winter Tuesday in Kitchener. A decade later we're 150+ members strong, hosting weekly sessions, monthly concerts and an annual folk weekend.
              </p>
              <p className="sans" style={{ color: "rgba(255,255,255,0.72)", fontSize: "15px", lineHeight: 1.85, marginBottom: "36px", fontWeight: 300 }}>
                No audition. Beginners and lifers share the same circle. We collect, sing and pass on songs so the next generation never has to wonder where they came from.
              </p>
              <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                {[["Open to all", "No audition required"], ["Community first", "Members run the club"], ["Living tradition", "Songs passed on"]].map(([t, s]) => (
                  <div key={t}>
                    <div style={{ width: "28px", height: "3px", background: C.goldLight, marginBottom: "10px" }} />
                    <div className="sans" style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{t}</div>
                    <div className="sans" style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section id="schedule" style={{ padding: "100px 64px", background: C.creamDark }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <Tag color={C.cobalt}>This week</Tag>
                <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, marginTop: "16px", lineHeight: 1.1 }}>
                  Sessions &<br /><em style={{ color: C.cobalt }}>workshops.</em>
                </h2>
              </div>
              <p className="sans" style={{ fontSize: "14px", color: C.inkMuted, maxWidth: "220px", lineHeight: 1.75, fontWeight: 300 }}>
                Drop in to any open session — bring an instrument or just your ears.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {SCHEDULE.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="sched-row sans" style={{ borderLeftColor: s.dot, background: s.bg }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: s.dot }}>{s.day}</span>
                  <span className="sched-time" style={{ fontSize: "13px", color: C.inkMuted, fontVariantNumeric: "tabular-nums" }}>{s.time}</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: C.ink, marginBottom: "3px" }}>{s.title}</div>
                    <div style={{ fontSize: "12px", color: C.inkMuted }}>{s.host}</div>
                  </div>
                  <span className="sched-level" style={{ fontSize: "11px", fontWeight: 600, color: s.dot, background: "#fff", border: `1px solid ${s.dot}44`, padding: "4px 12px", whiteSpace: "nowrap" }}>{s.level}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding: "100px 64px", background: C.cream }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <Tag color={C.gold}>Gallery</Tag>
            <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, margin: "16px 0 40px", lineHeight: 1.1 }}>
              A look inside<br /><em style={{ color: C.gold }}>the folk.</em>
            </h2>
          </Reveal>
          <div className="gallery-mosaic" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gridTemplateRows: "280px 280px", gap: "6px" }}>
            <div className="gallery-wrap tall" style={{ gridRow: "1 / 3" }} onClick={() => setLightbox(IMAGES.gallery1)}>
              <img src={IMAGES.gallery1} alt="Folk dancers performing" className="gallery-img" />
            </div>
            {[IMAGES.gallery2, IMAGES.gallery3, IMAGES.gallery4, IMAGES.gallery5].map((src, i) => (
              <div key={i} className="gallery-wrap" onClick={() => setLightbox(src)}>
                <img src={src} alt="" className="gallery-img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(26,18,8,0.96)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={lightbox} alt="" style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain" }} />
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: "24px", right: "28px", background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer", opacity: 0.6, fontFamily: "inherit" }}>✕</button>
        </div>
      )}

      {/* ── MEMBERSHIP ── */}
      <section id="membership" style={{ padding: "100px 64px", background: C.creamDark }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <Tag color={C.red}>Club plans</Tag>
              <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, margin: "20px 0 14px", lineHeight: 1.1 }}>
                Three ways<br /><em style={{ color: C.red }}>to belong.</em>
              </h2>
              <p className="sans" style={{ color: C.inkMuted, fontSize: "15px", fontWeight: 300 }}>
                All plans include website setup, custom branding, and hosting.
              </p>
            </div>
          </Reveal>
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div style={{ background: plan.bg, border: `2px solid ${plan.border}`, padding: "40px 32px", position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
                  {plan.highlight && (
                    <div className="sans" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%) translateY(-50%)", background: C.red, color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 18px", whiteSpace: "nowrap" }}>
                      Most popular
                    </div>
                  )}
                  <div style={{ fontSize: "26px", fontWeight: 700, color: plan.textColor, marginBottom: "6px" }}>{plan.name}</div>
                  <div className="sans" style={{ fontSize: "12px", color: plan.highlight ? "rgba(255,255,255,0.55)" : C.inkMuted, marginBottom: "28px" }}>{plan.tagline}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "32px" }}>
                    <span style={{ fontSize: "50px", fontWeight: 700, color: plan.priceColor, lineHeight: 1 }}>${plan.price}</span>
                    <span className="sans" style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.45)" : C.inkMuted }}>/mo</span>
                  </div>
                  <ul style={{ listStyle: "none", marginBottom: "36px", flex: 1 }}>
                    {plan.features.map(f => (
                      <li key={f} className="sans" style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.82)" : C.inkLight, padding: "9px 0", borderBottom: `1px solid ${plan.highlight ? "rgba(255,255,255,0.1)" : "#E5DDD0"}`, display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ color: plan.priceColor, fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => go("contact")}
                    style={{ background: plan.btnBg, color: plan.btnText, border: "none", padding: "14px 28px", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", width: "100%", transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Get started
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ position: "relative", padding: "100px 64px", overflow: "hidden" }}>
        <img src={IMAGES.cta} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: `${C.cobalt}dd` }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(24px,4vw,48px)", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.15 }}>
              Ready to join the circle?
            </h2>
            <p className="sans" style={{ color: "rgba(255,255,255,0.72)", fontSize: "16px", marginBottom: "36px", fontWeight: 300 }}>
              No audition. No experience needed. Just show up.
            </p>
            <button className="btn" style={{ background: C.red, color: "#fff" }} onClick={() => go("contact")}>
              Get in touch today
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "100px 64px", background: C.cream }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }} className="contact-grid">
          <Reveal>
            <Tag color={C.cobalt}>Visit us</Tag>
            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 700, margin: "20px 0 36px", lineHeight: 1.1 }}>
              Come by,<br /><em style={{ color: C.cobalt }}>say hello.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {[["Location", "123 King St W, Kitchener, ON"], ["Phone", "+1 (519) 555-0142"], ["Email", "hello@kwfolkclub.ca"]].map(([l, v]) => (
                <div key={l}>
                  <div className="sans" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.inkMuted, marginBottom: "5px" }}>{l}</div>
                  <div className="sans" style={{ fontSize: "15px", color: C.inkMid }}>{v}</div>
                </div>
              ))}
              <div>
                <div className="sans" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.inkMuted, marginBottom: "14px" }}>Hours</div>
                {[["Mon – Thu", "17:00 – 23:00"], ["Fri – Sat", "16:00 – 01:00"], ["Sunday", "Closed"]].map(([d, h]) => (
                  <div key={d} className="sans" style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: C.inkLight, padding: "9px 0", borderBottom: "1px solid #E5DDD0" }}>
                    <span>{d}</span><span style={{ color: C.inkMuted }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: "16px" }}>
                <div style={{ fontSize: "36px", color: C.cobalt, fontWeight: 700 }}>Message received.</div>
                <p className="sans" style={{ color: C.inkMuted, fontWeight: 300 }}>We reply within one working day.</p>
                <button className="btn-outline" style={{ width: "fit-content" }} onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Tag color={C.gold}>Send us a note</Tag>
                <div style={{ marginTop: "8px" }} />
                <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} required />
                <input className="input" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} required />
                <textarea className="input" placeholder="Your message" value={form.message} onChange={e => setForm(s => ({ ...s, message: e.target.value }))} required />
                <button type="submit" className="btn" style={{ background: C.red, color: "#fff", width: "fit-content", marginTop: "4px" }}>Send message</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.ink, padding: "48px 64px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>K</span>
          </div>
          <span style={{ fontSize: "17px", fontWeight: 700, color: C.creamDark }}>KW Folk Club</span>
        </div>
        <div className="sans" style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
          {NAV_LINKS.map(l => (
            <span key={l} onClick={() => go(l)} style={{ fontSize: "11px", color: "rgba(250,247,242,0.35)", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.creamDark}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(250,247,242,0.35)"}
            >{l}</span>
          ))}
        </div>
        <span className="sans" style={{ fontSize: "12px", color: "rgba(250,247,242,0.25)" }}>© 2026 KW Folk Club</span>
      </footer>
    </div>
  );
}