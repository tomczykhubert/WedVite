import ActionButton from "@/components/base/button-link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Minus,
  Plus,
} from "lucide-react";
import { useTablePlanner } from "./table-planner-context";

interface CanvasControlsProps {
  controlsT: (key: string) => string;
}

export function CanvasControls({ controlsT }: CanvasControlsProps) {
  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    startPanning,
    stopPanning,
  } = useTablePlanner();

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
      <ActionButton
        variant="outline"
        size="sm"
        onClick={handleResetView}
        className="w-full"
      >
        {controlsT("resetView")}
      </ActionButton>

      {/* Pan Controls */}
      <div className="flex flex-col gap-1 border rounded-lg p-1 bg-background">
        <div className="flex justify-center">
          <ActionButton
            variant="ghost"
            size="icon"
            onMouseDown={() => startPanning("up")}
            onMouseUp={stopPanning}
            onMouseLeave={stopPanning}
          >
            <ArrowUp />
          </ActionButton>
        </div>
        <div className="flex gap-1 justify-center">
          <ActionButton
            variant="ghost"
            size="icon"
            onMouseDown={() => startPanning("left")}
            onMouseUp={stopPanning}
            onMouseLeave={stopPanning}
          >
            <ArrowLeft />
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="icon"
            onMouseDown={() => startPanning("down")}
            onMouseUp={stopPanning}
            onMouseLeave={stopPanning}
          >
            <ArrowDown />
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="icon"
            onMouseDown={() => startPanning("right")}
            onMouseUp={stopPanning}
            onMouseLeave={stopPanning}
          >
            <ArrowRight />
          </ActionButton>
        </div>
      </div>

      <div className="flex items-center gap-1 border rounded-lg p-1 bg-background">
        <ActionButton
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          tooltip={controlsT("zoomOut")}
        >
          <Minus />
        </ActionButton>
        <span className="text-sm font-medium min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <ActionButton
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          tooltip={controlsT("zoomIn")}
        >
          <Plus />
        </ActionButton>
      </div>
    </div>
  );
}
