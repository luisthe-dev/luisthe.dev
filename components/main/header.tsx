"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

type Props = {};

const HeaderComponent = (props: Props) => {
  const { setTheme, theme } = useTheme();

  return (
    <div>
      <div
        className={
          "bg-background p-4 md:px-16 w-full flex items-center justify-between border-0 border-b border-transparent shadow-sm shadow-accent"
        }
      >
        <div className="p-2">
          <p> LuisThe.Dev </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <nav className="max-md:hidden flex items-center justify-center gap-4 pr-3">
            <Link
              href={"/"}
              className="font-medium text-muted-foreground hover:text-accent-foreground text-sm "
            >
              Home
            </Link>
            <Link
              href={"/blog"}
              className="font-medium text-muted-foreground hover:text-accent-foreground text-sm"
            >
              Blog
            </Link>
            <Link
              href={"/me"}
              className="font-medium text-muted-foreground hover:text-accent-foreground text-sm"
            >
              Me
            </Link>
          </nav>
          <div className="px-2 border-solid border-0 md:border-l md:border-l-secondary">
            <div
              className="p-2.5 rounded-md border border-transparent shadow-none hover:shadow-sm shadow-secondary cursor-pointer"
              onClick={() => setTheme(theme == "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </div>
          </div>
          <div className="border-solid border rounded-sm hidden max-md:block">
            <div className="p-2.5 rounded-md border border-transparent shadow-none hover:shadow-sm shadow-secondary cursor-pointer">
              <Menu size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
