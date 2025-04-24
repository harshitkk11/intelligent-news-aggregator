import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-svh flex flex-col justify-center items-center gap-3 py-10 px-5 text-center">
       <h1 className="text-7xl sm:text-9xl font-black tracking-wide py-1">
          404
        </h1>
      <h2 className="text-xl sm:text-2xl font-bold">Not Found</h2>
      <p className="min-w-[200px] max-w-[400px] text-base sm:text-lg md:text-xl text-secondary-foreground opacity-80">
        We couldn&apos;t find the page that you were looking for.
        <br /> Please check the URL or return to the home page.
      </p>
      <Link
        href="/"
        className="text-blue-600 font-bold text-xs sm:text-sm"
      >
        Return Home
      </Link>
    </div>
  );
}
