import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight } from "lucide-react";
import { OffscreenIndicator } from "./utils/offscreenIndicators";

interface OffscreenIndicatorsProps {
  indicators: OffscreenIndicator[];
  onNavigate: (indicator: OffscreenIndicator) => void;
}

export function OffscreenIndicators({
  indicators,
  onNavigate,
}: OffscreenIndicatorsProps) {
  return (
    <>
      {indicators.map((indicator, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div
              className="absolute flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-lg pointer-events-auto cursor-pointer w-8 h-8 hover:scale-110 transition-transform"
              style={{
                left: indicator.x,
                top: indicator.y,
                transform: `translate(-50%, -50%)`,
              }}
              onClick={() => onNavigate(indicator)}
            >
              <ArrowRight
                className="h-4 w-4"
                style={{
                  transform: `rotate(${indicator.angle}deg)`,
                }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{indicator.tableName}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}
