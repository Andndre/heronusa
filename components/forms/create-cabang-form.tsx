"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});

export function CreateCabangForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const result = await authClient.organization.create({
        name: data.name,
        slug: data.slug,
      });

      if (result.error) {
        form.setError("name", result.error);
        toast.error(result.error.statusText);
        return;
      }

      toast.success("Cabang berhasil dibuat!");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Buat Cabang</CardTitle>
          <CardDescription>
            Masukkan detail untuk cabang baru Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-cabang-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="space-y-3">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Nama</FieldLabel>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nama Cabang"
                        required
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="slug">Slug</FieldLabel>
                      <Input
                        id="slug"
                        type="text"
                        placeholder="slug-cabang"
                        required
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="create-cabang-form"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader className="mr-2 animate-spin" /> : null}
            {loading ? "Membuat..." : "Buat"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
