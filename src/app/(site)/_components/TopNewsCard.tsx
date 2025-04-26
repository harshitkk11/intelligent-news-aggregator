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

const TopNewsCard = ({ news }: Props) => {
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

  // const formatDate = (dateString: Date | string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  // };

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
            className="h-[300px] w-full object-cover object-center rounded-t-lg"
          />
        </div>
        <span className="absolute top-4 left-4 px-2 py-1 bg-white/90 rounded-md text-sm font-medium z-10">
          {news.category}
        </span>
      </div>
      <div className="px-6 flex justify-between items-center mb-2">
        <span className="text-sm md:text-base text-gray-500">
          {news.source} •{" "}
          {news.publishedDate
            ? formatDistanceToNow(new Date(news.publishedDate), {
                addSuffix: true,
              }).replace("about ", "")
            : "N/A"}
        </span>
        <span className="text-sm md:text-base text-gray-500">
          {news.readTime} min read
        </span>
      </div>
      <CardHeader>
        <h3 className="w-[90%] text-xl font-semibold hover:underline md:text-2xl">
          {/* <a href={news.url} target="_blank"> */}
          {news.title} {news.title}
          {/* </a> */}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground w-[70%]">{news.description}</p>
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

export default TopNewsCard;
