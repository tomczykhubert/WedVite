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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || e.touches.length !== 1) {
      return;
    }

    e.stopPropagation(); // Prevent canvas pan
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartPos.current = {
      x: touch.clientX / zoom - position.x,
      y: touch.clientY / zoom - position.y,
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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX / zoom - dragStartPos.current.x;
      const newY = touch.clientY / zoom - dragStartPos.current.y;
      onDragUpdate?.(newX, newY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(position.x, position.y);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      onDragEnd(position.x, position.y);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, position, zoom, onDragEnd, onDragUpdate]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
  };
}
