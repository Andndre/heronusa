"use client";

import { useEffect, useState } from "react";
import { getProspekDetail, ProspekDetail } from "@/server/prospek";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  MapPin,
  Calendar,
  User,
  Building2,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  LucideIcon,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { id } from "date-fns/locale";
import { cn, formatCurrency } from "@/lib/utils";
import { STATUS_PROSPEK_VARIANTS, KATEGORI_PROSPEK_VARIANTS } from "@/lib/prospek-shared";

interface RowDetailProps {
  prospekId: string;
}

// Sub-components for better organization
function Section({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        {Icon && <Icon className="h-4 w-4" />}
        {title}
      </h3>
      <div className="space-y-2 pl-6 text-sm">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn("text-right font-medium", valueClassName)}>{value}</span>
    </div>
  );
}

// Helper function to format follow-up date
function formatFollowUpDate(date: Date | string): string {
  const followUpDate = typeof date === "string" ? new Date(date) : date;
  return isToday(followUpDate)
    ? format(followUpDate, "HH:mm", { locale: id })
    : format(followUpDate, "dd MMM yyyy", { locale: id });
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const LEASING_STATUS_CONFIG: Record<
  string,
  { icon: LucideIcon; label: string; variant: BadgeProps["variant"] }
> = {
  CAIR: { icon: CheckCircle2, label: "Cair", variant: "default" },
  PENDING: { icon: Clock, label: "Pending", variant: "outline" },
  DITOLAK: { icon: XCircle, label: "Ditolak", variant: "destructive" },
};

export default function RowDetail({ prospekId }: RowDetailProps) {
  const [prospek, setProspek] = useState<ProspekDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getProspekDetail(prospekId);
        setProspek(data);
      } catch (err) {
        console.error("Error fetching prospek detail:", err);
        setError(err instanceof Error ? err.message : "Failed to load prospek detail");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [prospekId]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !prospek) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="text-destructive mb-4 h-12 w-12" />
        <p className="text-muted-foreground">{error || "Prospek tidak ditemukan"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-1 pb-3">
      {/* HEADER */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">{prospek.nama_konsumen}</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant={STATUS_PROSPEK_VARIANTS[prospek.status] || "outline"}>
            {prospek.status}
          </Badge>
          <Badge variant={KATEGORI_PROSPEK_VARIANTS[prospek.kategori_prospek] || "outline"}>
            {prospek.kategori_prospek}
          </Badge>
          <Badge variant="outline">{prospek.tipe_pembayaran}</Badge>
        </div>
      </div>

      <Separator />

      {/* DATA KONSUMEN */}
      <Section title="Informasi Konsumen" icon={User}>
        <div className="flex items-start gap-3">
          <Phone className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">{prospek.hp1}</p>
            {prospek.hp2 && <p className="text-muted-foreground">{prospek.hp2}</p>}
          </div>
        </div>
        {prospek.alamat_konsumen && (
          <div className="flex items-start gap-3">
            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <p className="whitespace-pre-line">{prospek.alamat_konsumen}</p>
          </div>
        )}
      </Section>

      {/* PRODUK YANG DIMINATI */}
      <Section title="Produk yang Diminati">
        <InfoRow label="Model" value={prospek.model.nama_model} />
        <InfoRow label="Warna" value={prospek.warna.warna} />
        <InfoRow label="CC / Series" value={`${prospek.model.cc} CC / ${prospek.model.series}`} />
        <Separator className="my-2" />
        <InfoRow
          label="Harga OTR"
          value={formatCurrency(prospek.model.harga_otr)}
          valueClassName="text-lg font-semibold"
        />
      </Section>

      {/* LOKASI */}
      <Section title="Lokasi" icon={MapPin}>
        <InfoRow label="Kelurahan" value={prospek.kelurahan.nama_kelurahan} />
        <InfoRow label="Kecamatan" value={prospek.kelurahan.kecamatan.nama_kecamatan} />
        <InfoRow label="Kabupaten" value={prospek.kelurahan.kecamatan.kabupaten.nama_kabupaten} />
      </Section>

      {/* SALES & CABANG */}
      <Section title="Informasi Sales" icon={Building2}>
        <InfoRow label="Sales" value={prospek.sales.name} />
        <InfoRow label="Cabang" value={prospek.cabang.name} />
      </Section>

      {/* INFORMASI WAKTU */}
      <Section title="Informasi Waktu" icon={Calendar}>
        <InfoRow
          label="Dibuat pada"
          value={format(new Date(prospek.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
        />
        {prospek.tgl_perkiraan_beli && (
          <InfoRow
            label="Perkiraan Beli"
            value={format(new Date(prospek.tgl_perkiraan_beli), "dd MMM yyyy", { locale: id })}
          />
        )}
      </Section>

      {/* FOLLOW-UP HISTORY */}
      {prospek.followUps.length > 0 && (
        <Section title={`Riwayat Follow-Up (${prospek.followUps.length})`} icon={Clock}>
          <div className="space-y-6 pt-1">
            {prospek.followUps.map((followUp, index) => (
              <div key={followUp.id} className="flex gap-3">
                {/* Sales Avatar */}
                <div className="flex shrink-0 flex-col items-center">
                  <Avatar size="sm" className="bg-primary text-primary-foreground text-xs">
                    <AvatarFallback>{getInitials(followUp.sales.name)}</AvatarFallback>
                  </Avatar>
                  {/* Vertical line connector (not for last item) */}
                  {index < prospek.followUps.length - 1 && (
                    <div className="bg-border mt-2 w-px flex-1" />
                  )}
                </div>

                {/* Timeline Content */}
                <div className="flex-1 space-y-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatFollowUpDate(followUp.tanggal)}
                    </span>
                    <Badge
                      variant={STATUS_PROSPEK_VARIANTS[followUp.status] || "outline"}
                      className="text-xs"
                    >
                      {followUp.status}
                    </Badge>
                  </div>
                  {followUp.catatan && (
                    <p className="text-muted-foreground text-sm">{followUp.catatan}</p>
                  )}
                  <p className="text-muted-foreground mt-1 text-xs">oleh {followUp.sales.name}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* UANG TITIPAN */}
      {prospek.pembayarans.length > 0 && (
        <Section title={`Uang Titipan (${prospek.pembayarans.length})`} icon={CreditCard}>
          <div className="bg-muted mb-4 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total Titipan</span>
              <span className="text-lg font-bold">
                {formatCurrency(prospek.pembayarans.reduce((sum, p) => sum + p.jumlah, 0))}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {prospek.pembayarans.map((pembayaran) => (
              <div
                key={pembayaran.id}
                className="flex items-start justify-between border-b pb-3 text-sm last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{formatCurrency(pembayaran.jumlah)}</p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(pembayaran.createdAt), "dd MMM yyyy", { locale: id })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {pembayaran.jenis}
                  </Badge>
                  <p className="text-muted-foreground mt-1 text-xs">{pembayaran.metode}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* SPK */}
      {prospek.spk && (
        <Section
          title={`SPK: ${prospek.spk.nomorSPK}`}
          className="bg-muted/50 border-primary/20 rounded-lg border p-4"
        >
          <InfoRow
            label="Tanggal"
            value={format(new Date(prospek.spk.tanggal), "dd MMM yyyy", { locale: id })}
          />
          <InfoRow
            label="Total Tagihan"
            value={formatCurrency(prospek.spk.totalTagihan)}
            valueClassName="font-bold"
          />
          <InfoRow label="Total Dibayar" value={formatCurrency(prospek.spk.totalDibayar)} />
          {prospek.spk.diskonDisetujui && (
            <InfoRow
              label="Diskon"
              value={formatCurrency(prospek.spk.diskonDisetujui)}
              valueClassName="text-green-600"
            />
          )}
          <Separator className="my-2" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Approval</span>
            <div className="flex gap-2">
              {prospek.spk.spv_approval_status && (
                <Badge variant="outline" className="text-xs">
                  SPV: {prospek.spk.spv_approval_status}
                </Badge>
              )}
              {prospek.spk.manager_approval_status && (
                <Badge variant="outline" className="text-xs">
                  MGR: {prospek.spk.manager_approval_status}
                </Badge>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* LEASING */}
      {prospek.leasingOrder && (
        <Section title="Pengajuan Leasing" icon={CreditCard}>
          <InfoRow label="Leasing" value={prospek.leasingOrder.leasing.nama} />
          <InfoRow
            label="Jumlah Piutang"
            value={formatCurrency(prospek.leasingOrder.jumlahPiutang)}
            valueClassName="font-bold"
          />
          <InfoRow label="Nomor PO" value={prospek.leasingOrder.nomorPO} />
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <LeasingStatusBadge status={prospek.leasingOrder.statusCair} />
          </div>
          {prospek.leasingOrder.tanggalCair && (
            <InfoRow
              label="Tanggal Cair"
              value={format(new Date(prospek.leasingOrder.tanggalCair), "dd MMM yyyy", {
                locale: id,
              })}
            />
          )}
        </Section>
      )}
    </div>
  );
}

function LeasingStatusBadge({ status }: { status: string }) {
  const config = LEASING_STATUS_CONFIG[status] || {
    icon: AlertCircle,
    label: status,
    variant: "outline",
  };
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
