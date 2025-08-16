import { useTranslations } from "next-intl";

export default function FormErrorMessage({
  message,
}: {
  message: string;
}) {
  const t = useTranslations("formValidation");
  
  return message && <p className="text-center text-destructive my-2">{t(message)}</p>;
}
