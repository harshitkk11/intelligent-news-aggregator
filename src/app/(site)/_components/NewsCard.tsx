"use client";

import React, { useState } from "react";
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
import { Clock } from "lucide-react";
import NewsModal from "./NewsModal";

interface Props {
  news: News;
}

const NewsCard = ({ news }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getSentimentColor = () => {
    switch (news.sentiment_label) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <NewsModal isOpen={isOpen} setIsOpen={setIsOpen} news={news}>
      <Card
        key={news.id}
        onClick={() => setIsOpen(true)}
        className="overflow-hidden grid grid-rows-[auto_auto_1fr_auto] pt-0 gap-0"
      >
        <div className="relative w-full">
          <div
            //   href={news.url}
            //   target="_blank"
            className="transition-opacity duration-200 fade-in hover:opacity-90"
          >
            <Image
              src={news.image_url}
              alt={news.title}
              width={500}
              height={300}
              className="h-full w-full object-cover object-center rounded-t-lg"
            />
          </div>
          <span className="absolute top-4 left-4 px-2 py-1 bg-white/90 rounded-md text-sm font-medium z-10 capitalize">
            {news.category}
          </span>
        </div>

        <div className="px-4 sm:px-6 py-4 flex justify-between items-center mb-2">
          <div className="text-sm md:text-base text-gray-500">
            <span className="text-wrap">{news.source}</span> •{" "}
            <span className="text-nowrap">
              {news.published_at
                ? formatDistanceToNow(new Date(news.published_at), {
                    addSuffix: true,
                  }).replace("about ", "")
                : "N/A"}
            </span>
          </div>
        </div>
        <CardHeader className="px-4 sm:px-6">
          <h3 className="text-lg sm:text-xl font-semibold hover:underline text-start">
            {/* <a href={news.url} target="_blank"> */}
            {news.title}
            {/* </a> */}
          </h3>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 text-start">
          <p className="text-muted-foreground">{news.description}</p>
        </CardContent>
        <div className="px-4 sm:px-6 pt-5 flex justify-between">
          <span
            className={`w-auto text-xs px-2 py-1 rounded-full ${getSentimentColor()} capitalize`}
          >
            {news.sentiment_label}
          </span>
          <span className="text-nowrap text-sm md:text-base text-gray-500 flex items-center gap-1">
            <Clock className="w-4 h-4" /> {news.read_time} min read
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
    </NewsModal>
  );
};

export default NewsCard;
