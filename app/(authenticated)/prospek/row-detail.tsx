import { Prospek } from "@/server/prospek";

interface RowDetailProps {
  prospek: Prospek;
}

export default function RowDetail({ prospek }: RowDetailProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">{prospek.nama_konsumen}</h3>
    </div>
  );
}
