import Image from "next/image";
import Link from "next/link";
import CurrentDate from "./current-date";

export default function Header() {
  return (
    <header className="w-full border-b border-[#e9eeeb] bg-[#fafcfb] px-4 sm:px-6">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex  items-center gap-2.5">
          <span className="flex size-11 items-center justify-center rounded-[10px] ">
            <Image
              src="/logo-icon.png"
              alt=""
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </span>
          <span className="flex flex-col text-[#1c2923]">
            <span className="text-[1.35rem] font-bold leading-tight">
              বাজার দর
            </span>
            <span className="mt-0.5 text-[0.72rem] leading-tight">
              <CurrentDate />
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/signin"
            className=" px-2 py-2 text-sm font-medium text-[#1c2923] transition-colors hover:text-[#078f4b]"
          >
            সাইন ইন
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[#078f4b] px-5 py-2 text-sm font-medium text-white shadow-[0_2px_3px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#067c41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b]"
          >
            সাইন আপ
          </Link>
        </nav>
      </div>
    </header>
  );
}
