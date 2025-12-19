import { useCallback, useRef } from "react";
import { useTablePlanner } from "../table-planner-context";

interface UseGuestDragProps {
  seatId: string;
  guestId: string | null;
  onGuestMove: (fromSeatId: string, toSeatId: string) => void;
}

export function useGuestDrag({
  seatId,
  guestId,
  onGuestMove,
}: UseGuestDragProps) {
  const { guestDragState, setGuestDragState } = useTablePlanner();
  const touchDataRef = useRef<{ seatId: string; guestId: string } | null>(null);

  const isDragging =
    guestDragState.draggingSeatId === seatId &&
    !!guestDragState.draggingGuestId;
  const isOver = guestDragState.overSeatId === seatId && !isDragging;

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (!guestId) return;

      setGuestDragState({
        draggingSeatId: seatId,
        draggingGuestId: guestId,
        overSeatId: null,
      });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("seatId", seatId);
      e.dataTransfer.setData("guestId", guestId);
    },
    [guestId, seatId, setGuestDragState]
  );

  const handleDragEnd = useCallback(() => {
    setGuestDragState({
      draggingSeatId: null,
      draggingGuestId: null,
      overSeatId: null,
    });
  }, [setGuestDragState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      setGuestDragState((prev) => ({ ...prev, overSeatId: seatId }));
    },
    [seatId, setGuestDragState]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      // Only clear if we're leaving the button itself, not a child
      if (e.currentTarget === e.target) {
        setGuestDragState((prev) => ({ ...prev, overSeatId: null }));
      }
    },
    [setGuestDragState]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setGuestDragState((prev) => ({ ...prev, overSeatId: null }));

      const fromSeatId = e.dataTransfer.getData("seatId");
      const draggedGuestId = e.dataTransfer.getData("guestId");

      if (fromSeatId && fromSeatId !== seatId && draggedGuestId) {
        onGuestMove(fromSeatId, seatId);
      }
    },
    [seatId, onGuestMove, setGuestDragState]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!guestId) return;

      e.stopPropagation();
      setGuestDragState({
        draggingSeatId: seatId,
        draggingGuestId: guestId,
        overSeatId: null,
      });
      touchDataRef.current = { seatId, guestId };
    },
    [guestId, seatId, setGuestDragState]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      setGuestDragState({
        draggingSeatId: null,
        draggingGuestId: null,
        overSeatId: null,
      });

      if (!touchDataRef.current) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const allSeats = Array.from(
        document.querySelectorAll<HTMLElement>("[data-seat-id]")
      );

      let closestSeat: HTMLElement | null = null;
      let closestDistance = Infinity;
      const maxDistance = 100;

      for (const seatElement of allSeats) {
        const rect = seatElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(touch.clientX - centerX, 2) +
            Math.pow(touch.clientY - centerY, 2)
        );

        if (distance < closestDistance && distance < maxDistance) {
          closestDistance = distance;
          closestSeat = seatElement;
        }
      }

      if (closestSeat) {
        const toSeatId = closestSeat.getAttribute("data-seat-id");
        if (toSeatId && toSeatId !== touchDataRef.current.seatId) {
          onGuestMove(touchDataRef.current.seatId, toSeatId);
        }
      }

      touchDataRef.current = null;
    },
    [onGuestMove, setGuestDragState]
  );

  return {
    isDragging,
    isOver,
    dragHandlers: {
      draggable: !!guestId,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
