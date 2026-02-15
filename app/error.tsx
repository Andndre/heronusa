"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="border-destructive/20 w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 text-destructive mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Terjadi Kesalahan</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Maaf, sistem mengalami kendala saat memproses permintaan Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted max-h-32 overflow-auto rounded-lg p-4 font-mono text-sm">
            <p className="text-destructive mb-1 font-semibold underline">Error Details:</p>
            <p className="wrap-break-word">{error.message || "An unexpected error occurred."}</p>
            {error.digest && <p className="mt-2 text-xs opacity-70">ID: {error.digest}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={() => reset()} className="w-full gap-2" size="lg" aria-label="Coba Lagi">
            <RefreshCcw className="h-4 w-4" />
            Coba Lagi
          </Button>
          <Button asChild variant="outline" className="w-full gap-2" size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
