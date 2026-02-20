"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createFollowUp } from "@/server/prospek";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useRightSidebar } from "@/components/sidebar-context";

const formSchema = z.object({
  tanggal: z.date({
    error: "Tanggal wajib dipilih",
  }),
  catatan: z.string().optional(),
  status: z.enum(["BARU", "FOLLOW_UP", "PENGAJUAN_LEASING", "DEAL", "SPK", "GUGUR"], {
    message: "Pilih status follow-up",
  }),
});

export type CreateFollowUpFormProps = {
  prospekId: string;
};

export function CreateFollowUpForm({ prospekId }: CreateFollowUpFormProps) {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useRightSidebar();
  const [firstFocusableEl, setFirstFocusableEl] = useState<HTMLButtonElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal: new Date(),
      catatan: "",
      status: "FOLLOW_UP",
    },
  });

  // Auto focus to first element when form mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      firstFocusableEl?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [firstFocusableEl]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await createFollowUp({
        prospekId,
        tanggal: data.tanggal,
        catatan: data.catatan || undefined,
        status: data.status,
      });

      toast.success("Follow-up berhasil dicatat!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="create-followup-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex h-full flex-col")}
    >
      <div className="flex-1 space-y-4 overflow-y-auto">
        <FieldGroup className="px-4 pt-4 pb-6">
          <div className="space-y-3">
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) =>
                      field.onChange(val as z.infer<typeof formSchema>["status"])
                    }
                  >
                    <SelectTrigger
                      ref={(el) => {
                        setFirstFocusableEl(el);
                        field.ref(el);
                      }}
                    >
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BARU">BARU</SelectItem>
                      <SelectItem value="FOLLOW_UP">FOLLOW_UP</SelectItem>
                      <SelectItem value="PENGAJUAN_LEASING">PENGAJUAN_LEASING</SelectItem>
                      <SelectItem value="DEAL">DEAL</SelectItem>
                      <SelectItem value="SPK">SPK</SelectItem>
                      <SelectItem value="GUGUR">GUGUR</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="tanggal"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedDate = field.value ? new Date(field.value) : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tanggal">Tanggal</FieldLabel>
                    <DatePicker
                      value={selectedDate}
                      onChange={(date) => field.onChange(date)}
                      placeholder="Pilih Tanggal"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />

            <Controller
              name="catatan"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="catatan">Catatan (Opsional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="catatan"
                    placeholder="Tambahkan catatan follow-up..."
                    rows={4}
                  />
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </div>

      <div className="bg-background shrink-0 border-t px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader className="mr-2 animate-spin" /> : null}
          {loading ? "Memproses..." : "Simpan Follow-Up"}
        </Button>
      </div>
    </form>
  );
}
