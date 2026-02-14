import { Prospek } from "@/server/prospek";

interface RowDetailProps {
  prospek: Prospek;
}

export default function RowDetail({ prospek }: RowDetailProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{prospek.nama_konsumen}</h3>
    </div>
  );
}
