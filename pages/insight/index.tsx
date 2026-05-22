import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { InsightArtwork } from "@/components/InsightArtwork";
import { Container } from "@/components/layout/Container";
import { formatInsightDate } from "@/lib/formatting";
import { getAllInsightArticles } from "@/lib/insights";
import { usePageReveal } from "@/lib/usePageReveal";
import type { InsightArticle } from "@/types/content";

export default function InsightIndexPage({
  insightArticles,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const [featuredArticle, ...moreArticles] = insightArticles;

  if (!featuredArticle) {
    return (
      <main className="pb-4" ref={pageRef}>
        <Container className="pt-10 sm:pt-14">
          <Card className="rounded-[34px] p-8 sm:p-10">
            <p className="text-small font-semibold uppercase tracking-[0.24em] text-primary-600">Lumina Insight</p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">No insights published yet.</h1>
            <p className="mt-4 text-body leading-8 text-neutral-700">
              Tambahkan artikel baru melalui Decap CMS atau folder <code>insight/content/articles</code> untuk mengisi halaman ini.
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Insight | Lumina Consulting</title>
        <meta
          content="Lumina Insight menghadirkan artikel dan refleksi singkat seputar kesehatan mental dengan nada yang hangat, jernih, dan mudah dibawa ke keseharian."
          name="description"
        />
      </Head>

      <main className="pb-4" ref={pageRef}>
        <Container className="pt-10 sm:pt-14">
          <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div className="max-w-2xl" data-reveal>
              <p className="text-small font-semibold uppercase tracking-[0.24em] text-primary-600">Lumina Insight</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.04] text-neutral-900 sm:text-[64px]">
                Articles & resources for mental wellness.
              </h1>
              <p className="mt-6 text-body leading-8 text-neutral-700">
                Halaman ini menampilkan tiga artikel mock untuk menunjukkan arah editorial Lumina: reflektif, tenang, dan tetap memberi langkah kecil yang bisa dipakai setelah selesai membaca.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className={buttonClasses({ size: "md" })} href={featuredArticle.href}>
                  Read Featured Insight
                </Link>
                <Link className={buttonClasses({ size: "md", variant: "secondary" })} href="/psychologists">
                  Talk To A Psychologist
                </Link>
              </div>
            </div>

            <Card className="overflow-hidden rounded-[34px] p-0" data-reveal data-reveal-delay="0.08">
              <div className="grid gap-0 sm:grid-cols-[1.02fr_0.98fr]">
                <div className="flex flex-col justify-between gap-6 p-8 sm:p-10">
                  <div>
                    <span className="inline-flex rounded-full bg-primary-300/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                      Featured Insight
                    </span>
                    <Link href={featuredArticle.href}>
                      <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600 sm:text-[38px]">
                        {featuredArticle.title}
                      </h2>
                    </Link>
                    <p className="mt-4 text-body leading-8 text-neutral-700">{featuredArticle.excerpt}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-small text-neutral-500">
                    <span>{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{formatInsightDate(featuredArticle.publishedAt)}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
                <InsightArtwork
                  article={featuredArticle}
                  className="min-h-[320px] rounded-none border-0 border-t border-primary-300/60 sm:border-l sm:border-t-0"
                />
              </div>
            </Card>
          </section>
        </Container>

        <Container className="mt-20">
          <section className="space-y-6">
            <div data-reveal>
              <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Fresh Perspectives</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-neutral-900">Curated reflections for busy minds.</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {moreArticles.map((article, index) => (
                <Card
                  key={article.id}
                  className="overflow-hidden rounded-[34px] p-0"
                  data-reveal
                  data-reveal-delay={(0.08 * (index + 1)).toString()}
                >
                  <div className="grid gap-0 sm:grid-cols-[0.92fr_1.08fr]">
                    <InsightArtwork
                      article={article}
                      className="min-h-[240px] rounded-none border-0 border-b border-primary-300/60 sm:border-b-0 sm:border-r"
                      compact
                    />
                    <div className="flex flex-col justify-between gap-6 p-6 sm:p-7">
                      <div>
                        <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                          {article.label}
                        </span>
                        <Link href={article.href}>
                          <h3 className="mt-4 font-display text-[28px] font-semibold leading-tight text-neutral-900 transition hover:text-primary-600">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="mt-4 text-small leading-7 text-neutral-700">{article.excerpt}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 text-small text-neutral-500">
                        <span>{article.category}</span>
                        <Link className="font-semibold text-neutral-900 transition hover:text-primary-600" href={article.href}>
                          Read insight ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </Container>

        <Container className="mt-20">
          <section className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Curated reflections",
                description: "Tulisan pendek yang membantu memberi nama pada apa yang sedang terasa rumit.",
              },
              {
                title: "Gentle practical tools",
                description: "Langkah-langkah kecil yang bisa dicoba tanpa terasa seperti pekerjaan tambahan.",
              },
              {
                title: "A bridge to support",
                description: "Setiap insight dirancang untuk mengarahkan pembaca ke bantuan yang lebih personal saat diperlukan.",
              },
            ].map((item, index) => (
              <Card key={item.title} className="rounded-[30px] p-6 sm:p-7" data-reveal data-reveal-delay={(0.08 * index).toString()}>
                <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary-600">Lumina</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-3 text-small leading-7 text-neutral-700">{item.description}</p>
              </Card>
            ))}
          </section>
        </Container>

        <CtaBanner />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ insightArticles: InsightArticle[] }> = async () => {
  return {
    props: {
      insightArticles: await getAllInsightArticles(),
    },
  };
};