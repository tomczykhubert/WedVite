"use client";

import { signIn } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

export default function GoogleLogin({ setPending }: { setPending: React.Dispatch<React.SetStateAction<boolean>> }) {
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
      <FcGoogle className="mr-1" />
      {t("continueWithGoogle")}
    </Button>
  );
}
