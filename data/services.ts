import type { ServiceCategory } from "@/types/content";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "konsultasi-psikologi",
    label: "Konsultasi Psikologi",
    summary: "Ruang aman untuk mengolah perasaan, relasi, dan arah hidup dengan psikolog yang relevan.",
    supportingNote:
      "Terima kasih sudah melangkah. Kami tahu butuh tekad besar untuk sampai di titik ini, dan langkahmu akan selalu dihargai di sini.",
    items: [
      {
        id: "individu-dewasa",
        shortLabel: "Individu Dewasa",
        title: "Individu Dewasa",
        description:
          "Temukan ruang aman untuk mengeksplorasi diri dan menghadapi tantangan hidup dengan lebih tenang dan terarah.",
        features: [
          "Self reflection and development",
          "Stress and anxiety management",
          "Emotional healing and recovery",
        ],
      },
      {
        id: "keluarga",
        shortLabel: "Keluarga",
        title: "Konseling Keluarga",
        description:
          "Membantu keluarga menata ulang komunikasi, memahami konflik, dan menemukan bentuk dukungan yang lebih sehat.",
        features: [
          "Conflict repair conversations",
          "Parenting alignment",
          "Home dynamic mapping",
        ],
      },
      {
        id: "pasangan",
        shortLabel: "Pasangan",
        title: "Konseling Pasangan",
        description:
          "Sesi yang membantu pasangan mendengarkan lebih utuh, mengurai pola konflik, dan memulihkan kedekatan.",
        features: [
          "Communication reset",
          "Attachment awareness",
          "Conflict pattern reframing",
        ],
      },
      {
        id: "psikoterapi",
        shortLabel: "Psikoterapi",
        title: "Psikoterapi Terarah",
        description:
          "Pendampingan jangka menengah untuk isu emosional yang membutuhkan ruang lebih dalam dan konsisten.",
        features: [
          "Structured weekly sessions",
          "Goal-based treatment plan",
          "Progress reflection checkpoints",
        ],
      },
    ],
  },
  {
    id: "asesmen",
    label: "Asesmen",
    summary: "Asesmen yang jelas, rapi, dan mudah diterjemahkan menjadi keputusan yang lebih tepat.",
    supportingNote:
      "Asesmen Lumina dirancang agar hasilnya tetap terasa manusiawi: informatif, tidak menghakimi, dan langsung bisa dipakai.",
    items: [
      {
        id: "tes-psikologis",
        shortLabel: "Tes Psikologis",
        title: "Tes Psikologis",
        description:
          "Rangkaian tes untuk memetakan potensi, cara belajar, gaya kerja, dan kebutuhan dukungan psikologis.",
        features: [
          "Cognitive and personality mapping",
          "Interpretable written summary",
          "Consultation after result",
        ],
      },
      {
        id: "psikodiagnostik",
        shortLabel: "Psikodiagnostik",
        title: "Psikodiagnostik",
        description:
          "Pendalaman klinis untuk membantu memahami gejala dan membuat rencana pendampingan yang lebih presisi.",
        features: [
          "Clinical interview synthesis",
          "Behavioral pattern review",
          "Targeted recommendation",
        ],
      },
      {
        id: "evaluasi-karier",
        shortLabel: "Evaluasi Karier",
        title: "Evaluasi Karier",
        description:
          "Asesmen untuk profesional dan mahasiswa yang ingin melihat kecocokan arah karier, kapasitas, dan preferensi kerja.",
        features: [
          "Interest and strength mapping",
          "Career path scenarios",
          "Action-oriented next steps",
        ],
      },
    ],
  },
  {
    id: "kolaborasi",
    label: "Kolaborasi",
    summary: "Program psikologi terapan untuk organisasi yang ingin membangun tim yang sehat dan berkelanjutan.",
    supportingNote:
      "Kami bekerja bersama HR, founder, dan leader untuk merancang intervensi yang terasa relevan dengan kultur tim.",
    items: [
      {
        id: "program-korporat",
        shortLabel: "Program Korporat",
        title: "Program Korporat",
        description:
          "Rangkaian support session, hotline, dan wellbeing activation untuk perusahaan yang ingin menjaga kapasitas tim.",
        features: [
          "Employee wellbeing sessions",
          "Confidential support routing",
          "Quarterly insight report",
        ],
      },
      {
        id: "training-tim",
        shortLabel: "Training Tim",
        title: "Training Tim",
        description:
          "Workshop untuk leader dan tim tentang komunikasi sehat, burnout prevention, dan psychological safety.",
        features: [
          "Interactive team workshop",
          "Manager toolkit",
          "Follow-up session design",
        ],
      },
      {
        id: "konsultasi-organisasi",
        shortLabel: "Konsultasi Organisasi",
        title: "Konsultasi Organisasi",
        description:
          "Pendampingan untuk organisasi yang ingin memetakan isu budaya, struktur dukungan, dan ritme kerja yang lebih sehat.",
        features: [
          "Culture diagnostic",
          "Policy recommendation",
          "Stakeholder facilitation",
        ],
      },
    ],
  },
];