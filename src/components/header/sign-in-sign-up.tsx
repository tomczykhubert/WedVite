import React from "react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";

export default async function SignInSignUp() {
  const t = await getTranslations("user");
  const buttonSize = "lg";

  return (
    <>
      <Button asChild size={buttonSize} variant="outline">
        <Link href={routes.auth.signUp}>{t("signUp")}</Link>
      </Button>
      <Button asChild size={buttonSize}>
        <Link href={routes.auth.signIn}>{t("signIn")}</Link>
      </Button>
    </>
  );
}
