"use client";

import { useFormStatus } from "react-dom";
import { deleteWord } from "@/lib/actions/words";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-danger px-3 py-1.5 text-xs"
    >
      {pending ? "…" : "Supprimer"}
    </button>
  );
}

export function DeleteWordButton({ id, word }: { id: string; word: string }) {
  return (
    <form
      action={deleteWord.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm(`Supprimer définitivement le mot « ${word} » ?`)) {
          event.preventDefault();
        }
      }}
    >
      <DeleteButton />
    </form>
  );
}
