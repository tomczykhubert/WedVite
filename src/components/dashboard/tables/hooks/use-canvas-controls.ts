import { useEffect, useRef, useState } from "react";
import { PAN_SPEED } from "../constants";

export function useCanvasControls() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panStartPos = useRef({ x: 0, y: 0 });
  const panIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activePanKey = useRef<string | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.shiftKey) {
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(Math.max(0.5, zoom + delta), 2);
      setZoom(newZoom);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.ctrlKey || e.shiftKey) && e.button === 0) {
      setIsPanning(true);
      panStartPos.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const startPanning = (direction: "up" | "down" | "left" | "right") => {
    if (panIntervalRef.current) return;

    panIntervalRef.current = setInterval(() => {
      setPan((prev) => {
        switch (direction) {
          case "up":
            return { x: prev.x, y: prev.y + PAN_SPEED };
          case "down":
            return { x: prev.x, y: prev.y - PAN_SPEED };
          case "left":
            return { x: prev.x + PAN_SPEED, y: prev.y };
          case "right":
            return { x: prev.x - PAN_SPEED, y: prev.y };
          default:
            return prev;
        }
      });
    }, 16);
  };

  const stopPanning = () => {
    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current);
      panIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - panStartPos.current.x,
        y: e.clientY - panStartPos.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      if (canvasRef.current && isCtrlPressed) {
        canvasRef.current.style.cursor = "grab";
      } else if (canvasRef.current) {
        canvasRef.current.style.cursor = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, isCtrlPressed]);

  // Keyboard controls effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.shiftKey) && !isCtrlPressed) {
        setIsCtrlPressed(true);
        if (canvasRef.current && !isPanning) {
          canvasRef.current.style.cursor = "grab";
        }
      }

      // Handle arrow key panning
      if (!activePanKey.current) {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            activePanKey.current = "ArrowUp";
            startPanning("up");
            break;
          case "ArrowDown":
            e.preventDefault();
            activePanKey.current = "ArrowDown";
            startPanning("down");
            break;
          case "ArrowLeft":
            e.preventDefault();
            activePanKey.current = "ArrowLeft";
            startPanning("left");
            break;
          case "ArrowRight":
            e.preventDefault();
            activePanKey.current = "ArrowRight";
            startPanning("right");
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.shiftKey) {
        setIsCtrlPressed(false);
        if (canvasRef.current && !isPanning) {
          canvasRef.current.style.cursor = "";
        }
      }

      // Stop panning when arrow key is released
      if (e.key === activePanKey.current) {
        stopPanning();
        activePanKey.current = null;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isCtrlPressed, isPanning]);

  return {
    zoom,
    pan,
    setPan,
    canvasRef,
    isCtrlPressed,
    handleWheel,
    handleMouseDown,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    startPanning,
    stopPanning,
  };
}
