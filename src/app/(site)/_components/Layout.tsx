"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
import { useAuth } from "@/context/AuthContext";
import TopNewsCard from "./TopNewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axiosInstance";
import { toast } from "sonner";
import { memo } from "react";

export interface News {
  id: string;
  title: string;
  description: string;
  summary: string;
  sentiment_label: string;
  sentiment_score: number;
  category: string;
  published_at: string;
  source: string;
  link: string;
  image_url: string;
  persons: string;
  organizations: string;
  locations: string;
  read_time: number;
  popularity: number;
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

// Memoized skeleton loader component
const NewsCardSkeleton = memo(() => (
  <div className="w-full min-h-[250px] px-5 md:px-0 animate-pulse flex flex-col space-y-3">
    <Skeleton className="w-full h-[190px] rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-[90%]" />
      <Skeleton className="h-6 w-[80%]" />
    </div>
  </div>
));

NewsCardSkeleton.displayName = "NewsCardSkeleton";

// Memoized tab trigger component
const CustomTabsTrigger = memo(({ tab }) => (
  <TabsTrigger
    value={tab.value}
    className="h-full min-w-max border-0 shadow-none rounded-none px-4 py-2 font-medium text-sm sm:text-base data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 hover:text-gray-700"
  >
    {tab.icon}
    {tab.title}
  </TabsTrigger>
));

CustomTabsTrigger.displayName = "CustomTabsTrigger";

// Memoized news card for better performance
const MemoizedNewsCard = memo(NewsCard);
const MemoizedTopNewsCard = memo(TopNewsCard);

const Layout = () => {
  const { user, loading: authLoading } = useAuth();
  const [allNews, setAllNews] = useState<News[]>([]);
  const [fetching, setFetching] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch news function - extracted as a useCallback to prevent recreation on every render
  const fetchNews = useCallback(async () => {
    if (!user?.uid) return;

    setFetching(true);
    try {
      const response = await api.post("/api/user/fetch-news", {
        userId: user?.uid,
      });

      if (response.data.success) {
        setAllNews(response.data.news || []);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Something went wrong fetching news.");
    } finally {
      setFetching(false);
    }
  }, [user?.uid]);

  // Effect to fetch news when user is available
  useEffect(() => {
    if (user?.uid && mounted) {
      fetchNews();
    }
  }, [user?.uid, fetchNews, mounted]);

  // Memoize the formatted news items to prevent recalculation on every render
  const formattedNewsItems = useMemo(() => {
    return allNews.map((item) => ({
      ...item,
      publishedDate: new Date(item.published_at),
      sentiment_label:
        item.sentiment_label === "1 star" || item.sentiment_label === "2 stars"
          ? "negative"
          : item.sentiment_label === "4 stars" ||
            item.sentiment_label === "5 stars"
          ? "positive"
          : "neutral",
    }));
  }, [allNews]);

  if (!mounted || authLoading || fetching) {
    return (
      <section className="w-full py-12 px-0">
        <div className="w-full container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <NewsCardSkeleton />
          <Tabs defaultValue={tabs[0].value} className="w-full bg-transparent">
            <TabsList className="w-full h-14 sticky top-0 z-50 bg-white mb-4 border-b rounded-none p-0 overflow-x-auto justify-start">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.title}
                  value={tab.value}
                  className="h-full min-w-max border-0 shadow-none rounded-none px-4 py-2 font-medium text-sm sm:text-base data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 hover:text-gray-700"
                >
                  {tab.icon}
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={tabs[0].value} className="px-5 md:px-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 items-start">
                {Array.from({ length: 6 }).map((_, index) => (
                  <NewsCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    );
  }

  // Extract top news and remaining news for better readability
  const topNews = formattedNewsItems[0];
  const remainingNews = formattedNewsItems.slice(1);

  return (
    <section className="w-full py-12 px-0">
      <div className="w-full container mx-auto flex flex-col items-center gap-16 lg:px-16">
        {user ? (
          <div className="w-full px-5 md:px-0">
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
              <span className="inline">{`Hottest News of the Day`}</span>
              <span className="inline-block ml-2 align-middle">
                <Flame className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px]" />
              </span>
            </h2>
            {topNews && <TopNewsCard news={topNews} />}
          </div>
        ) : (
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
        )}

        <Tabs defaultValue={tabs[0].value} className="w-full bg-transparent">
          <TabsList className="w-full h-14 sticky top-0 z-50 bg-white mb-4 border-b rounded-none p-0 overflow-x-auto justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.title}
                value={tab.value}
                className="h-full min-w-max border-0 shadow-none rounded-none px-4 py-2 font-medium text-sm sm:text-base data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 hover:text-gray-700"
              >
                {tab.icon}
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tabs[0].value} className="px-5 md:px-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 items-start">
              {remainingNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>

          {tabs.slice(1).map((tab) => (
            <TabsContent
              key={tab.title}
              value={tab.value}
              className="min-h-[600px]"
            >
              {tab.title} will be available soon.
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Layout;
