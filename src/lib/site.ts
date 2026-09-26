import footerJson from "@/public/content/site/footer.json";
import testimonialsJson from "@/public/content/site/testimonials.json";
import questionsJson from "@/public/content/site/questions.json";
import dropdownJson from "@/public/content/site/dropdown.json";

const _navigationItems = [
  { href: "/", label: "Home", matchPrefix: "/" },
  { href: "/psychologists", label: "Psychologists", matchPrefix: "/psychologists" },
  { href: "/services", label: "Services", matchPrefix: "/services" },
  { href: "/insight", label: "Insights", matchPrefix: "/insight" },
];

const _benefits = [
  { id: "b1", title: "Ruang Konseling Tanpa Batas", description: "Pengalaman konseling yang personal dan aman, dirancang sesuai kebutuhan unikmu.", icon: "home" },
  { id: "b2", title: "Sesi Yang Nyaman, Sesi Yang Aman", description: "Akses layanan psikologi terpercaya sepenuhnya secara online kapanpun dan di manapun.", icon: "sofa" },
  { id: "b3", title: "Hadir Saat Kamu Siap", description: "Jadwal sesi yang fleksibel — pagi, siang, atau malam, menyesuaikan rutinitasmu.", icon: "time" },
];

const _quizOptions = [
  { id: "education", label: "Pendidikan", accent: "sky" },
  { id: "family", label: "Keluarga (Anak & Orangtua)", accent: "mint" },
  { id: "career", label: "Pekerjaan & Karier", accent: "amber" },
  { id: "partner", label: "Pasangan", accent: "lavender" },
  { id: "emotions", label: "Emosi & Mood", accent: "peach" },
  { id: "others", label: "Lainnya", accent: "sky" },
];

const siteContent = {
  siteName: "Lumina Consulting",
  supportEmail: "halo@luminaconsulting.id",
  supportPhone: "+62 858 1118 0606",
  navigationItems: _navigationItems,
  benefits: _benefits,
  testimonials: (testimonialsJson as any)?.content ?? [],
  footerContacts: (footerJson as any)?.content?.contacts ?? [],
  socialLinks: (footerJson as any)?.content?.links ?? [],
  // legacy keys used across pages
  quizQuestions: (questionsJson as any)?.content ?? [],
  quizOptions: _quizOptions,
  // expose raw dropdown in case callers need it
  rawDropdown: (dropdownJson as any)?.content ?? [],
};

export const navigationItems = siteContent.navigationItems;
export const footerContacts = siteContent.footerContacts;
export const socialLinks = siteContent.socialLinks;
export const benefits = siteContent.benefits;
export const quizQuestions = siteContent.quizQuestions;
export const quizOptions = siteContent.quizOptions;
export const testimonials = siteContent.testimonials;

export default siteContent;
