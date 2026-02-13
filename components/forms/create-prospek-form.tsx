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
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { KategoriProspek, TipePembayaran } from "@/lib/generated/prisma/enums";

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
  modelId: z.number({ message: "Pilih model motor" }),
  warnaId: z.number({ message: "Pilih warna" }),
  subSumberId: z.number({ message: "Pilih sumber prospek" }),
  kelurahanId: z.number({ message: "Pilih kelurahan" }),
  tgl_perkiraan_beli: z.string(),
});

export type CreateProspekFormProps = {
  models?: Array<{ id: number; nama_model: string }>;
  warnas?: Array<{ id: number; warna: string }>;
  subSumberProspek?: Array<{ id: number; nama_subsumber: string }>;
  kelurahans?: Array<{ id: number; nama_kelurahan: string }>;
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
      tgl_perkiraan_beli: "",
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
      className={cn("w-full space-y-4", className)}
    >
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
                  <Combobox
                    items={Object.values(KategoriProspek)}
                    value={field.value?.toString() ?? null}
                    onValueChange={(val) =>
                      field.onChange(val as KategoriProspek)
                    }
                  >
                    <ComboboxInput placeholder="Pilih Kategori" />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {Object.values(KategoriProspek).map((item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
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
                  <Combobox
                    items={["CASH", "CREDIT"]}
                    value={field.value?.toString() ?? null}
                    onValueChange={(val) =>
                      field.onChange(val as TipePembayaran)
                    }
                  >
                    <ComboboxInput placeholder="Pilih Tipe Pembayaran" />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {["CASH", "CREDIT"].map((item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
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
                <Combobox
                  items={subSumberProspek}
                  value={field.value?.toString() ?? null}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <ComboboxInput placeholder="Pilih sumber" />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {subSumberProspek.map((item) => (
                        <ComboboxItem key={item.id} value={item.id.toString()}>
                          {item.nama_subsumber}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
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
                  <Combobox
                    items={models}
                    value={field.value?.toString() ?? null}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <ComboboxInput placeholder="Select a framework" />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {models.map((item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.id.toString()}
                          >
                            {item.nama_model}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
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
                  <Combobox
                    items={warnas}
                    value={field.value?.toString() ?? null}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <ComboboxInput placeholder="Pilih warna" />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {warnas.map((item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.id.toString()}
                          >
                            {item.warna}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
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
                <Combobox
                  items={kelurahans}
                  value={field.value?.toString() ?? null}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <ComboboxInput placeholder="Pilih kelurahan" />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {kelurahans.map((item) => (
                        <ComboboxItem key={item.id} value={item.id.toString()}>
                          {item.nama_kelurahan}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="tgl_perkiraan_beli"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tgl_perkiraan_beli">
                  Tanggal Perkiraan Beli (Opsional)
                </FieldLabel>
                <Input
                  id="tgl_perkiraan_beli"
                  type="date"
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

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? <Loader className="mr-2 animate-spin" /> : null}
        {loading ? "Memproses..." : "Buat Prospek"}
      </Button>
    </form>
  );
}
