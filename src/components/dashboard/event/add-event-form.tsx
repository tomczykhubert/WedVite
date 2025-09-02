"use client";
import FormErrorMessage from "@/components/form-error-messege";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
  const validationT = useTranslations("formValidation.forms");
  const baseT = useTranslations("base.forms");
  const t = useTranslations("dashboard.forms.event");
  const [isOpen, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createEvent = useMutation(
    trpc.event.add.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.event.pathFilter());
      },
      onError: (err) => {
        toast.error(validationT("error"));
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      }
    }),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createEvent.mutate(data);
    setOpen(false);
  };

  const openChange = (open: boolean) => {
    setOpen(open)
    form.reset()
  }

  return (
    <>
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
        <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t("add")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
      <Loader isLoading={loading}/>
    </>
  );
}
