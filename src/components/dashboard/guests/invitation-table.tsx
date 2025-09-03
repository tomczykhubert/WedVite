"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// --- Walidacja z Zod ---
const guestSchema = z.object({
  name: z.string().min(10, "Podaj imię gościa"),
  gender: z.enum(["male", "female"], { required_error: "Wybierz płeć" }),
});

const invitationSchema = z.object({
  invitationName: z.string().min(1, "Podaj nazwę zaproszenia"),
  guests: z.array(guestSchema).min(1, "Dodaj przynajmniej jednego gościa"),
});

type InvitationForm = z.infer<typeof invitationSchema>;

export default function AddInvitation() {
  const form = useForm<InvitationForm>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      invitationName: "",
      guests: [{ name: "", gender: "male" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  const onSubmit = (data: InvitationForm) => {
    console.log("✅ Zapisane zaproszenie:", data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Dodaj zaproszenie</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Nowe zaproszenie</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* Nazwa zaproszenia */}
            <FormField
              control={form.control}
              name="invitationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa zaproszenia</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Rodzina Kowalskich" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lista gości */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border p-3 rounded-lg space-y-3">
                  <FormField
                    control={form.control}
                    name={`guests.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię gościa {index + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="np. Jan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`guests.${index}.gender`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Płeć</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz płeć" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Mężczyzna</SelectItem>
                              <SelectItem value="female">Kobieta</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Usuń
                  </Button>
                </div>
              ))}
            </div>

            {/* Dodawanie gościa */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ name: "", gender: "male" })}
            >
              Dodaj gościa
            </Button>

            {/* Zapis */}
            <Button type="submit" className="w-full">
              Zapisz zaproszenie
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
