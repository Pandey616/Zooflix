import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="shell empty-state">
      <p className="eyebrow">A quiet clearing</p>
      <h1>That species wandered off.</h1>
      <p>We could not find the page you were looking for.</p>
      <Link className="button button-primary" href="/species">
        Return to the field guide
      </Link>
    </main>
  );
}
