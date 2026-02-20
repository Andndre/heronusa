"use client";

import { useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { useRightSidebar } from "@/components/sidebar-context";

export interface UseFormSubmissionOptions<T = object> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  closeDelay?: number; // Default: 500ms
  successMessage?: string; // Custom success message, set to empty string to disable toast
}

export function useFormSubmission<T = object>({
  onSubmit,
  onSuccess,
  onError,
  closeDelay = 500,
  successMessage = "Berhasil!",
}: UseFormSubmissionOptions<T>) {
  const { pushSidebar, popSidebar, markPendingSubmission, clearPendingSubmission } =
    useRightSidebar();
  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(
    async (data: T, formComponent: ReactNode, title: string, description: string) => {
      setIsLoading(true);

      // Generate a unique ID for this submission
      const submissionId = crypto.randomUUID();

      // Mark this submission as pending
      markPendingSubmission(submissionId);

      // Show loading toast immediately
      const toastId = toast.loading("Memproses...");

      // Close sidebar after delay
      const closeTimer = setTimeout(() => {
        popSidebar();
      }, closeDelay);

      try {
        await onSubmit(data);

        // Success - don't reopen sidebar
        clearTimeout(closeTimer);

        // Only show success toast if message is provided (non-empty)
        if (successMessage !== "") {
          toast.success(successMessage, { id: toastId });
        } else {
          // Just dismiss the loading toast
          toast.dismiss(toastId);
        }

        clearPendingSubmission(submissionId);
        onSuccess?.();
      } catch (error) {
        // Error - reopen sidebar with preserved form
        clearTimeout(closeTimer);
        toast.error(error instanceof Error ? error.message : "Terjadi kesalahan", { id: toastId });

        // Push new sidebar with error form (stacked - this is the ONLY case for stacking)
        pushSidebar({
          title,
          description,
          content: formComponent,
        });

        clearPendingSubmission(submissionId);
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      onSubmit,
      onSuccess,
      onError,
      closeDelay,
      pushSidebar,
      popSidebar,
      markPendingSubmission,
      clearPendingSubmission,
      successMessage,
    ]
  );

  return { submit, isLoading };
}
