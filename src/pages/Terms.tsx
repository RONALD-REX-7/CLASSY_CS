import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { APP_NAME, APP_VERSION } from "@/lib/constants";
import { Link } from "react-router";

/**
 * Terms of Service — deliberately short and plain.
 *
 * Written for a free, local-first student utility: no corporation, no
 * liability theatre, no contact details we cannot honour. Wording matches the
 * implementation (verify results against your institution, no uptime promise,
 * data stays on the device).
 */

const LAST_UPDATED = "3 October 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Legal
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated {LAST_UPDATED} · applies to {APP_NAME} v{APP_VERSION}
        </p>

        <div className="surface mt-6 p-5">
          <h2 className="font-display text-sm font-bold">
            Plain-language summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {APP_NAME} is a free study tool. Use it to work out your GPA, CGPA,
            and admission-readiness estimates — then check anything important
            against your school, board, or university's official rules. It is
            provided as-is, with no guarantee of accuracy or availability, and
            it costs nothing.
          </p>
        </div>

        <Section title="1. What the calculator is for">
          <Bullets
            items={[
              "Calculating GPA, CGPA, and credit-weighted averages from the marks and grades you enter.",
              "Keeping a personal record of semesters, subjects, school results, and entrance-exam scores.",
              "Producing estimates for admission planning (eligibility checks, TNEA/JEE/NEET score conversions, and safe / target / reach classification of colleges).",
            ]}
          />
          <p>
            It is a convenience tool for your own planning. It is not an official
            academic record and it is not affiliated with, endorsed by, or
            operated by any board, university, or counselling authority.
          </p>
        </Section>

        <Section title="2. Verify important results yourself">
          <p>
            The grading logic follows the 10-point scale shown in the app (O =
            10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, U = 0, AB = 0 — the full
            scale is printed on the PDF report and on the calculator page). Your
            institution may use a different scale, weight credits differently,
            or apply rounding rules of its own. Where that is the case, its
            rules are the authoritative ones.
          </p>
          <p>
            The same applies to the admission tools: score conversions,
            eligibility cut-offs, and college classifications are{" "}
            <span className="font-medium text-foreground">
              estimates derived from the data you enter
            </span>
            . Cut-offs change every year, and a "safe / target / reach" label is
            a comparison against past data — never a guarantee of a seat.
            Always confirm with the official counselling authority.
          </p>
        </Section>

        <Section title="3. Responsible use">
          <Bullets
            items={[
              "Use it for your own academic planning, or for students you are responsible for.",
              "Enter accurate information — recommendations are only as good as the marks and scores you type in.",
              "Do not use the app to misrepresent results to any institution, employer, or third party.",
              "Do not attempt to break, overload, or misuse the site or the hosting it depends on.",
            ]}
          />
        </Section>

        <Section title="4. Your data is your responsibility">
          <p>
            Everything is stored in your browser, not on a server, which means:
          </p>
          <Bullets
            items={[
              "Clearing your browser data — or using a different browser, device, or private window — removes or hides your entries.",
              "There is no server-side backup and no account recovery. Export a JSON, CSV, or PDF copy if you need to keep your record.",
              "Keep your own copies of anything official. The app is not a records system.",
            ]}
          />
        </Section>

        <Section title="5. Availability">
          <p>
            The app is offered free of charge and as available. There is no
            uptime guarantee, no service-level commitment, and no promise that
            any feature will keep working or keep being offered. It may change
            or be discontinued without notice. Because it runs in your browser,
            whatever you have already entered keeps working offline in that
            browser even if the site is unavailable.
          </p>
        </Section>

        <Section title="6. No warranty; limits">
          <p>
            The app is provided "as is", without warranties of any kind —
            including accuracy, fitness for a particular purpose, or
            uninterrupted availability. To the extent permitted by law, the
            author is not liable for decisions made, opportunities lost, or
            damages arising from use of the app or from its output. Nothing here
            limits rights you may have that cannot legally be limited.
          </p>
        </Section>

        <Section title="7. Cost">
          <p>
            {APP_NAME} is free to use. There are no paid tiers, hidden charges,
            trials, subscriptions, or payment screens, and nothing is unlocked
            by paying. If that ever changes, pricing would be stated plainly
            before anything is charged.
          </p>
        </Section>

        <Section title="8. Ownership and open-source licences">
          <p>
            The app's own interface, written content, calculation logic, and
            branding belong to its author, © {new Date().getFullYear()} {APP_NAME}.
            You may use the app freely and keep the reports it generates for
            your own purposes.
          </p>
          <p>
            The app is built with open-source libraries that remain under their
            own licences — among them React, React Router, Vite, Tailwind CSS,
            Radix UI and shadcn/ui, lucide-react (ISC), Framer Motion (MIT),
            Sonner (MIT), next-themes (MIT), and jsPDF / jspdf-autotable (MIT).
            The Sora and Manrope typefaces are used under the SIL Open Font
            Licence 1.1. Those licences are not affected by these terms.
          </p>
          <p>
            Names such as TNEA, JEE, NEET, and individual college or university
            names are used descriptively to refer to examinations and
            institutions; no affiliation or endorsement is implied.
          </p>
        </Section>

        <Section title="9. Accessibility">
          <p>
            The interface is built to be keyboard-operable, with visible focus
            indicators, labelled controls, semantic structure, and support for
            the "reduce motion" setting. It has not been formally audited
            against WCAG by a third party, so if you hit a barrier, treat it as
            a bug in the app rather than a limitation of your setup.
          </p>
        </Section>

        <Section title="10. Who runs this site, and changes to these terms">
          <p>
            This is an independent, non-commercial student project — not a
            company, and there is no support team, registration number, or
            contact address to list. These terms may be updated as the app
            changes; the "last updated" date above will change with them.
            Continued use of the app after an update means you accept the
            revised terms.
          </p>
        </Section>

        <p className="mt-10 text-sm text-muted-foreground">
          See also:{" "}
          <Link
            to="/privacy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
