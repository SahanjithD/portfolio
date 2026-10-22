"use client"

import { useRef, useState } from "react"
import emailjs from "@emailjs/browser"
import { profile } from "@/lib/content"

type Status = "idle" | "sending" | "sent" | "failed"

const field =
  "w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-graphite/70 transition-[border-color] duration-150 focus:border-signal focus:outline-none"

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>("idle")

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    if (!formRef.current || !serviceId || !templateId || !publicKey) return setStatus("failed")

    setStatus("sending")
    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, { publicKey })
      formRef.current.reset()
      setStatus("sent")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-sm text-graphite">Name</span>
          <input name="from_name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm text-graphite">Email</span>
          <input name="from_email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-sm text-graphite">Subject</span>
        <input name="subject" required placeholder="A role, a project, a question" className={field} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm text-graphite">Message</span>
        <textarea name="message" required rows={5} className={`${field} resize-y`} />
      </label>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p aria-live="polite" className="text-sm">
          {status === "sent" && <span className="text-signal-ink">Message sent. I usually reply within a day.</span>}
          {status === "failed" && (
            <span className="text-[#b4321f] dark:text-[#ff8a75]">
              The message didn&apos;t go through. Try again, or email {profile.email} directly.
            </span>
          )}
        </p>
      </div>
    </form>
  )
}
