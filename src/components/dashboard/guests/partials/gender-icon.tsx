import { Gender } from "@prisma/client";
import { FaMars, FaQuestion, FaVenus } from "react-icons/fa6";

export function getGenderIcon(
  gender: Gender,
  size: "small" | "default" = "default"
) {
  switch (gender) {
    case Gender.MALE:
      return (
        <FaMars
          className={`text-blue-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case Gender.FEMALE:
      return (
        <FaVenus
          className={`text-pink-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case Gender.UNSPECIFIED:
    default:
      return (
        <FaQuestion
          className={`text-yellow-500 w-8 ${size === "small" ? "size-3" : "size-4"}`}
        />
      );
  }
}
