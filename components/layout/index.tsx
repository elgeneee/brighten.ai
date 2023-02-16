import { ReactNode } from "react";
import Image from "next/image";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="-z-20 min-h-screen w-full bg-gradient-to-br from-emerald-200/40 via-teal-100/30  to-lime-200/30 ">
        {/* navbar */}
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <div>
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="logo.png" alt="Logo" width={40} />
            </Link>
          </div>
          <div>
            <a
              href="https://github.com/elgeneee/brighten.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </a>
          </div>
        </div>
        {/* body */}
        <main className="flex min-h-screen w-full  flex-col items-center py-32 px-2 md:px-0">
          {children}
        </main>
        {/* footer */}
        <div className="mx-auto flex items-center justify-center border-t border-gray-200 py-7 text-xs font-bold">
          <p className="">Powered by</p>

          <a
            className="font-semibold  transition-colors"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Next.js Logo"
              width="60"
              height="30"
              className="mx-2"
            />
          </a>
          <p>+</p>
          <a
            className="font-semibold transition-colors"
            href="https://upstash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/upstash.svg"
              alt="Next.js Logo"
              width="20"
              height="30"
              className="mx-2"
            />
          </a>
        </div>
      </div>
    </>
  );
}
