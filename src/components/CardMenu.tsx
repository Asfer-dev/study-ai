"use client";
import { useEffect, useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CardMenuProps {
  children: React.ReactNode;
  menuClassName?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
  animateIn?: string;
  animateOut?: string;
}

const CardMenu = ({
  children,
  menuClassName,
  buttonClassName,
  icon,
  animateIn,
  animateOut,
}: CardMenuProps) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the target is not the menu and not the button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest(".menu-button")
        ) // Adjust the selector based on your button's class or identifier
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  return (
    <>
      <Button
        variant={"ghost"}
        onClick={toggleMenu}
        className={cn(
          "menu-button focus:outline-none p-2",
          isMenuOpen && "bg-zinc-100",
          buttonClassName
        )}
      >
        {icon ? (
          icon
        ) : (
          <EllipsisVertical className="ml-auto text-zinc-500 w-5" />
        )}
      </Button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute-element bg-white border rounded overflow-hidden shadow z-[9999]",
            menuClassName,
            isMenuOpen
              ? animateIn
                ? animateIn
                : "animate-slide-in"
              : animateOut
              ? animateOut
              : "animate-slide-out pointer-events-none" // pointer-events-none disables interaction when closed
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default CardMenu;
