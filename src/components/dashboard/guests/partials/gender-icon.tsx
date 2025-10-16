import { Gender} from "@prisma/client";
import { FaQuestion } from "react-icons/fa";
import { TbGenderFemale, TbGenderMale } from "react-icons/tb";

export function getGenderIcon(
  gender: Gender,
  size: "small" | "default" = "default"
) {
  switch (gender) {
    case Gender.MALE:
      return (
        <TbGenderMale
          className={`text-blue-500 w-8 ${size === "small" ? "size-4" : "size-5"}`}
        />
      );
    case Gender.FEMALE:
      return (
        <TbGenderFemale
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
