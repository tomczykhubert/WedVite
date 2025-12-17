"use client";

import { signIn } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";

export default function GoogleLogin({
  setPending,
}: {
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations("user");

  const handleGoogleSignIn = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: routes.dashboard.index,
      },
      {
        onResponse: () => {
          setPending(false);
        },
        onRequest: () => {
          setPending(true);
        },
      }
    );
  };

  return (
    <Button
      type="button"
      className="w-full my-4"
      variant={"outline"}
      onClick={handleGoogleSignIn}
    >
      <FaGoogle className="mr-1" />
      {t("continueWithGoogle")}
    </Button>
  );
}
