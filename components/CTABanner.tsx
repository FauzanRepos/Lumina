import Link from "next/link";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/layout/Container";

export function CtaBanner(): JSX.Element {
  return (
    <Container className="mt-20">
      <Card className="relative overflow-hidden border-none bg-primary-500 text-white shadow-glow">
        <div className="absolute inset-0 bg-cta-sheen" />
        <div className="absolute right-[-28px] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full border-[18px] border-white/15" />
        <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-12">
          <div className="max-w-xl">
            <p className="text-small font-semibold uppercase tracking-[0.24em] text-white/70">Siap Ngobrol?</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Ada pertanyaan mengenai layanan psikologi kami?
            </h2>
            <p className="mt-4 text-small leading-7 text-white/80 sm:text-base">
              Tim kami akan membantu mengarahkan kebutuhanmu, menjelaskan format layanan, dan menyiapkan langkah pertama yang terasa paling pas.
            </p>
          </div>
          <Link
            className={buttonClasses({ variant: "secondary", size: "md" })}
            href="mailto:halo@lumina.consulting"
          >
            Hubungi Kami
          </Link>
        </div>
      </Card>
    </Container>
  );
}