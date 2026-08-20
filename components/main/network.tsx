import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  articles: any[];
};

const PostNetworkComponent = ({ articles }: Props) => {
  return (
    <div className="w-full py-8">
      <div className="w-full py-6 px-3 gap-1 flex flex-col">
        <p className="font-bold text-3xl">network across the web</p>
        <p className="font-medium text-md text-muted-foreground">
          recent rants published on the net
        </p>
        <div className="flex max-md:flex-col flex-wrap rounded-md bg-muted mt-5">
          {articles.map((article, articleIndex) => (
            <div
              className={`flex items-center gap-1 justify-between p-4 px-6 w-full md:w-1/2 md:border-solid border-b ${articleIndex + 2 == articles.length ? "md:border-b-0" : ""} last:border-none odd:md:border-r border-muted-foreground`}
            >
              <div className="flex flex-col items-start gap-1 justify-center">
                <p className="font-semibold text-md">
                  The Engineer vs The Manager
                </p>
                <p className="font-light text-[10px]"> June 16, 2025 </p>
              </div>
              <div className="flex flex-col items-end gap-2 justify-center px-1">
                <span className="text-[10px] text-right font-semibold p-1 px-2 border rounded-sm">
                  Medium
                </span>
                <Link
                  href={"/blog/article"}
                  className="rounded-sm text-[10px] inline-block whitespace-nowrap"
                >
                  Read Now! <ExternalLink size={10} className="inline-block" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostNetworkComponent;
