import React from "react";
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
// import { ArrowRight } from "lucide-react";
import { News } from "./Layout";
import { formatDistanceToNow } from "date-fns";

interface Props {
  news: News;
}

const NewsCard = ({ news }: Props) => {
  const getSentimentColor = () => {
    switch (news.sentiment) {
      case "Positive":
        return "bg-green-100 text-green-800";
      case "Negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      key={news.id}
      className="overflow-hidden grid grid-rows-[auto_auto_1fr_auto] pt-0"
    >
      <div className="relative w-full">
        <div
          //   href={news.url}
          //   target="_blank"
          className="transition-opacity duration-200 fade-in hover:opacity-90"
        >
          <Image
            src={news.imageUrl}
            alt={news.title}
            width={500}
            height={300}
            className="h-full w-full object-cover object-center rounded-t-lg"
          />
        </div>
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded-md text-xs font-medium z-10">
          {news.category}
        </span>
      </div>

      <div className="px-6 flex justify-between items-center mb-2">
        <span className="text-xs md:text-sm text-gray-500">
          {news.source} •{" "}
          {news.publishedDate
            ? formatDistanceToNow(new Date(news.publishedDate), {
                addSuffix: true,
              }).replace("about ", "")
            : "N/A"}
        </span>
        <span className="text-xs md:text-sm text-gray-500">
          {news.readTime} min read
        </span>
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold hover:underline md:text-xl">
          {/* <a href={news.url} target="_blank"> */}
          {news.title}
          {/* </a> */}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{news.description}</p>
      </CardContent>
      <div className="px-6">
        <span
          className={`w-auto text-xs px-2 py-1 rounded-full ${getSentimentColor()}`}
        >
          {news.sentiment}
        </span>
      </div>
      {/* <CardFooter>
        <div
          //   href={post.url}
          //   target="_blank"
          className="flex items-center text-foreground hover:underline"
        >
          Read more
          <ArrowRight className="ml-2 size-4" />
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default NewsCard;
