import Link from "next/link";
import { Image } from "@/components/Image";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/layout/Container";
import { cx } from "@/lib/cx";

export function CtaBanner(): JSX.Element {
  return (
    <Container className="mt-8 md:mt-72 lg:mt-96">
      <Card className="relative overflow-hidden border-none bg-[#37B6DF] text-white shadow-none rounded-[34px]" data-reveal>
        <div className="absolute right-[-28px] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border-[18px] border-white/15" />
        <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
          <div className="max-w-2xl relative z-10">
            <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Bingung Mulai Dari Mana?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base">
              Isi kuesioner singkat berikut atau hubungi asisten kami. Kami akan membantu mencocokkan kebutuhanmu dengan psikolog dan layanan yang tepat.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row relative z-10 mt-2">
            <Link
              className={cx(buttonClasses({ variant: "secondary", size: "md" }), "bg-white text-primary-600 hover:bg-neutral-50")}
              href="https://s.id/KlienBaruLumina"
              target="_blank"
              rel="noopener noreferrer"
            >
              Isi Formulir
            </Link>
            <Link
              className={cx(buttonClasses({ variant: "outlineLight", size: "md" }), "border-white/30 text-white hover:bg-white/10 hover:border-white/50")}
              href="https://wa.me/6285811180606"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </Card>
    </Container>
  );
}
