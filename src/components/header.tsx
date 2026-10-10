import Image from "next/image";
import Link from "next/link";
import AuthNavigation from "./auth-navigation";
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

        <AuthNavigation />
      </div>
    </header>
  );
}
