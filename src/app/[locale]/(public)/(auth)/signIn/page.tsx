"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  email: z.string().email({
    message: "user.validations.email.invalid",
  }),
  password: z.string().min(1, {
    message: "user.validations.password.required",
  }),
});

type SignInFormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const t = useTranslations("user");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.replace(routes.dashboard.index);
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: routes.dashboard.index,
    });
  };

  return (
    <div className="mt-5 max-w-[525px] mx-auto">
      <h1 className="text-center">{t('signIn')}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('email')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {t('signIn')}
          </Button>
        </form>
      </Form>

      <Button type="button" className="w-full my-2" variant={"outline"} onClick={handleGoogleSignIn}>
        <FcGoogle className="mr-1" />
        {t('continueWithGoogle')}
      </Button>

      <Button type="button" className="w-full my-2" variant={"outline"}>
        {t('signUp')}
      </Button>
    </div>
  );
}
