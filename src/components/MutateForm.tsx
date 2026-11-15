"use client";

import { useQueryClient } from "@tanstack/react-query";

type Props = {
  action: (formData: FormData) => Promise<void>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  children: React.ReactNode;
};

/** Executa a Server Action e atualiza os dados em cache das telas. */
export function MutateForm({ action, onSubmit, className, children }: Props) {
  const queryClient = useQueryClient();

  return (
    <form
      className={className}
      onSubmit={onSubmit}
      action={async (formData) => {
        await action(formData);
        await queryClient.invalidateQueries();
      }}
    >
      {children}
    </form>
  );
}
