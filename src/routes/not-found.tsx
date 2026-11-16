import { ButtonLink } from "../components/Button";

export const meta = () => [{ title: "Page not found — Clean World Inc." }, { name: "robots", content: "noindex" }];

export default function NotFound() {
  return (
    <div className="wrap py-24">
      <h1 className="text-4xl font-bold md:text-5xl">Page not found</h1>
      <p className="prose-block mt-5 text-lg text-muted">
        This address does not match a page on our site. It may have moved when we rebuilt the website.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/">Go to the home page</ButtonLink>
        <ButtonLink to="/quote" tone="outline">
          Request a quote
        </ButtonLink>
      </div>
    </div>
  );
}
