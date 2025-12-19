interface CanvasHintProps {
  hint: React.ReactNode;
}

export function CanvasHint({ hint }: CanvasHintProps) {
  return (
    <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded pointer-events-none">
      {hint}
    </div>
  );
}
