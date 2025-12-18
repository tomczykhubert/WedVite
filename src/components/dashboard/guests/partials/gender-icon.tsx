import { Gender } from "@prisma/client";
import { HelpCircle, Mars, Venus } from "lucide-react";

export function getGenderIcon(
  gender: Gender,
  size: "small" | "default" = "default"
) {
  switch (gender) {
    case Gender.MALE:
      return (
        <Mars
          className={`text-blue-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case Gender.FEMALE:
      return (
        <Venus
          className={`text-pink-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case Gender.UNSPECIFIED:
    default:
      return (
        <HelpCircle
          className={`text-yellow-500 w-8 ${size === "small" ? "size-3" : "size-4"}`}
        />
      );
  }
}
