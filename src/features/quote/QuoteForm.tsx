import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ButtonLink, buttonClass } from "../../components/Button";
import { company, fact } from "../../content/company";
import { neighbourhoodNames, neighbourhoods } from "../../content/neighbourhoods";
import { serviceBySlug, services, serviceTitle } from "../../content/services";
import { buildFallbackText, buildFollowUpText } from "../../lib/messages";
import { firstStepWithError, validateQuote, validateStep } from "../../lib/validate";
import { whatsappLink } from "../../lib/whatsapp";
import type { CustomerType, FieldErrors, Frequency, QuoteDraft, QuoteRequestInput, ServiceSlug } from "../../types";
import { clearDraft, emptyDraft, loadDraft, saveDraft } from "./draft";
import { Choice, Field } from "./Field";
import { submitQuote } from "./submit";
import { Turnstile, TURNSTILE_SITE_KEY, type TurnstileHandle } from "./Turnstile";

const STEP_TITLES = ["Who is this for?", "What do you need?", "Where is the site?", "How do we reach you?"];
const LAST = STEP_TITLES.length - 1;

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "one-time", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Every two weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "contract", label: "Ongoing contract" },
];

type Status = "editing" | "sending" | "failed" | { reference: string; customerType: CustomerType };

export function QuoteForm() {
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<QuoteDraft>(() => ({ step: 0, fields: { id: "" } }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("editing");
  const [ready, setReady] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const formEl = useRef<HTMLFormElement>(null);

  const whatsapp = fact(company.whatsapp);
  const f = draft.fields;
  const isOrg = f.customerType === "organisation";

  useEffect(() => {
    const start = loadDraft() ?? emptyDraft();
    const wanted = serviceBySlug(params.get("service") ?? undefined);
    if (wanted) start.fields.service = wanted.slug;
    setDraft(start);
    setReady(true);
    // The draft is read once; later query changes must not overwrite typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready && typeof status === "string") saveDraft(draft);
  }, [draft, ready, status]);

  const set = <K extends keyof QuoteRequestInput>(key: K, value: QuoteRequestInput[K]) => {
    setDraft((d) => ({ ...d, fields: { ...d.fields, [key]: value } }));
    setErrors((e) => {
      const { [key]: _removed, ...rest } = e;
      return rest;
    });
  };

  const goTo = (step: number) => {
    setDraft((d) => ({ ...d, step }));
    requestAnimationFrame(() => heading.current?.focus());
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => formEl.current?.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[aria-describedby] input')?.focus());

  const next = () => {
    const found = validateStep(draft.step, f, neighbourhoodNames);
    setErrors(found);
    if (Object.keys(found).length > 0) return focusFirstError();
    goTo(draft.step + 1);
  };

  const send = async () => {
    const checked = validateQuote(f, neighbourhoodNames);
    if (!checked.ok) {
      setErrors(checked.fields);
      const step = firstStepWithError(checked.fields);
      if (step >= 0 && step !== draft.step) goTo(step);
      return focusFirstError();
    }
    if (TURNSTILE_SITE_KEY && !turnstile.current?.token()) {
      if (turnstile.current?.unavailable()) return setStatus("failed");
      return setErrors({ turnstileToken: "Wait for the check below to finish, then send again." });
    }

    setStatus("sending");
    const result = await submitQuote({ ...checked.value, turnstileToken: turnstile.current?.token() });
    turnstile.current?.reset();

    if (result.kind === "sent") {
      clearDraft();
      setStatus({ reference: result.reference, customerType: checked.value.customerType });
      requestAnimationFrame(() => heading.current?.focus());
    } else if (result.kind === "invalid") {
      setStatus("editing");
      setErrors(result.fields);
      const step = firstStepWithError(result.fields);
      if (step >= 0) goTo(step);
    } else {
      setStatus("failed");
    }
  };

  if (typeof status === "object") {
    return <Confirmation reference={status.reference} customerType={status.customerType} whatsapp={whatsapp} headingRef={heading} />;
  }

  const fallbackHref =
    whatsapp && f.service && f.neighbourhood && f.name
      ? whatsappLink(whatsapp, buildFallbackText(f as Required<Pick<QuoteRequestInput, "customerType" | "service" | "neighbourhood" | "name" | "phone">>, serviceTitle(f.service)))
      : undefined;

  return (
    <form
      ref={formEl}
      noValidate
      aria-labelledby="quote-step-title"
      onSubmit={(e) => {
        e.preventDefault();
        if (draft.step < LAST) next();
        else void send();
      }}
    >
      <div className="flex items-center gap-4">
        <p className="shrink-0 font-medium text-muted">
          Step {draft.step + 1} of {STEP_TITLES.length}
        </p>
        <div
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={1}
          aria-valuemax={STEP_TITLES.length}
          aria-valuenow={draft.step + 1}
          className="h-2 flex-1 overflow-hidden rounded-full bg-line"
        >
          <m.div className="h-full bg-leaf" initial={false} animate={{ width: `${((draft.step + 1) / STEP_TITLES.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={draft.step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="mt-8 space-y-6"
        >
          <h2 id="quote-step-title" ref={heading} tabIndex={-1} className="text-2xl font-bold outline-none md:text-3xl">
            {STEP_TITLES[draft.step]}
          </h2>

          {draft.step === 0 && (
            <Choice<CustomerType>
              name="customerType"
              legend="Choose one"
              value={f.customerType}
              error={errors.customerType}
              onChange={(v) => set("customerType", v)}
              options={[
                { value: "organisation", label: "An organisation", hint: "NGO, UN agency, embassy, hotel, clinic or company" },
                { value: "household", label: "A household", hint: "Your home or family compound" },
              ]}
            />
          )}

          {draft.step === 1 && (
            <>
              <Field id="service" label="Service" error={errors.service}>
                {(p) => (
                  <select {...p} value={f.service ?? ""} onChange={(e) => set("service", e.target.value as ServiceSlug)}>
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field
                id="scope"
                label="Tell us about the job"
                hint="For example: number of rooms or offices, the pest problem, or how much waste."
                error={errors.scope}
                optional
              >
                {(p) => <textarea {...p} rows={4} maxLength={500} value={f.scope ?? ""} onChange={(e) => set("scope", e.target.value)} />}
              </Field>
              <Field id="frequency" label="How often" error={errors.frequency} optional>
                {(p) => (
                  <select {...p} value={f.frequency ?? ""} onChange={(e) => set("frequency", (e.target.value || undefined) as Frequency)}>
                    <option value="">Not sure yet</option>
                    {FREQUENCIES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </>
          )}

          {draft.step === 2 && (
            <>
              <Field id="neighbourhood" label="Neighbourhood" error={errors.neighbourhood}>
                {(p) => (
                  <select {...p} value={f.neighbourhood ?? ""} onChange={(e) => set("neighbourhood", e.target.value)}>
                    <option value="" disabled>
                      Choose a neighbourhood
                    </option>
                    {neighbourhoods.map((n) => (
                      <option key={n.name} value={n.name}>
                        {n.name}
                      </option>
                    ))}
                    <option value="Other">Other — not in this list</option>
                  </select>
                )}
              </Field>
              <Field
                id="landmark"
                label="Nearest landmark"
                hint="A road, building, school, church, mosque or market that helps us find you."
                error={errors.landmark}
                optional={f.neighbourhood !== "Other"}
              >
                {(p) => <input {...p} type="text" maxLength={200} value={f.landmark ?? ""} onChange={(e) => set("landmark", e.target.value)} />}
              </Field>
            </>
          )}

          {draft.step === 3 && (
            <>
              <Field id="name" label="Your name" error={errors.name}>
                {(p) => <input {...p} type="text" autoComplete="name" value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} />}
              </Field>
              <Field id="phone" label="Phone number" hint="We call or WhatsApp this number. Example: 0912 345 678" error={errors.phone}>
                {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" value={f.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />}
              </Field>
              {isOrg && (
                <>
                  <Field id="organisation" label="Organisation" error={errors.organisation}>
                    {(p) => (
                      <input {...p} type="text" autoComplete="organization" value={f.organisation ?? ""} onChange={(e) => set("organisation", e.target.value)} />
                    )}
                  </Field>
                  <Field id="email" label="Email" hint="We send the quotation here." error={errors.email} optional>
                    {(p) => <input {...p} type="email" autoComplete="email" value={f.email ?? ""} onChange={(e) => set("email", e.target.value)} />}
                  </Field>
                  <Field id="poReference" label="Purchase order or tender reference" error={errors.poReference} optional>
                    {(p) => <input {...p} type="text" maxLength={100} value={f.poReference ?? ""} onChange={(e) => set("poReference", e.target.value)} />}
                  </Field>
                </>
              )}
              <Turnstile ref={turnstile} />
              {errors.turnstileToken && <p className="font-medium text-alert">{errors.turnstileToken}</p>}
              <p className="text-sm text-muted">
                We use these details only to answer your request. See our{" "}
                <Link to="/privacy" className="link">
                  privacy page
                </Link>
                .
              </p>
            </>
          )}
        </m.div>
      </AnimatePresence>

      {status === "failed" && (
        <div role="alert" className="mt-8 rounded-lg border-2 border-alert bg-white p-5">
          <p className="font-semibold">We could not send your request.</p>
          <p className="mt-1 text-muted">Your details are still here. Check your connection and try again{fallbackHref ? ", or send the same details by WhatsApp" : ""}.</p>
          {fallbackHref && (
            <ButtonLink to={fallbackHref} tone="outline" className="mt-4">
              Send by WhatsApp instead
            </ButtonLink>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {draft.step > 0 && (
          <button type="button" className={buttonClass("outline")} onClick={() => goTo(draft.step - 1)} disabled={status === "sending"}>
            Back
          </button>
        )}
        <button type="submit" className={buttonClass("leaf")} disabled={status === "sending" || !ready}>
          {draft.step < LAST ? "Continue" : status === "sending" ? "Sending…" : status === "failed" ? "Try again" : "Send request"}
        </button>
      </div>
    </form>
  );
}

function Confirmation({
  reference,
  customerType,
  whatsapp,
  headingRef,
}: {
  reference: string;
  customerType: CustomerType;
  whatsapp: string | undefined;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const steps =
    customerType === "organisation"
      ? ["We call you to confirm the details and arrange a site visit.", "You receive a stamped quotation with our bank details and payment terms.", "You pay by bank transfer against our invoice."]
      : ["We call or WhatsApp you to confirm the details and the price.", "We agree a day and time for the work.", "You pay in cash or by mobile money when the work is done."];

  return (
    <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} aria-live="polite">
      <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold outline-none">
        Request sent
      </h2>
      <p className="mt-4 text-muted">Your reference is</p>
      <p className="mt-1 font-mono text-3xl font-semibold tracking-wide" data-testid="reference">
        {reference}
      </p>
      <h3 className="mt-8 text-xl font-semibold">What happens next</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        {whatsapp && <ButtonLink to={whatsappLink(whatsapp, buildFollowUpText(reference))}>Continue on WhatsApp</ButtonLink>}
        <ButtonLink to="/how-to-pay" tone="outline">
          How to pay
        </ButtonLink>
      </div>
    </m.div>
  );
}
