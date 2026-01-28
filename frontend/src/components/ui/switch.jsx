import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, deviceType, ...props }) {
  const lightThemeColors = {
    light: "bg-[#2A2A2A] data-[state=checked]:bg-yellow-400",
    ac: "bg-[#2A2A2A] data-[state=checked]:bg-cyan-400",
    curtain: "bg-[#2A2A2A] data-[state=checked]:bg-orange-400",
    armed: "bg-[#2A2A2A] data-[state=checked]:bg-yellow-400",
    door: "bg-[#2A2A2A] data-[state=checked]:bg-cyan-400",
  };

  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

        // Default / dark theme
        "bg-gray-300 dark:bg-primary/30 data-[state=checked]:bg-primary",

        // Light theme only
        deviceType && lightThemeColors[deviceType] + " dark:bg-primary/30 dark:data-[state=checked]:bg-primary",

        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full shadow-md transition-transform",
          "bg-black dark:bg-background",
          "translate-x-0.5 data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };


