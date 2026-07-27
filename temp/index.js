import Head from "next/head";
import { useState, useEffect } from "react";

/* ---------------------------------------------------------
   Small inline icon set (stroke-based, matches reference)
--------------------------------------------------------- */
const Icon = {
  Chat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Handshake: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M8 12 3 7l3-3 5 3M16 12l5-5-3-3-5 3M8 12l2.5 2.5a1.5 1.5 0 0 0 2.12 0v0a1.5 1.5 0 0 0 0-2.12L11 10M16 12l-2.5 2.5a1.5 1.5 0 0 1-2.12 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7l4.5 4.5M18 7l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Scale: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 3v18M8 21h8M5 7h14M5 7l-3 6a3 3 0 0 0 6 0l-3-6zM19 7l-3 6a3 3 0 0 0 6 0l-3-6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bank: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M3 10h18M4 10v9m4-9v9m4-9v9m4-9v9m4-9v9M2 21h20M12 2l9 5H3l9-5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Cap: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M2 9l10-5 10 5-10 5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Award: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  CheckBadge: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 2l2.4 1.2 2.6-.4 1.3 2.3 2.3 1.3-.4 2.6L21.4 12l-1.2 2.4.4 2.6-2.3 1.3-1.3 2.3-2.6-.4L12 21.4l-2.4-1.2-2.6.4-1.3-2.3-2.3-1.3.4-2.6L2.6 12l1.2-2.4-.4-2.6 2.3-1.3 1.3-2.3 2.6.4L12 2z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  File: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M3 11.5 12 4l9 7.5M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 21V6l8-4 8 4v15M4 21h16M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Presentation: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M3 4h18M4 4v10h16V4M12 14v6M9 20h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 22s7-6.4 7-12A7 7 0 0 0 5 10c0 5.6 7 12 7 12z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const Social = {
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M15 8h2V4h-2a4 4 0 0 0-4 4v2H9v4h2v8h4v-8h2.5l.5-4H15V8z" strokeLinejoin="round" />
    </svg>
  ),
  Linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10v6M7.5 7.5v.01M12 16v-3.5c0-1.5 1-2.5 2.5-2.5S17 11 17 12.5V16" strokeLinecap="round" />
    </svg>
  ),
  Youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda", active: true },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Layanan", href: "#layanan" },
  { label: "Artikel", href: "#artikel" },
  { label: "Kontak", href: "#kontak" },
];

const FEATURES = [
  { icon: Icon.Handshake, label: "Berpengalaman", desc: "Lebih dari 15 tahun melayani ribuan klien" },
  { icon: Icon.Shield, label: "Terpercaya", desc: "Dipercaya oleh individu, UMKM hingga perusahaan besar" },
  { icon: Icon.Scale, label: "Profesional", desc: "Standar layanan tinggi dan tepat waktu" },
  { icon: Icon.Bank, label: "Berintegritas", desc: "Jujur, amanah dan bertanggung jawab" },
];

const PENDIDIKAN = [
  { title: "Sarjana Hukum (S.H)", desc: "Fakultas Hukum Universitas Hasanuddin, Makasar" },
  { title: "Magister Kenotariatan (M.Kn)", desc: "Pascasarjana Universitas Padjajaran, Bandung" },
];

const SERTIFIKASI = ["Notaris Syariah", "Notaris Koperasi", "Notaris Pasar Modal"];

const LEGALITAS = [
  { title: "Notaris", desc: "berdasarkan Surat Keputusan Menteri Hukum & Hak Asasi Manusia Republik Indonesia" },
  { title: "Pejabat Pembuat Akta Tanah (PPAT)", desc: "berdasarkan Surat Keputusan Menteri ATR/Kepala Badan Pertanahan Republik Indonesia" },
];

