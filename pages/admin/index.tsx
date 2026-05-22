import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";

export default function AdminPage(): JSX.Element {
  const [isCmsReady, setIsCmsReady] = useState(false);

  useEffect(() => {
    const checkCmsReady = () => {
      const cmsRoot = document.getElementById("nc-root");
      const ready = Boolean(cmsRoot && cmsRoot.childElementCount > 0);

      if (ready) {
        setIsCmsReady(true);
      }

      return ready;
    };

    if (checkCmsReady()) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (checkCmsReady()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Lumina Content Manager</title>
        <base href="/admin/" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <style jsx global>{`
        html,
        body,
        #__next {
          height: auto;
          min-height: 0;
        }

        body {
          background: #ffffff;
        }
      `}</style>

      {!isCmsReady ? (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-10 flex justify-center px-4 text-neutral-900">
          <section className="w-full max-w-[640px] rounded-[24px] border border-primary-300/40 bg-white/95 p-5 shadow-[0_24px_60px_rgba(31,74,117,0.12)] backdrop-blur">
            <p className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-primary-600">Lumina CMS</p>
            <p className="text-sm leading-7 text-neutral-600">
              Loading the editorial workspace. For local editing, run <code>npm run dev:decap</code> so Decap can
              connect to the local Git proxy backend.
            </p>
          </section>
        </div>
      ) : null}

      <Script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js" strategy="afterInteractive" />
    </>
  );
}