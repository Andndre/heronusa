import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="border-muted w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="bg-muted text-muted-foreground mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <FileQuestion className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">404</CardTitle>
          <CardTitle className="mt-2 text-xl font-semibold">Halaman Tidak Ditemukan</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-balance">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin URL salah ketik atau
            halaman telah dipindahkan.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full gap-2" size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-muted-foreground w-full gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Sebelumnya
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
