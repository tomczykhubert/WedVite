"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  deserializeTranslationCall,
  isSerializedTranslationCall,
  translate,
} from "@/i18n/utils";
import { Input } from "./input";
import { FormFieldConfig } from "@/lib/forms/schemaTranslator";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import { PhoneInput } from "./phone-input";
import DateTimePicker from "./datetime-picker";
import DatePicker from "./date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { getAvailableLocales } from "@/i18n/routing";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  children,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && <span className="text-destructive">*</span>}
    </Label>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const t = useTranslations("formValidation");
  const { error, formMessageId } = useFormField();

  let translatedMessage;
  try {
    const message = error?.message || "";
    const isSerialized = isSerializedTranslationCall(message);
    if (isSerialized) {
      translatedMessage = deserializeTranslationCall(message, t);
    }
  } catch (e) {
    translatedMessage = error?.message || children;
  }
  const body = translatedMessage;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

function AutoFormField({
  control,
  fieldConfig,
}: {
  control: Control;
  fieldConfig: FormFieldConfig;
}) {
  const t = useTranslations();
  const translatedLabel = translate(fieldConfig.label, t);

  const inlineLabel = ["checkbox"].includes(fieldConfig.type)
  const ownFormControl = ["select"].includes(fieldConfig.type)

  const renderField = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (fieldConfig.type) {
      case "text":
      case "number":
      case "password":
      case "email":
        return (
          <Input
            type={fieldConfig.type}
            placeholder={translatedLabel}
            {...field}
          />
        );
      case "tel":
        return <PhoneInput {...field} />;
      case "textarea":
        return <Textarea placeholder={translatedLabel} {...field} />;
      case "datetime":
        return <DateTimePicker {...field} />;
      case "date":
        return <DatePicker {...field} />;
      case "checkbox":
        return (
          <Checkbox {...field} checked={field.value} onCheckedChange={field.onChange}/>
        );
      case "select":
        return <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={translatedLabel}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldConfig.values && fieldConfig.values.map((item, i) => (
                        <SelectItem key={item.value} value={item.value}>
                          {translate(item.name, t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>;
      default:
        throw Error(
          `Field type ${fieldConfig.type} is not supported in AutoFormField`
        );
    }
  };

  return (
    <FormField
      control={control}
      name={fieldConfig.name}
      render={({ field }) => (
        <FormItem>
          <div className={cn(inlineLabel && "flex flex-row-reverse justify-end gap-2")}>
          <FormLabel required={fieldConfig.required} className="mb-2">
            {translatedLabel}
          </FormLabel>
          { ownFormControl 
          ?
          <>{renderField(field)}</>
          :
          <FormControl>{renderField(field)}</FormControl>
          }
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}





export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  AutoFormField,
};
