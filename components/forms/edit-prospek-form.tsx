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
import {
  updateProspek,
  searchKelurahans,
  searchModels,
  searchSubSumberProspek,
  searchWarnas,
  Prospek,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { createSearchHandler, toOptions } from "@/lib/search-utils";

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

export type EditProspekFormProps = {
  prospek: Prospek;
  models?: Array<{ id: string; nama_model: string }>;
  warnas?: Array<{ id: string; warna: string }>;
  subSumberProspek?: Array<{ id: string; nama_subsumber: string }>;
  kelurahans?: Array<{ id: string; nama_kelurahan: string }>;
};

export function EditProspekForm({
  className,
  prospek,
  models: initialModels = [],
  warnas: initialWarnas = [],
  subSumberProspek: initialSubSumbers = [],
  kelurahans: initialKelurahans = [],
  ...props
}: React.ComponentProps<"form"> & EditProspekFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_konsumen: prospek.nama_konsumen || "",
      hp1: prospek.hp1 || "",
      hp2: prospek.hp2 || "",
      kategori_prospek: prospek.kategori_prospek,
      tipe_pembayaran: prospek.tipe_pembayaran,
      alamat_konsumen: prospek.alamat_konsumen || "",
      modelId: prospek.modelId,
      warnaId: prospek.warnaId,
      kelurahanId: prospek.kelurahanId,
      tgl_perkiraan_beli: prospek.tgl_perkiraan_beli
        ? new Date(prospek.tgl_perkiraan_beli)
        : undefined,
      subSumberId: prospek.subSumberId,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const result = await updateProspek(prospek.id, {
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
        toast.error("Gagal memperbarui prospek");
        return;
      }

      toast.success("Prospek berhasil diperbarui!");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="edit-prospek-form"
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
                      {Object.values(TipePembayaran).map((item) => (
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
              name="subSumberId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subSumberId">Sumber Prospek</FieldLabel>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val)}
                    onSearch={createSearchHandler(
                      searchSubSumberProspek,
                      "nama_subsumber",
                    )}
                    options={toOptions(initialSubSumbers, "nama_subsumber")}
                    placeholder="Pilih sumber"
                    emptyText="Tidak ada sumber prospek"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    onSearch={createSearchHandler(searchWarnas, "warna")}
                    options={toOptions(initialWarnas, "warna")}
                    placeholder="Pilih warna"
                    emptyText="Tidak ada warna"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    onSearch={createSearchHandler(
                      searchKelurahans,
                      "nama_kelurahan",
                    )}
                    options={toOptions(initialKelurahans, "nama_kelurahan")}
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

      <div className="sticky bottom-0 border-t bg-background py-4 -mx-4 px-4 mt-6 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader className="mr-2 animate-spin" /> : null}
          {loading ? "Memproses..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