const LAYANAN = [
  { icon: Icon.File, label: "Pembuatan Akta Notaris" },
  { icon: Icon.Home, label: "Peralihan & Pengurusan Hak Tanah" },
  { icon: Icon.Building, label: "Pendirian & Perubahan Badan Hukum" },
  { icon: Icon.Presentation, label: "Layanan Hukum Lainnya" },
];

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */
export default function Home() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      // Desktop browser mengabaikan meta viewport, jadi innerWidth bisa < 1024 jika di-resize.
      // Mobile browser menghormati meta viewport=1299, jadi innerWidth akan 1299.
      const isSmallWindow = window.innerWidth < 1024;
      const isSmallScreen = window.screen.width < 1024;
      const isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));

      if (isMobileUA || isSmallWindow || (isSmallScreen && isTouch)) {
        setIsMobileDevice(true);
      } else {
        setIsMobileDevice(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <Head>
        <title>Notaris & PPAT Mila Kumari, S.H., M.Kn.</title>
        <meta
          name="description"
          content="Kantor Notaris & PPAT Mila Kumari, S.H., M.Kn. — Solusi tepat untuk kebutuhan hukum Anda. Profesional, terpercaya, dan berintegritas."
        />
        <meta name="viewport" content="width=1299" />
      </Head>

      <div className="font-sans text-navy-900">
        {/* ================= NAVBAR ================= */}
        <header className="bg-navy-900 sticky top-0 z-50">
          <nav className="max-w-[1800px] mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-4">
            <a href="#beranda" className="flex items-center gap-3 shrink-0">
              <span className="w-14 h-14 rounded-full flex items-center justify-center">
                <img src="/images/mk-6835754b4efb4.webp" alt="Logo" />
              </span>
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="text-[11px] tracking-[0.18em] text-gold font-semibold">
                  KANTOR NOTARIS, NPAK &amp; PPAT
                </span>
                <span className="text-white font-serif italic text-xl -mt-0.5">
                  Mila Kumari, S.H., M.Kn.
                </span>
                <span className="font-serif italic text-xs font-light text-white">
                  "Trusted, Accountable & Professional"
                </span>
              </span>
            </a>

            <ul className={`${isMobileDevice ? 'hidden' : 'hidden lg:flex'} items-center gap-8 text-[15px] text-white/90 font-medium`}>
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={
                      l.active
                        ? "text-gold border-b-2 border-gold pb-1"
                        : "hover:text-gold transition-colors pb-1"
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#kontak"
              className={`${isMobileDevice ? 'hidden' : 'hidden md:inline-flex'} items-center gap-2 bg-gold hover:bg-gold-light transition-colors text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-md shrink-0`}
            >
              <Icon.Chat className="w-4 h-4" />
              Konsultasi
            </a>

            {/* mobile menu button */}
            <button
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isMobileDevice ? 'block' : 'hidden'} text-white p-2 -mr-2`}
            >
              {isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile Menu Dropdown */}
          {isMobileDevice && isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-navy-900 border-t border-white/10 shadow-xl pb-6 px-6">
              <ul className="flex flex-col mt-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-white/90 text-lg py-4 border-b border-white/5 hover:text-gold transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#kontak"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-6 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light transition-colors text-navy-900 font-bold text-[17px] w-full py-4 rounded-md"
              >
                <Icon.Chat className="w-5 h-5" />
                Konsultasi Sekarang
              </a>
            </div>
          )}
        </header>

        {/* ================= HERO ================= */}
        <section id="beranda" className="relative overflow-hidden bg-navy-900">
          {/* Background: office photo with left-to-right fade overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/images/office-bg-hero.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            {/* Fade overlay: strong navy on left, transparent on right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(10,26,51,1) 0%, rgba(10,26,51,0.92) 30%, rgba(10,26,51,0.6) 60%, rgba(10,26,51,0.3) 80%, rgba(10,26,51,0.15) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-14 grid lg:grid-cols-2 gap-12 items-end">
            {/* Left column */}
            <div>
              <p className="text-gold text-sm md:text-[15px] font-semibold tracking-wide flex items-center gap-2 flex-wrap">
                <span>Profesional</span>
                <span className="w-1 h-1 rounded-full bg-gold inline-block" />
                <span>Terpercaya</span>
                <span className="w-1 h-1 rounded-full bg-gold inline-block" />
                <span>Berintegritas</span>
              </p>

              <h1 className="mt-5 font-serif text-white text-[2.6rem] leading-[1.1] sm:text-5xl md:text-[3.4rem]">
                Notaris &amp; PPAT
                <br />
                <span className="italic text-white">Mila Kumari, S.H., M.Kn.</span>
              </h1>

              <div className="w-16 h-[3px] bg-gold my-6" />

              <h2 className="text-white text-xl md:text-2xl font-bold leading-snug">
                Solusi Tepat untuk Kebutuhan
                <br className="hidden sm:block" /> Hukum Anda
              </h2>

              <p className="mt-5 text-white/60 text-[15px] md:text-base leading-relaxed max-w-xl">
                Dengan pengalaman lebih dari 15 tahun, kami memberikan layanan
                kenotariatan dan pertanahan dengan standar profesionalisme
                tinggi, integritas, serta kepatuhan penuh terhadap peraturan
                perundang-undangan.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#kontak"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light transition-colors text-navy-900 font-semibold px-6 py-3.5 rounded-md"
                >
                  <Icon.Chat className="w-4 h-4" />
                  Konsultasi Sekarang
                </a>
                <a
                  href="#kontak"
                  className="inline-flex items-center gap-2 border border-gold text-white hover:bg-white/5 transition-colors font-semibold px-6 py-3.5 rounded-md"
                >
                  <Icon.Phone className="w-4 h-4 text-gold" />
                  Hubungi Kami
                </a>
              </div>
            </div>

            {/* Right column — spacer agar grid tetap 2 kolom */}
            <div aria-hidden="true" className="hidden lg:block" />
          </div>

          {/* Foto ibu — posisi absolut di section, bottom-right, besar */}
          <div
            className="absolute bottom-[-30px] right-56 lg:right-12 z-[8] pointer-events-none hidden lg:block"
            style={{ width: "48%", maxWidth: "430px", minWidth: "280px" }}
          >
            <img
              src="/images/ibu-nobg.webp"
              alt="Notaris Mila Kumari, S.H., M.Kn."
              className="w-full h-auto object-contain object-bottom drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              style={{ display: "block" }}
            />
          </div>

          {/* Feature strip */}

        </section>
        <div className="relative z-10 px-4 md:px-8 pt-10 mt-10 md:mt-0">
          <div className="max-w-[1400px] mx-auto bg-[#001B39] rounded-2xl grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
            {FEATURES.map(({ icon: FIcon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center px-6 py-6"
              >
                <FIcon className="w-[60px] h-[60px] text-gold mb-1" />
                <h3 className="text-gold font-serif font-bold text-[22px] mb-1">
                  {label}
                </h3>
                <p className="text-white/90 text-[15px] leading-tight max-w-[240px]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* ================= TENTANG (ABOUT) ================= */}
        <section id="tentang" className="relative overflow-hidden mt-10">
          {/* Background: office photo with left-to-right fade overlay */}
          <div className="absolute  right-0 h-full max-w-[700px] z-0 pointer-events-none">
            <img
              src="/images/side-about.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            {/* Fade overlay: strong navy on left, transparent on right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #F7F1E6 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 0) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-14 grid lg:grid-cols-2 items-end">
            {/* Left column */}
            <div>


              <h2 className="font-serif text-3xl md:text-[2.0rem] text-navy-900">
                Tentang <span className="text-gold">Mila Kumari, S.H., M.Kn.</span>
              </h2>

              <p className="mt-6 text-[15px] md:text-base leading-relaxed text-navy-900/80">
                <span className="font-bold">Mila Kumari, S.H., M.Kn.</span> adalah
                Notaris dan PPAT dengan pengalaman lebih dari 15 tahun, yang
                telah melayani lebih dari 8.000 klien di wilayah Bandung Barat
                dan sekitarnya.
              </p>

              <p className="mt-4 text-[15px] md:text-base leading-relaxed text-navy-900/80">
                Layanan mencakup pembuatan akta notaris, pengurusan dan
                peralihan hak atas tanah, serta pendirian dan perubahan badan
                hukum bagi berbagai segmen, mulai dari UMKM hingga perusahaan
                besar.
              </p>

              <div className="mt-8 flex items-center gap-4 text-navy-900">
                <span className="h-px w-10 bg-gold" />
                <span className="font-serif italic text-lg md:text-xl">
                  &quot;Trusted, Accountable &amp; Professional&quot;
                </span>
                <span className="h-px w-10 bg-gold" />
              </div>
            </div>

            {/* Right column — spacer agar grid tetap 2 kolom */}
            <div aria-hidden="true" className="hidden lg:block" />
          </div>

          <div>

          </div>

        </section>

        <section id="tentang" className="bg-cream pb-12">
          <div className="max-w-[1800px] mx-auto px-6 md:px-10">

            {/* three info cards */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {/* Pendidikan */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gold">
                <div className="bg-navy-900 flex items-center gap-2.5 px-5 py-4">
                  <Icon.Cap className="w-10 h-10 text-gold" />
                  <span className="text-white font-bold text-sm tracking-wide">
                    PENDIDIKAN
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  {PENDIDIKAN.map((item, i) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-navy-900 text-[15px]">{item.title}</p>
                        <p className="text-navy-900/60 text-sm mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sertifikasi */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gold">
                <div className="bg-navy-900 flex items-center gap-2.5 px-5 py-4">
                  <Icon.Award className="w-10 h-10 text-gold" />
                  <span className="text-white font-bold text-sm tracking-wide">
                    SERTIFIKASI KHUSUS
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  {SERTIFIKASI.map((item, i) => (
                    <div key={item} className="flex gap-3 items-center">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="font-bold text-navy-900 text-[15px]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legalitas */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gold">
                <div className="bg-navy-900 flex items-center gap-2.5 px-5 py-4">
                  <Icon.CheckBadge className="w-10 h-10 text-gold" />
                  <span className="text-white font-bold text-sm tracking-wide">
                    LEGALITAS JABATAN
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  {LEGALITAS.map((item, i) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-navy-900 text-[15px]">{item.title}</p>
                        <p className="text-navy-900/60 text-sm mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LAYANAN KAMI ================= */}
        <section id="layanan" className="bg-navy-900 py-4">
          <div className="max-w-[1800px] mx-auto pl-6 md:pl-10 flex flex-col lg:flex-row lg:items-center gap-10">
            <h2 className="font-serif text-gold text-3xl md:text-4xl leading-tight shrink-0">
              Layanan Kami
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-1 flex-1">
              {LAYANAN.map(({ icon: LIcon, label }) => (
                <div key={label} className="flex flex-col gap-1 px-2 items-center justify-center border-l border-gold">
                  <span className="w-12 h-12 flex items-center justify-center">
                    <LIcon className="w-9 h-9 text-gold" />
                  </span>
                  <p className="text-center text-white font-normal text-[15px] leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer id="kontak" className="bg-navy-950 pt-14 pb-8">
          <div className="max-w-[1800px] mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-10">
            <div className="flex gap-3">
              <Icon.Pin className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div className="text-sm">
                <p className="text-white/60">Kantor Notaris, NPAK &amp; PPAT</p>
                <p className="text-white font-bold mt-0.5">Mila Kumari, S.H., M.Kn.</p>
                <p className="text-white/60 mt-0.5">Bandung Barat, Jawa Barat</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Icon.Phone className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div className="text-sm">
                <p className="text-white/60 mb-2">Hubungi Kami</p>
                <p className="text-white flex items-center gap-2">
                  <Icon.Phone className="w-4 h-4 text-gold" /> 0811 1234 5678
                </p>
                <p className="text-white flex items-center gap-2 mt-1.5">
                  <Icon.Mail className="w-4 h-4 text-gold" /> info@notarismilakumari.id
                </p>
              </div>
            </div>

            <div>
              <p className="text-white font-bold mb-3">Ikuti Kami</p>
              <div className="flex gap-3">
                {[Social.Instagram, Social.Facebook, Social.Linkedin, Social.Youtube].map(
                  (S, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy-900 transition-colors flex items-center justify-center text-white"
                    >
                      <S className="w-4 h-4" />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="max-w-[1800px] mx-auto px-6 md:px-10 mt-10 pt-6 border-t border-white/10 text-white/40 text-xs text-center">
            © {new Date().getFullYear()} Kantor Notaris, NPAK &amp; PPAT Mila Kumari, S.H., M.Kn. Seluruh hak cipta dilindungi.
          </div>
        </footer>
      </div>
    </>
  );
}
