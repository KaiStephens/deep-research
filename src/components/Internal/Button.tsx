"use client";
import { forwardRef, type ForwardedRef, useMemo } from "react";
import {
  Button as OriginalButton,
  type ButtonProps,
} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { omit } from "radash";

interface Props extends ButtonProps {
  side?: "top" | "right" | "bottom" | "left";
  sideoffset?: number;
}

function ButtonWithTooltip(
  props: Props,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  // Use useMemo to avoid recreating props object on every render
  const buttonProps = useMemo(() => {
    return omit(props, ["title", "side", "sideoffset"]);
  }, [props]);

  if (props.title) {
    const { side = "top", sideoffset = 0 } = props;
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <OriginalButton ref={forwardedRef} {...buttonProps} />
          </TooltipTrigger>
          <TooltipContent
            side={side}
            sideOffset={sideoffset}
            className="max-md:hidden"
          >
            <p>{props.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return <OriginalButton ref={forwardedRef} {...props} />;
  }
}

const Button = forwardRef(ButtonWithTooltip);
Button.displayName = "ButtonWithTooltip";

export { Button };
