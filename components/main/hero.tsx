
import Link from "next/link";
import React from "react";

type Props = {};

const HomeHero = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-center bg-accent p-4">
      <div className="w-10/12 md:w-3/4 flex max-md:flex-col-reverse max-md:gap-6 items-center justify-between p-10">
        <div className="flex flex-col items-center md:items-start justify-center gap-2">
          <p className="bg-radial py-1.5 px-8 font-semibold text-[12px] text-muted-foreground rounded-xl shadow-sm">
            recent thought
          </p>
          <p className="font-medium text-5xl"> name </p>
          <p className="font-semibold text-2xl"> headline </p>
          <div>
            <Link href="/blog"> check blog </Link>
            <Link href="/me"> more on me? </Link>
          </div>
          <div className="flex gap-4">
            <p> G </p>
            <p> X </p>
            <p> In </p>
            <p> MI </p>
            <p> Me </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <p> crazy lottie </p>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
