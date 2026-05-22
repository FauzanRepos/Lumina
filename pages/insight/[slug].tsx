import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { InsightArtwork } from "@/components/InsightArtwork";
import { Container } from "@/components/layout/Container";
import { formatInsightDate } from "@/lib/formatting";
import { getAllInsightArticles, getAllInsightSlugs, getInsightArticleBySlug } from "@/lib/insights";
import { usePageReveal } from "@/lib/usePageReveal";
import type { InsightArticle } from "@/types/content";

interface InsightArticlePageProps {
  article: InsightArticle;
  relatedArticles: InsightArticle[];
}

export default function InsightArticlePage({
  article,
  relatedArticles,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>(article.slug);

  return (
    <>
      <Head>
        <title>{article.title} | Lumina Insight</title>
        <meta content={article.excerpt} name="description" />
      </Head>

      <main className="pb-4" ref={pageRef}>
        <Container className="pt-10 sm:pt-14">
          <Link className="inline-flex items-center gap-2 text-small font-semibold text-primary-600" href="/insight">
            ← Back to Insight
          </Link>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
            <Card className="rounded-[34px] p-8 sm:p-10" data-reveal>
              <span className="inline-flex rounded-full bg-primary-300/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                {article.label}
              </span>
              <p className="mt-5 text-small font-semibold uppercase tracking-[0.18em] text-neutral-500">{article.category}</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-neutral-900 sm:text-[52px]">
                {article.title}
              </h1>
              <p className="mt-5 max-w-2xl text-body leading-8 text-neutral-700">{article.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-small text-neutral-500">
                <span>{article.author}</span>
                <span>•</span>
                <span>{formatInsightDate(article.publishedAt)}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </Card>

            <InsightArtwork article={article} className="min-h-[320px]" />
          </section>
        </Container>

        <Container className="mt-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="space-y-6">
              <Card className="rounded-[34px] p-8 sm:p-10" data-reveal>
                <p className="text-lg leading-8 text-neutral-700">{article.intro}</p>

                {article.highlightQuote ? (
                  <div className="mt-8 rounded-[28px] bg-primary-300/18 p-6 sm:p-8">
                    <p className="font-display text-3xl font-semibold leading-tight text-neutral-900 sm:text-[36px]">
                      “{article.highlightQuote}”
                    </p>
                    {article.highlightAttribution ? (
                      <p className="mt-4 text-small font-medium text-neutral-500">{article.highlightAttribution}</p>
                    ) : null}
                  </div>
                ) : null}

                <div
                  className="mt-10 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-neutral-900 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-neutral-900 [&_p]:mt-4 [&_p]:text-base [&_p]:leading-8 [&_p]:text-neutral-700 [&_ul]:mt-4 [&_ul]:space-y-3 [&_ul]:pl-5 [&_li]:text-base [&_li]:leading-8 [&_li]:text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              </Card>
            </article>

            <aside className="space-y-5">
              <Card className="rounded-[30px] p-6 sm:p-7" data-reveal data-reveal-delay="0.08">
                <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Key Takeaways</p>
                <ul className="mt-5 space-y-4 text-small leading-7 text-neutral-700">
                  {article.keyTakeaways.map((takeaway) => (
                    <li key={takeaway} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-500" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="rounded-[30px] p-6 sm:p-7" data-reveal data-reveal-delay="0.16">
                <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Need A Safe Space?</p>
                <h2 className="mt-4 font-display text-3xl font-semibold text-neutral-900">Talk it through with someone who can help.</h2>
                <p className="mt-4 text-small leading-7 text-neutral-700">
                  Jika tulisan ini terasa dekat dengan apa yang sedang kamu alami, langkah berikutnya tidak harus dijalani sendirian.
                </p>
                <Link className={`mt-6 inline-flex ${buttonClasses({ size: "md" })}`} href="/psychologists">
                  Explore Psychologists
                </Link>
              </Card>
            </aside>
          </div>
        </Container>

        <Container className="mt-20">
          <section className="space-y-6">
            <div data-reveal>
              <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">More From Lumina Insight</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-neutral-900">Keep reading at your own pace.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {relatedArticles.map((relatedArticle, index) => (
                <Card
                  key={relatedArticle.id}
                  className="overflow-hidden rounded-[34px] p-0"
                  data-reveal
                  data-reveal-delay={(0.08 * (index + 1)).toString()}
                >
                  <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
                    <InsightArtwork
                      article={relatedArticle}
                      className="min-h-[220px] rounded-none border-0 border-b border-primary-300/60 sm:border-b-0 sm:border-r"
                      compact
                    />
                    <div className="flex flex-col justify-between gap-5 p-6">
                      <div>
                        <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                          {relatedArticle.label}
                        </span>
                        <Link href={relatedArticle.href}>
                          <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600">
                            {relatedArticle.title}
                          </h3>
                        </Link>
                        <p className="mt-3 text-small leading-7 text-neutral-700">{relatedArticle.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-small text-neutral-500">
                        <span>{relatedArticle.readTime}</span>
                        <Link className="font-semibold text-neutral-900 transition hover:text-primary-600" href={relatedArticle.href}>
                          Read next ↗
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </Container>

        <CtaBanner />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllInsightSlugs()).map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<InsightArticlePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const article = await getInsightArticleBySlug(slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
      relatedArticles: (await getAllInsightArticles()).filter((entry) => entry.slug !== article.slug).slice(0, 2),
    },
  };
};