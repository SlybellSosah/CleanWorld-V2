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
      <PageHeader
        eyebrow="Data & privacy"
        title="Privacy"
        lead="We collect only what we need to answer your quote request."
      />
      <div className="wrap py-8 md:py-12">
        <dl className="bento-card max-w-3xl divide-y divide-line p-7 sm:p-10">
          {sections.map(([title, text]) => (
            <div key={title} className="py-5 first:pt-0 last:pb-0">
              <dt className="font-display text-xl font-bold">{title}</dt>
              <dd className="mt-2 text-muted">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
