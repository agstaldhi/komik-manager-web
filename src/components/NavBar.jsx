import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function NavBar({ items, activeTab: propActiveTab, onTabChange, className }) {
  const [activeTab, setActiveTab] = useState(propActiveTab);

  // Sync state if prop changes from outside
  useEffect(() => {
    setActiveTab(propActiveTab);
  }, [propActiveTab]);

  const handleTabClick = (url) => {
    setActiveTab(url);
    if (onTabChange) {
      onTabChange(url);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 pointer-events-auto",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 bg-background/20 dark:bg-zinc-950/40 border border-border/60 dark:border-zinc-800/80 backdrop-blur-xl py-1 px-1 rounded-full shadow-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.url;

          return (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.url)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-full transition-all duration-300 outline-none select-none",
                "text-foreground/80 hover:text-primary",
                isActive && "text-primary font-bold",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden flex items-center justify-center">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
