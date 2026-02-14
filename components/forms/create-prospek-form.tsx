"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { createProspek } from "@/server/prospek";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { KategoriProspek, TipePembayaran } from "@/lib/generated/prisma/enums";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const formSchema = z.object({
  nama_konsumen: z.string().min(3, "Nama minimal 3 karakter"),
  hp1: z.string().min(10, "Nomor HP wajib diisi"),
  hp2: z.string().optional(),
  kategori_prospek: z.enum(KategoriProspek, {
    message: "Pilih kategori prospek",
  }),
  tipe_pembayaran: z.enum(TipePembayaran, {
    message: "Pilih tipe pembayaran",
  }),
  alamat_konsumen: z.string(),
  modelId: z.string({ message: "Pilih model motor" }),
  warnaId: z.string({ message: "Pilih warna" }),
  subSumberId: z.string({ message: "Pilih sumber prospek" }),
  kelurahanId: z.string({ message: "Pilih kelurahan" }),
  tgl_perkiraan_beli: z.date(),
});

export type CreateProspekFormProps = {
  models?: Array<{ id: string; nama_model: string }>;
  warnas?: Array<{ id: string; warna: string }>;
  subSumberProspek?: Array<{ id: string; nama_subsumber: string }>;
  kelurahans?: Array<{ id: string; nama_kelurahan: string }>;
};

export function CreateProspekForm({
  className,
  models = [],
  warnas = [],
  subSumberProspek = [],
  kelurahans = [],
  ...props
}: React.ComponentProps<"form"> & CreateProspekFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_konsumen: "",
      hp1: "",
      hp2: "",
      kategori_prospek: undefined,
      tipe_pembayaran: undefined,
      alamat_konsumen: "",
      modelId: undefined,
      warnaId: undefined,
      kelurahanId: undefined,
      tgl_perkiraan_beli: undefined,
      subSumberId: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const result = await createProspek({
        nama_konsumen: data.nama_konsumen,
        hp1: data.hp1,
        hp2: data.hp2 || undefined,
        kategori_prospek: data.kategori_prospek,
        tipe_pembayaran: data.tipe_pembayaran,
        alamat_konsumen: data.alamat_konsumen || undefined,
        tgl_perkiraan_beli: data.tgl_perkiraan_beli
          ? new Date(data.tgl_perkiraan_beli)
          : undefined,
        kelurahan: {
          connect: { id: data.kelurahanId },
        },
        model: {
          connect: { id: data.modelId },
        },
        subSumber: {
          connect: { id: data.subSumberId },
        },
        warna: {
          connect: { id: data.warnaId },
        },
      });

      if (!result) {
        toast.error("Failed to create prospek");
        return;
      }

      toast.success("Prospek berhasil dibuat!");
      form.reset();
      // Refresh page to show new data
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="create-prospek-form"
      {...props}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col min-h-full", className)}
    >
      <div className="flex-1 space-y-4">
        <FieldGroup>
          <div className="space-y-3">
            <Controller
              name="nama_konsumen"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nama_konsumen">Nama</FieldLabel>
                  <Input
                    id="nama_konsumen"
                    type="text"
                    placeholder="Nama Konsumen"
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
              name="hp1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="hp1">Nomor HP</FieldLabel>
                  <Input
                    id="hp1"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
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
              name="hp2"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="hp2">Nomor HP 2 (Opsional)</FieldLabel>
                  <Input
                    id="hp2"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
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
              name="alamat_konsumen"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="alamat_konsumen">
                    Alamat Lengkap
                  </FieldLabel>
                  <Input
                    id="alamat_konsumen"
                    type="text"
                    placeholder="Alamat Lengkap"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="kategori_prospek"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="kategori_prospek">Kategori</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        field.onChange(val as KategoriProspek)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(KategoriProspek).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tipe_pembayaran"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tipe_pembayaran">
                      Tipe Pembayaran
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        field.onChange(val as TipePembayaran)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Tipe Pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {["CASH", "CREDIT"].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="subSumberId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subSumberId">Sumber Prospek</FieldLabel>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val)}
                    options={subSumberProspek.map((item) => ({
                      value: item.id.toString(),
                      label: item.nama_subsumber,
                    }))}
                    placeholder="Pilih sumber"
                    emptyText="Tidak ada sumber prospek"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="modelId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="modelId">Model Motor</FieldLabel>
                    <SearchableSelect
                      value={field.value?.toString()}
                      onValueChange={(val) => field.onChange(val)}
                      options={models.map((item) => ({
                        value: item.id.toString(),
                        label: item.nama_model,
                      }))}
                      placeholder="Pilih model motor"
                      emptyText="Tidak ada model motor"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="warnaId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="warnaId">Warna</FieldLabel>
                    <SearchableSelect
                      value={field.value?.toString()}
                      onValueChange={(val) => field.onChange(val)}
                      options={warnas.map((item) => ({
                        value: item.id.toString(),
                        label: item.warna,
                      }))}
                      placeholder="Pilih warna"
                      emptyText="Tidak ada warna"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="kelurahanId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="kelurahanId">Kelurahan</FieldLabel>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val)}
                    options={kelurahans.map((item) => ({
                      value: item.id.toString(),
                      label: item.nama_kelurahan,
                    }))}
                    placeholder="Pilih kelurahan"
                    emptyText="Tidak ada kelurahan"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="tgl_perkiraan_beli"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedDate = field.value
                  ? new Date(field.value)
                  : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tgl_perkiraan_beli">
                      Tanggal Perkiraan Beli (Opsional)
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "justify-start font-normal w-full",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pilih Tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (!date) {
                              field.onChange(undefined);
                              return;
                            }
                            field.onChange(date);
                          }}
                          defaultMonth={selectedDate}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </div>
        </FieldGroup>
      </div>

      <div className="sticky bottom-0 border-t bg-background py-4 -mx-4 px-4 mt-6 z-10">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader className="mr-2 animate-spin" /> : null}
          {loading ? "Memproses..." : "Buat Prospek"}
        </Button>
      </div>
    </form>
  );
}
