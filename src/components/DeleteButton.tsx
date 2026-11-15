"use client";

import { Trash2 } from "lucide-react";
import { MutateForm } from "./MutateForm";

type Props = {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  message?: string;
};

export function DeleteButton({ action, fields, message = "Excluir este item?" }: Props) {
  return (
    <MutateForm
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="btn-icon" title="Excluir" aria-label="Excluir">
        <Trash2 size={16} />
      </button>
    </MutateForm>
  );
}
