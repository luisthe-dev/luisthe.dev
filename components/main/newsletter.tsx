import { Mail } from "lucide-react";
import React from "react";

type Props = {};

const NewsletterComponent = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full md:w-3/4 rounded-xl bg-accent py-16">
        <p className="font-bold uppercase text-sm text-muted-foreground">
          Newsletter
        </p>
        <p className="w-3/4 font-semibold text-xs text-secondary-foreground text-center py-3">
          You'd be notified everytime I rant about something... Do you really
          wanna though? It'll be like once every 2 week, or twice if life teaches me more...
        </p>
        <div className="mt-3 w-full flex flex-col gap-3 items-center justify-center">
          <form className="flex items-center justify-center border rounded-xl pl-3 gap-2 w-10/12 md:w-1/2">
            <Mail size={18} />
            <input
              placeholder="email"
              className="font-semibold text-xs py-3 rounded-l-xl outline-none flex-1"
            />
            <button className="font-semibold text-xs py-3 px-6 whitespace-nowrap rounded-r-xl bg-primary text-primary-foreground cursor-pointer hover:bg-secondary hover:text-secondary-foreground" type="submit">
              Join In
            </button>
          </form>
          <span className="font-medium text-xs text-muted-foreground"> No spam. Unsubscribe anytime! </span>
        </div>
      </div>
    </div>
  );
};

export default NewsletterComponent;
