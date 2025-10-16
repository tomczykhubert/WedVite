"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
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

import { Label } from "@/components/ui/label";
import {
  deserializeTranslationCall,
  isSerializedTranslationCall,
  translate,
} from "@/i18n/utils";
import { FormFieldConfig, FormSelectOption } from "@/lib/forms/schemaTranslator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Checkbox } from "./checkbox";
import { CountryPicker } from "./country-picker";
import DatePicker from "./date-picker";
import DateTimePicker from "./datetime-picker";
import { Input } from "./input";
import { PhoneInput } from "./phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";
import { ColorPicker, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerFormat, ColorPickerHue, ColorPickerOutput, ColorPickerSelection } from "./color-picker";
import { getAttendanceStatusIcon } from "../dashboard/guests/partials/attendance-status-icon";
import { AttendanceStatus, Gender, InvitationStatus } from "@prisma/client";
import { getInvitationStatusIcon } from "../dashboard/guests/partials/invitation-status-icon";
import { getGenderIcon } from "../dashboard/guests/partials/gender-icon";

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
  } catch {
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

function AutoFormField<TFieldValues extends FieldValues = FieldValues>({
  control,
  fieldConfig,
  name,
  valuesOverride
}: {
  control: Control<TFieldValues>;
  fieldConfig: FormFieldConfig;
  name?: FieldPath<TFieldValues>;
  valuesOverride?: FormSelectOption[];
}) {
  const t = useTranslations();
  const translatedLabel = translate(fieldConfig.label ?? "", t);

  const inlineLabel = ["checkbox"].includes(fieldConfig.type);
  const ownFormControl = ["select"].includes(fieldConfig.type);

  if (fieldConfig.type == "custom") return;

  const renderedValues = valuesOverride ?? fieldConfig.values?.map(item => {
    switch (fieldConfig.name) {
      case "attendanceStatus":
        return {
          ...item,
          label: (
            <div className="flex items-center gap-2">
              {getAttendanceStatusIcon(item.value as AttendanceStatus)} <span>{t(`dashboard.event.guests.status.${item.name}`)}</span>
            </div>
          ),
        };
      case "invitationStatus":
        return {
          ...item,
          label: (
            <div className="flex items-center gap-2">
              {getInvitationStatusIcon(item.value as InvitationStatus)} <span>{t(`dashboard.event.invitations.status.${item.name}`)}</span>
            </div>
          ),
        };
      case "gender":
        return {
          ...item,
          label: (
            <div className="flex items-center gap-2">
              {getGenderIcon(item.value as Gender)} <span>{t(`base.genderTypes.${item.name}`)}</span>
            </div>
          ),
        };
      default:
        return item; // fallback dla zwykłych selectów
    }
  });

  const renderField = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>
  ) => {
    switch (fieldConfig.type) {
      case "text":
      case "number":
      case "password":
      case "email":
      case "color":
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
          <Checkbox
            {...field}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        );
      case "select":
        return (
          <FormSelect<TFieldValues>
            {...field}
            fieldConfig={{
              ...fieldConfig,
              values: renderedValues,
            }}
            label={translatedLabel}
          />
        );
      case "country_select":
        return
      case "color":
        return (
          <ColorPicker className="max-w-sm rounded-md border bg-background p-4 shadow-sm">
            <ColorPickerSelection />
            <div className="flex items-center gap-4">
              <ColorPickerEyeDropper />
              <div className="grid w-full gap-1">
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerOutput />
              <ColorPickerFormat />
            </div>
          </ColorPicker>
        )
      case "custom":
        return <></>;
      case "hidden":
        return <input type="hidden" {...field} />;
      default:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _exhaustiveCheck: never = fieldConfig.type;
        throw Error(
          `Field type ${fieldConfig.type} is not supported in AutoFormField`
        );
    }
  };

  return (
    <FormField<TFieldValues>
      control={control}
      name={(name ? name : fieldConfig.name) as FieldPath<TFieldValues>}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              inlineLabel && "flex flex-row-reverse justify-end gap-2"
            )}
          >
            {translatedLabel && (
              <FormLabel required={fieldConfig.required} className="mb-2">
                {translatedLabel}
              </FormLabel>
            )}
            {ownFormControl ? (
              <>{renderField(field)}</>
            ) : (
              <FormControl>{renderField(field)}</FormControl>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  fieldConfig,
  label,
  ...field
}: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>> & {
  fieldConfig: FormFieldConfig;
  label?: string;
}) {
  const t = useTranslations();
  if (fieldConfig.needValues && !fieldConfig.values) {
    throw new Error("Select field must have values");
  }
  return (
    <Select
      onValueChange={(value) => field.onChange(value == "_null" ? null : value)}
      defaultValue={field.value}
    >
      <FormControl>
        <SelectTrigger className="w-full" data-size="auto">
          <SelectValue placeholder={label} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {!fieldConfig.required && (
          <SelectItem value="_null" className="opacity-50">
            {t("base.forms.selectNone")}
          </SelectItem>
        )}
        {fieldConfig.values &&
          fieldConfig.values.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label ?? translate(item.name ?? "", t)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

export {
  AutoFormField,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
