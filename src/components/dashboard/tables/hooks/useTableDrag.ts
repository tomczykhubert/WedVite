import { useEffect, useRef, useState } from "react";

interface UseTableDragProps {
  initialX: number;
  initialY: number;
  zoom: number;
  onDragEnd: (x: number, y: number) => void;
  onDragUpdate?: (x: number, y: number) => void;
  disabled?: boolean;
}

export function useTableDrag({
  initialX,
  initialY,
  zoom,
  onDragUpdate,
  onDragEnd,
  disabled = false,
}: UseTableDragProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || disabled) {
      return;
    }

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX / zoom - position.x,
      y: e.clientY / zoom - position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX / zoom - dragStartPos.current.x;
      const newY = e.clientY / zoom - dragStartPos.current.y;
      onDragUpdate?.(newX, newY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(position.x, position.y);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position, zoom, onDragEnd, onDragUpdate]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}
