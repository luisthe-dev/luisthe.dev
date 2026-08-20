import Link from "next/link";
import React from "react";

type Props = {};

const FooterComponent = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-start flex-col md:flex-row justify-between border-solid border-t border-t-muted p-5 pb-16 w-full md:w-3/4">
        <div className="flex flex-col gap-1 p-4">
          <p className="font-bold text-2xl"> LuisThe.Dev </p>
          <p className="font-light text-xs text-muted-foreground">
            &copy;2026. LuisThe.Dev. Rights Reserved!
          </p>
        </div>
        <div className="flex max-md:flex-col max-md:gap-7 flex-1 items-start justify-between p-4 md:px-8 text-muted-foreground">
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="font-semibold text-md text-primary pb-2">
              My Socials
            </p>
            <Link className="font-medium text-sm hover:text-foreground" href={""} target="_blank">
              Medium
            </Link>
            <Link className="font-medium text-sm hover:text-foreground" href={""} target="_blank">
              Substack
            </Link>
            <Link
              className="font-medium text-sm hover:text-foreground"
              href={"https://x.com/luisthe___dev"}
              target="_blank"
            >
              X
            </Link>
          </div>
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="font-semibold text-md text-primary pb-2">
              My Work Socials
            </p>
            <Link
              className="font-medium text-sm hover:text-foreground"
              href={"https://github.com/luisthe-dev"}
              target="_blank"
            >
              GitHub
            </Link>
            <Link
              className="font-medium text-sm hover:text-foreground"
              href={"https://linkedin.com/in/divinegiftadesiyan"}
              target="_blank"
            >
              LinkedIn
            </Link>
          </div>
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="font-semibold text-md text-primary pb-2">
              Navigation
            </p>
            <Link
              className="font-medium text-sm hover:text-foreground"
              href={"https://luisdev.ng"}
              target="_blank"
            >
              Projects
            </Link>
            <Link className="font-medium text-sm hover:text-foreground" href={"/blog"}>
              Blog
            </Link>
            <Link className="font-medium text-sm hover:text-foreground" href={"/me"}>
              Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
