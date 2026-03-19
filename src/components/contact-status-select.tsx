"use client";

import { useRef } from "react";
import { updateContactStatusAction } from "@/app/actions/contacts";

type ContactStatusSelectProps = {
  contactId: string;
  currentStatus: string;
};

export function ContactStatusSelect({
  contactId,
  currentStatus,
}: ContactStatusSelectProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateContactStatusAction}>
      <input type="hidden" name="contact_id" value={contactId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={() => formRef.current?.requestSubmit()}
        className="min-w-[140px] rounded-xl border border-[var(--line-strong)] bg-white/90 px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
      >
        <option value="subscribed">aktiv</option>
        <option value="pending">wartend</option>
        <option value="unsubscribed">abgemeldet</option>
        <option value="suppressed">gesperrt</option>
        <option value="bounced">gebounced</option>
      </select>
    </form>
  );
}
