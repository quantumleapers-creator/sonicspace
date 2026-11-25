"use client";
import { CircleHelp } from "lucide-react";
import { useId, useState } from "react";

export default function InfoTip({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="info-tip-wrap">
      <button
        type="button"
        className="info-tip-trigger"
        aria-label={`Learn about ${title}`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(value => !value)}
      >
        <CircleHelp size={14} aria-hidden="true" />
      </button>
      {open && <span role="tooltip" id={id} className="info-tip-popover"><b>{title}</b>{children}</span>}
    </span>
  );
}
