import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to Intelligent News Aggregator!</h1>
      <p>
        This is a sample application that demonstrates the integration of
        Next.js, Tailwind CSS, and Google Fonts.
      </p>
      <p>
        <a href="https://github.com/harshitkk11/intelligent-news-aggregator">
          View the source code on GitHub
        </a>
      </p>
      <div className="flex items-center gap-3">
        <Link href="/login" className="cursor-pointer">
          <Button>Login</Button>
        </Link>
        <Link href="/signup" className="cursor-pointer">
          <Button>Sign up</Button>
        </Link>
      </div>
    </main>
  );
}
