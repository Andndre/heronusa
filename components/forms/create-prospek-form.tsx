"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  createProspek,
  searchKelurahans,
  searchModels,
  searchSubSumberProspek,
  searchWarnas,
} from "@/server/prospek";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { KategoriProspek, TipePembayaran } from "@/lib/generated/prisma/enums";
import { DatePicker } from "@/components/ui/date-picker";
import { createSearchHandler, toOptions } from "@/lib/search-utils";
import { useFormSubmission } from "@/hooks/use-form-submission";

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
  alamat_konsumen: z.string().optional(),
  modelId: z.string({ message: "Pilih model motor" }),
  warnaId: z.string({ message: "Pilih warna" }),
  subSumberId: z.string({ message: "Pilih sumber prospek" }),
  kelurahanId: z.string({ message: "Pilih kelurahan" }),
  tgl_perkiraan_beli: z.date(),
});

export type CreateProspekFormProps = {
  initialData?: Partial<z.infer<typeof formSchema>>;
  models?: Array<{ id: string; nama_model: string }>;
  warnas?: Array<{ id: string; warna: string }>;
  subSumberProspek?: Array<{ id: string; nama_subsumber: string }>;
  kelurahans?: Array<{ id: string; nama_kelurahan: string }>;
  onSuccess?: () => void; // Callback for data refresh
};

export function CreateProspekForm({
  className,
  initialData,
  models: initialModels = [],
  warnas: initialWarnas = [],
  subSumberProspek: initialSubSumbers = [],
  kelurahans: initialKelurahans = [],
  onSuccess,
  ...props
}: React.ComponentProps<"form"> & CreateProspekFormProps) {
  const [firstInputEl, setFirstInputEl] = useState<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_konsumen: initialData?.nama_konsumen || "",
      hp1: initialData?.hp1 || "",
      hp2: initialData?.hp2 || "",
      kategori_prospek: initialData?.kategori_prospek,
      tipe_pembayaran: initialData?.tipe_pembayaran,
      alamat_konsumen: initialData?.alamat_konsumen || "",
      modelId: initialData?.modelId,
      warnaId: initialData?.warnaId,
      kelurahanId: initialData?.kelurahanId,
      tgl_perkiraan_beli: initialData?.tgl_perkiraan_beli,
      subSumberId: initialData?.subSumberId,
    },
  });

  const { submit, isLoading } = useFormSubmission<z.infer<typeof formSchema>>({
    onSubmit: async (data) => {
      const result = await createProspek({
        nama_konsumen: data.nama_konsumen,
        hp1: data.hp1,
        hp2: data.hp2 || undefined,
        kategori_prospek: data.kategori_prospek,
        tipe_pembayaran: data.tipe_pembayaran,
        alamat_konsumen: data.alamat_konsumen || undefined,
        tgl_perkiraan_beli: data.tgl_perkiraan_beli ? new Date(data.tgl_perkiraan_beli) : undefined,
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
        throw new Error("Gagal membuat prospek");
      }
    },
    onSuccess: () => {
      form.reset();
      onSuccess?.(); // Call parent's success callback for data refresh
    },
    successMessage: "Prospek berhasil dibuat!",
  });

  // Auto focus to first input when form mounts
  useEffect(() => {
    // Small delay to ensure the sidebar animation is complete
    const timer = setTimeout(() => {
      firstInputEl?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [firstInputEl]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await submit(
      data,
      <CreateProspekForm
        className={className}
        initialData={initialData}
        models={initialModels}
        warnas={initialWarnas}
        subSumberProspek={initialSubSumbers}
        kelurahans={initialKelurahans}
        {...props}
      />,
      "Tambah Prospek",
      "Isi form untuk menambahkan prospek baru."
    );
  };

  return (
    <form
      id="create-prospek-form"
      {...props}
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("flex h-full flex-col", className)}
    >
      <div className="-mx-4 flex-1 space-y-4 overflow-y-auto px-4">
        <FieldGroup>
          <div className="space-y-3 pb-6">
            <Controller
              name="nama_konsumen"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nama_konsumen">Nama</FieldLabel>
                  <Input
                    {...field}
                    ref={(el) => {
                      setFirstInputEl(el);
                      field.ref(el);
                    }}
                    id="nama_konsumen"
                    type="text"
                    placeholder="Nama Konsumen"
                    required
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="alamat_konsumen"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="alamat_konsumen">Alamat Lengkap</FieldLabel>
                  <Input
                    id="alamat_konsumen"
                    type="text"
                    placeholder="Alamat Lengkap"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="kategori_prospek"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="kategori_prospek">Kategori</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val as KategoriProspek)}
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="tipe_pembayaran"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tipe_pembayaran">Tipe Pembayaran</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val as TipePembayaran)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Tipe Pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TipePembayaran).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="subSumberId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subSumberId">Sumber Prospek</FieldLabel>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val)}
                    onSearch={createSearchHandler(searchSubSumberProspek, "nama_subsumber")}
                    options={toOptions(initialSubSumbers, "nama_subsumber")}
                    placeholder="Pilih sumber"
                    emptyText="Tidak ada sumber prospek"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="modelId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="modelId">Model Motor</FieldLabel>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val)}
                    onSearch={createSearchHandler(searchModels, "nama_model")}
                    options={toOptions(initialModels, "nama_model")}
                    placeholder="Pilih model motor"
                    emptyText="Tidak ada model motor"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                    onSearch={createSearchHandler(searchWarnas, "warna")}
                    options={toOptions(initialWarnas, "warna")}
                    placeholder="Pilih warna"
                    emptyText="Tidak ada warna"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="kelurahanId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="kelurahanId">Kelurahan</FieldLabel>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val)}
                    onSearch={createSearchHandler(searchKelurahans, "nama_kelurahan")}
                    options={toOptions(initialKelurahans, "nama_kelurahan")}
                    placeholder="Pilih kelurahan"
                    emptyText="Tidak ada kelurahan"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="tgl_perkiraan_beli"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedDate = field.value ? new Date(field.value) : undefined;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tgl_perkiraan_beli">
                      Tanggal Perkiraan Beli (Opsional)
                    </FieldLabel>

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
          </div>
        </FieldGroup>
      </div>

      <div className="bg-background shrink-0 border-t px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader className="mr-2 animate-spin" /> : null}
          {isLoading ? "Memproses..." : "Buat Prospek"}
        </Button>
      </div>
    </form>
  );
}
