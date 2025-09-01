"use client";
import FormErrorMessage from "@/components/form-error-messege";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AutoFormField, Form } from "@/components/ui/form";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { addEventConfig } from "@/schemas/eventFormConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuCalendarPlus2 } from "react-icons/lu";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object(translateSchemaConfig(addEventConfig));

type FormData = z.infer<typeof formSchema>;

export default function AddEventForm() {
  const baseT = useTranslations("base.forms");
  const t = useTranslations("dashboard.forms.event");
  const [isOpen, setOpen] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createEvent = useMutation(
    trpc.event.add.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.event.pathFilter());
      },
      onError: (err) => {
        toast.error(baseT("error"));
      },
    }),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setFormErrorMessage("");
    createEvent.mutate(data);
    setOpen(false);
  };

  const openChange = (open: boolean) => {
    setOpen(open)

    if(open)
      form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Card className="h-full min-h-[300px] text-gray-400 hover:bg-muted hover:text-current transition-all duration-200 cursor-pointer">
          <CardContent className="flex flex-col h-full justify-center items-center gap-4 font-bold">
            <LuCalendarPlus2 className="h-20 w-20" />
            <span>
              {t("add")}
            </span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogHeader>
              <DialogTitle>{t("add")}</DialogTitle>
              <DialogDescription>
                <FormErrorMessage message={formErrorMessage} />
              </DialogDescription>
            </AlertDialogHeader>
            {addEventConfig.map((fieldConfig) => (
              <AutoFormField
                key={fieldConfig.name}
                control={form.control}
                fieldConfig={fieldConfig}
              />
            ))}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{baseT("cancel")}</Button>
              </DialogClose>
              <Button type="submit">{baseT("submit")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
