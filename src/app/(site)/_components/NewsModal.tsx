import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { News } from "./Layout";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface NewsModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  news: News;
}

const NewsModal: React.FC<NewsModalProps> = ({
  children,
  isOpen,
  setIsOpen,
  news,
}) => {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-full flex flex-col gap-4 overflow-auto">
        <DialogHeader className="space-y-3">
          <div className="pt-6 flex justify-between items-center mb-2">
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
            <span
              className={`w-auto text-xs px-5 py-2 rounded-full ${getSentimentColor()} capitalize`}
            >
              {news.sentiment_label}
            </span>
          </div>
          <div className="transition-opacity duration-200 fade-in hover:opacity-90">
            <Image
              src={news.image_url}
              alt={news.title}
              width={500}
              height={300}
              className="h-full w-full object-cover object-center rounded-lg"
            />
          </div>
          <DialogTitle>{news.title}</DialogTitle>
          <DialogDescription>{news.description}</DialogDescription>
        </DialogHeader>
        <div className="border rounded-lg p-2 space-y-2">
          <h3 className="font-semibold">Summary</h3>
          <p className="text-sm">{news.summary}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsModal;
