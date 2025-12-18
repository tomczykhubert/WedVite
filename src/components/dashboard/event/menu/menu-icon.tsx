import { UtensilsCrossed } from "lucide-react";

const getContrastColorClassName = (hexColor: string): string => {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "text-black" : "text-white";
};

export const MenuIcon = ({ color }: { color: string }) => {
  const colorClassName = getContrastColorClassName(color);

  return (
    <div
      className="rounded-full flex items-center justify-center p-2"
      style={{ backgroundColor: color }}
    >
      <UtensilsCrossed className={colorClassName} />
    </div>
  );
};
