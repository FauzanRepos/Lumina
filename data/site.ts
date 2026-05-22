import type {
  Benefit,
  FooterContact,
  NavigationItem,
  QuizOption,
  SocialLink,
  Testimonial,
} from "@/types/content";

export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home", matchPrefix: "/" },
  { href: "/psychologists", label: "Psychologists", matchPrefix: "/psychologists" },
  { href: "/services", label: "Services", matchPrefix: "/services" },
  { href: "/insight", label: "Insights", matchPrefix: "/insight" },
];

export const benefits: Benefit[] = [
  {
    id: "comfortable-space",
    title: "Ruang Konseling Tanpa Batas",
    description:
      "Lupakan kecemasan di ruang tunggu. Sampailah ceritamu dari balik pintu kamarmu yang terkunci, tempat rahasiamu terjaga dengan keamanan seutuhnya.",
    icon: "home",
  },
  {
    id: "best-match",
    title: "Sesi Yang Nyaman, Sesi Yang Aman",
    description:
      "Pertumbuhan sejati terjadi saat kamu merasa rileks. Sofa favoritmu atau sudut rumah paling tenang adalah instrumen utama dalam perjalanan pemulihanmu.",
    icon: "sofa",
  },
  {
    id: "schedule",
    title: "Hadir Saat Kamu Siap",
    description:
      "Luka tidak mengenal jam kerja. Kami meniadakan jarak dan waktu perjalanan agar sesi konseling bisa hadir tepat di titik kesiapanmu, kapan pun itu.",
    icon: "time",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "aria-labs",
    quote:
      "Setelah menjalani beberapa sesi bersama Lumina, saya merasa lebih mampu memahami emosi saya sendiri dan tidak lagi merasa sendirian saat menghadapi tekanan kerja.",
    author: "Pravita Buris",
    role: "Konsultasi Dewasa",
  },
  {
    id: "northwind",
    quote:
      "Layanan dari Lumina membuat saya lebih paham bagaimana mendampingi anak saya dengan tenang. Penjelasannya jelas dan prosesnya terasa aman.",
    author: "Orang Tua",
    role: "Konsultasi Keluarga & Parenting",
  },
  {
    id: "merkuri",
    quote:
      "Saya datang dengan kebingungan soal arah karier. Sekarang saya punya gambaran yang lebih utuh dan langkah konkret untuk bergerak.",
    author: "Agung Tazkia",
    role: "Asesmen Karier",
  },
];

export const quizOptions: QuizOption[] = [
  { id: "education", label: "Pendidikan", accent: "sky" },
  { id: "family", label: "Keluarga (Anak & Orangtua)", accent: "mint" },
  { id: "career", label: "Pekerjaan & Karier", accent: "amber" },
  { id: "partner", label: "Pasangan", accent: "lavender" },
  { id: "emotions", label: "Emosi & Mood", accent: "peach" },
  { id: "others", label: "Lainnya", accent: "sky" },
];

export const footerContacts: FooterContact[] = [
  { label: "Individu", value: "+62 858 1118 0606", href: "tel:+6285811180606" },
  { label: "Perusahaan", value: "+62 858 1117 0606", href: "tel:+6285811170606" },
  { label: "Email", value: "halo@lumina.consulting", href: "mailto:halo@lumina.consulting" },
];

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://id.linkedin.com/company/luminaconsulting" },
  { label: "Instagram", href: "https://www.instagram.com/lumina.consulting/" },
  { label: "TikTok", href: "https://www.tiktok.com/@lumina.consulting" },
];