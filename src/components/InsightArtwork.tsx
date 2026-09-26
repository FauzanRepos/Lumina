import { cx } from "@/lib/cx";
import type { InsightArticle } from "@/types/content";

interface InsightArtworkProps {
  article: Pick<
    InsightArticle,
    | "accent"
    | "artworkVariant"
    | "category"
    | "excerpt"
    | "highlightAttribution"
    | "highlightQuote"
    | "label"
    | "title"
  >;
  className?: string;
  compact?: boolean;
}

const surfaceToneClass = {
  sky: "border-sky-200/80 bg-[radial-gradient(circle_at_18%_18%,rgba(191,243,248,0.95),transparent_28%),linear-gradient(160deg,#effcff_0%,#ffffff_48%,#e7fbff_100%)]",
  mint: "border-emerald-200/80 bg-[radial-gradient(circle_at_14%_22%,rgba(214,250,241,0.96),transparent_24%),linear-gradient(160deg,#f2fffb_0%,#ffffff_48%,#e6fbf2_100%)]",
  peach: "border-orange-200/80 bg-[radial-gradient(circle_at_18%_18%,rgba(255,236,214,0.98),transparent_26%),linear-gradient(160deg,#fff9f2_0%,#ffffff_46%,#fff0df_100%)]",
  lavender: "border-violet-200/80 bg-[radial-gradient(circle_at_16%_18%,rgba(237,233,254,0.96),transparent_24%),linear-gradient(160deg,#faf7ff_0%,#ffffff_50%,#f3eeff_100%)]",
  amber: "border-amber-200/80 bg-[radial-gradient(circle_at_18%_18%,rgba(254,243,199,0.98),transparent_26%),linear-gradient(160deg,#fffaf0_0%,#ffffff_48%,#fff1cc_100%)]",
};

const chipToneClass = {
  sky: "bg-white/90 text-primary-600",
  mint: "bg-white/90 text-emerald-700",
  peach: "bg-white/90 text-orange-700",
  lavender: "bg-white/90 text-violet-700",
  amber: "bg-white/90 text-amber-700",
};

const accentGlowClass = {
  sky: "bg-primary-400/20",
  mint: "bg-emerald-400/20",
  peach: "bg-orange-300/25",
  lavender: "bg-violet-300/25",
  amber: "bg-amber-300/25",
};

export function InsightArtwork({ article, className, compact = false }: InsightArtworkProps): JSX.Element {
  return (
    <div className={cx("relative overflow-hidden rounded-[30px] border p-6 sm:p-8", surfaceToneClass[article.accent], className)}>
      <div className={cx("absolute -right-10 top-6 h-28 w-28 rounded-full blur-2xl", accentGlowClass[article.accent])} />
      <div className={cx("absolute -bottom-12 left-8 h-28 w-28 rounded-full blur-2xl", accentGlowClass[article.accent])} />
      <div className="relative flex h-full flex-col">
        {article.artworkVariant === "quote" ? (
          <div className="flex h-full flex-col justify-between gap-6">
            <span className={cx("inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", chipToneClass[article.accent])}>
              {article.label}
            </span>
            <div className="space-y-4">
              <span className="block font-display text-6xl leading-none text-neutral-900/18">“</span>
              <p className={cx("font-display font-semibold leading-tight text-neutral-900", compact ? "text-xl" : "text-[32px]")}>{article.highlightQuote ?? article.title}</p>
            </div>
            <p className="text-sm font-medium text-neutral-500">{article.highlightAttribution ?? article.category}</p>
          </div>
        ) : null}

        {article.artworkVariant === "wave" ? (
          <div className="flex h-full flex-col justify-between gap-8">
            <span className={cx("inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", chipToneClass[article.accent])}>
              {article.category}
            </span>
            <div className="space-y-5">
              <div className="relative h-24 overflow-hidden rounded-[24px] bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <div className="absolute -left-6 top-6 h-16 w-32 rounded-full border-[10px] border-white/75" />
                <div className="absolute left-14 top-3 h-20 w-44 rounded-full border-[12px] border-white/55" />
                <div className="absolute right-6 top-10 h-10 w-24 rounded-full border-[8px] border-white/70" />
              </div>
              <div className="space-y-3">
                <p className={cx("font-display font-semibold leading-tight text-neutral-900", compact ? "text-xl" : "text-[30px]")}>{compact ? article.title.split(":")[0] : article.title}</p>
                <p className={cx("text-neutral-600", compact ? "text-sm leading-6" : "text-base leading-7")}>{article.excerpt}</p>
              </div>
            </div>
          </div>
        ) : null}

        {article.artworkVariant === "journal" ? (
          <div className="flex h-full flex-col gap-5">
            <span className={cx("inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", chipToneClass[article.accent])}>
              {article.label}
            </span>
            <div className="rounded-[24px] bg-white/88 p-5 shadow-[0_12px_30px_rgba(15,23,36,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Prompt 01</p>
              <p className={cx("mt-3 font-display font-semibold leading-tight text-neutral-900", compact ? "text-lg" : "text-[28px]")}>Apa yang paling menguras energiku hari ini?</p>
            </div>
            <div className="space-y-3 rounded-[24px] bg-white/76 p-5">
              <div className="h-2 rounded-full bg-neutral-200/80" />
              <div className="h-2 w-11/12 rounded-full bg-neutral-200/80" />
              <div className="h-2 w-4/5 rounded-full bg-neutral-200/80" />
              <div className="h-2 w-2/3 rounded-full bg-neutral-200/80" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
