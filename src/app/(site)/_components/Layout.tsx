"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Clock,
  Flame,
  Home,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import NewsCard from "./NewsCard";
import { useSession } from "next-auth/react";
import TopNewsCard from "./TopNewsCard";

export interface News {
  id: string;
  title: string;
  description: string;
  summary: string;
  source: string;
  category: string;
  publishedDate: Date;
  readTime: number;
  sentiment: string;
  imageUrl: string;
  popularity: number;
  relevanceScore: number;
  url: string;
}

interface Props {
  allNews: News[];
}

const tabs = [
  {
    title: "For You",
    icon: <Home size={16} className="inline mr-1" />,
    value: "for-you",
  },
  {
    title: "Trending",
    icon: <TrendingUp size={16} className="inline mr-1" />,
    value: "trending",
  },
  {
    title: "Latest",
    icon: <Clock size={16} className="inline mr-1" />,
    value: "latest",
  },
  {
    title: "Saved",
    icon: <Bookmark size={16} className="inline mr-1" />,
    value: "saved",
  },
];

const Layout = ({ allNews }: Props) => {
  const session = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full py-12 px-0">
      <div className="w-full container mx-auto flex flex-col items-center gap-16 lg:px-16">
        {mounted && session.status !== "authenticated" ? (
          <div className="text-center px-5 md:px-0">
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
              News That Matters to You, Curated Intelligently
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
              Your personalized news hub that learns what you care about and
              delivers it from trusted sources across the web.
            </p>
            <Button variant="link" className="w-full sm:w-auto" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="px-5 md:px-0">
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl flex items-center gap-2">
              Hottest News of the Day{" "}
              <Flame className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px]" />
            </h2>
            <TopNewsCard news={allNews[0]} />
          </div>
        )}

        <Tabs defaultValue={tabs[0].value} className="w-full bg-transparent">
          <TabsList className="w-full h-14 sticky top-0 z-50 bg-white shadow-sm mb-4 border-b rounded-none p-0 overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.title}
                value={tab.value}
                className="h-full w-full border-0 shadow-none rounded-none px-4 py-2 font-medium text-sm sm:text-base data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 hover:text-gray-700"
              >
                {tab.icon}
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tabs[0].value} className="px-5 md:px-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {allNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>
          {tabs.slice(1).map((tab) => (
            <TabsContent key={tab.title} value={tab.value}>
              {tab.title} content goes here.
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Layout;
