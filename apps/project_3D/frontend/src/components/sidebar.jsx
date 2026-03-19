// src/components/sidebar.jsx
import React from "react";
import { IconX } from "@tabler/icons-react";
import { cn }   from "../lib/utils";

export const Sidebar = ({ children, open, setOpen, className = "" }) => (
    <aside
      className={cn(
        `fixed z-40 inset-y-0 left-0 w-64 transform
         transition-transform duration-300
         bg-neutral-900 text-white shadow-lg
         ${open ? "translate-x-0" : "-translate-x-full"}`,
        // ✅ Desktop sticky below navbar
        "lg:relative lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
        className
      )}
    >
      {setOpen && (
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-pink-400 lg:hidden z-40 focus:outline-none"
          aria-label="Close sidebar"
        >
          <IconX className="w-6 h-6" />
        </button>
      )}
      {children}
    </aside>
  );
  

export const SidebarBody = ({ children, className = "" }) => (
  <div className={cn("h-full flex flex-col", className)}>{children}</div>
);

export const SidebarLink = ({ link }) => (
  <a
    href={link.href}
    className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md
               hover:bg-neutral-800 transition-colors"
  >
    {link.icon}
    <span>{link.label}</span>
  </a>
);
