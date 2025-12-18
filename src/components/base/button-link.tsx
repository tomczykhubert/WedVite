import {
  Button as ButtonPrimitive,
  buttonVariants,
} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import type { VariantProps } from "class-variance-authority";
import React from "react";

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  tooltip?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  href?: string;
  asChild?: boolean;
}

const ActionButton: React.FC<ButtonProps> = ({
  tooltip,
  tooltipSide,
  children,
  href,
  ...buttonProps
}) => {
  const buttonContent = (
    <ButtonPrimitive asChild={!!href} {...buttonProps}>
      {href ? <Link href={href}>{children}</Link> : children}
    </ButtonPrimitive>
  );

  if (!tooltip) {
    return buttonContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionButton;
