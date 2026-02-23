"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  PawPrint,
  Dog,
  CalendarDays,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const AVAILABLE_HOURS = ["09:00", "11:30", "14:00", "16:30"]
const WEBHOOK_URL =
  "https://hook.eu1.make.com/9yxlvnpcj6y2he1yi94455hezy3aht8k"

interface FormData {
  dogName: string
  dogSize: string
  date: Date | undefined
  time: string
  phone: string
  email: string
  message: string
}

export function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    dogName: "",
    dogSize: "",
    date: undefined,
    time: "",
    phone: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isFormValid =
    formData.dogName.trim() !== "" &&
    formData.dogSize !== "" &&
    formData.date !== undefined &&
    formData.time !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid || isSubmitting || isSubmitted) return

    setIsSubmitting(true)

    const payload = {
      dogName: formData.dogName,
      dogSize: formData.dogSize,
      date: formData.date ? format(formData.date, "yyyy-MM-dd") : "",
      time: formData.time,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      })
      setIsSubmitted(true)
    } catch {
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#acc18a]/20">
            <PawPrint className="h-8 w-8 text-[#acc18a]" strokeWidth={2} />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            AI Groomer
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Zarezerwuj wizyt&#x119; dla swojego pupila
          </p>
        </header>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8"
        >
          <fieldset disabled={isSubmitted} className="space-y-8">
            {/* Dog Info Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Dog className="h-4 w-4" />
                <span>Informacje o psie</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dogName">Imi&#x119; psa</Label>
                  <Input
                    id="dogName"
                    placeholder="np. Burek"
                    value={formData.dogName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dogName: e.target.value,
                      }))
                    }
                    className="rounded-xl border-border/80 bg-background focus-visible:border-[#acc18a] focus-visible:ring-[#acc18a]/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dogSize">Rozmiar psa</Label>
                  <Select
                    value={formData.dogSize}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, dogSize: value }))
                    }
                    required
                  >
                    <SelectTrigger
                      id="dogSize"
                      className="w-full rounded-xl border-border/80 bg-background focus-visible:border-[#acc18a] focus-visible:ring-[#acc18a]/30"
                    >
                      <SelectValue placeholder="Wybierz rozmiar" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="small">
                        {"Ma\u0142y (do 10kg)"}
                      </SelectItem>
                      <SelectItem value="large">
                        {"Du\u017cy (powy\u017cej 10kg)"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Scheduling Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Termin wizyty</span>
              </div>

              <div className="flex justify-center">
                <div className="rounded-2xl border border-border/60 bg-background p-1">
                  {mounted ? (
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: date ?? undefined,
                          time: "",
                        }))
                      }
                      locale={pl}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date.getDay() === 0
                      }}
                      className="rounded-2xl"
                    />
                  ) : (
                    <div className="flex h-[304px] w-[280px] items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#acc18a] border-t-transparent" />
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              {formData.date && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {"Dost\u0119pne godziny \u2014 "}
                      {format(formData.date, "d MMMM yyyy", { locale: pl })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {AVAILABLE_HOURS.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, time: hour }))
                        }
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                          formData.time === hour
                            ? "border-[#acc18a] bg-[#acc18a] text-[#2c2c24] shadow-sm"
                            : "border-border/80 bg-background text-foreground hover:border-[#acc18a]/60 hover:bg-[#acc18a]/10"
                        )}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Contact Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Dane kontaktowe</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48 000 000 000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="rounded-xl border-border/80 bg-background focus-visible:border-[#acc18a] focus-visible:ring-[#acc18a]/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="rounded-xl border-border/80 bg-background focus-visible:border-[#acc18a] focus-visible:ring-[#acc18a]/30"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Message Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Opis us&#x142;ugi</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Opis us&#x142;ugi</Label>
                <Textarea
                  id="message"
                  placeholder="Opisz jakiej us&#x142;ugi potrzebujesz, np. strzy&#x17C;enie, k&#x105;piel, trymowanie..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="rounded-xl border-border/80 bg-background focus-visible:border-[#acc18a] focus-visible:ring-[#acc18a]/30"
                />
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || isSubmitted}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold transition-all",
                isSubmitted
                  ? "cursor-default bg-[#acc18a]/60 text-[#2c2c24]/70"
                  : isFormValid && !isSubmitting
                    ? "bg-[#acc18a] text-[#2c2c24] shadow-sm hover:bg-[#9db47a] active:scale-[0.98]"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Wysy&#x142;anie...</span>
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{"Wys\u0142ano pro\u015Bb\u0119 o potwierdzenie"}</span>
                </>
              ) : (
                <>
                  <PawPrint className="h-5 w-5" />
                  <span>Zarezerwuj wizyt&#x119;</span>
                </>
              )}
            </button>
          </fieldset>

          {/* Success Alert */}
          {isSubmitted && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-[#acc18a]/40 bg-[#acc18a]/10 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7a9a52]" />
              <p className="text-sm leading-relaxed text-foreground">
                {"Dzi\u0119kujemy! Po potwierdzeniu godziny przez groomera otrzymasz e-mail z potwierdzeniem."}
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {"AI Groomer \u00A9 2026 \u2014 Profesjonalna piel\u0119gnacja Twojego pupila"}
        </p>
      </div>
    </div>
  )
}
