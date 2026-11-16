import { PageHeader } from "../components/PageHeader";
import { company, fact } from "../content/company";
import { metaFor } from "../content/meta";

export const meta = () =>
  metaFor({
    title: "Privacy — Clean World Inc.",
    description: "What Clean World collects when you request a quote, why, who sees it and how long it is kept.",
    path: "/privacy",
  });

export default function Privacy() {
  const email = fact(company.email);
  const phone = fact(company.phone);
  const contact = email ? `email ${email}` : phone ? `call ${phone}` : "contact us through the details on your quotation";

  const sections = [
    ["What we collect", "The details you enter in a quote request: your name, phone number, email if you give one, organisation, neighbourhood and landmark, and what you ask us to do."],
    ["Why", "To contact you about your request and prepare a quotation."],
    ["Who sees it", "Clean World staff. Requests are stored with Cloudflare, and notification emails to our staff are sent through Resend. We do not sell your details or use them for advertising."],
    ["How long we keep it", "24 months, unless your request became a contract with us."],
    ["On your device", "An unfinished request is saved on your own device until you send it. We use no advertising cookies."],
    ["Your choices", `To have your details corrected or deleted, ${contact}.`],
  ];

  return (
    <>
      <PageHeader title="Privacy" lead="We collect only what we need to answer your quote request." />
      <dl className="wrap max-w-3xl space-y-8 py-12 md:py-16">
        {sections.map(([title, text]) => (
          <div key={title}>
            <dt className="font-display text-xl font-semibold">{title}</dt>
            <dd className="mt-2 text-muted">{text}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
