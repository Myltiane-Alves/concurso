"use client";

import { useActionState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FormState } from "@/lib/form-state";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  className?: string;
  onSuccess?: () => void;
  children: React.ReactNode;
};

export function ActionForm({ action, submitLabel, className = "form", onSuccess, children }: Props) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const ref = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (state.success) {
      ref.current?.reset();
      queryClient.invalidateQueries();
      onSuccessRef.current?.();
    }
  }, [state, queryClient]);

  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
