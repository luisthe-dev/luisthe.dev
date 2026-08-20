import { ArrowRightIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  article: any;
};

const BlogPreviewCard = ({ article }: Props) => {
  return (
    <div className="w-full md:w-3/12 min-w-52 rounded-sm shadow-sm flex flex-col gap-2 border border-accent rounded-t-2xl">
      <div className="bg-[url(/24.jpg)] bg-cover bg-no-repeat py-20 rounded-t-2xl"></div>
      <div className="p-2 flex flex-col items-start justify-start gap-1">
        <span className="text-[8px] font-semibold shadow-sm p-1 px-2 shadow-muted rounded-sm mb-2">
          category
        </span>
        <p className="text-md font-semibold"> Welcome To LuisMania </p>
        <p className="text-xs font-medium text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="flex items-center justify-between mx-3 border-solid border-t border-t-accent py-1">
        <Link href={"/blog/article"} className="rounded-sm p-2 text-[10px]">
          read more <ChevronRight size={10} className="inline" />
        </Link>
        <p className="text-[10px] font-bold cap"> feb 11, 2020 </p>
      </div>
    </div>
  );
};

export default BlogPreviewCard;
