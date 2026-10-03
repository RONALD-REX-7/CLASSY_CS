import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { APP_NAME, APP_VERSION } from "@/lib/constants";
import { Link } from "react-router";

/**
 * Privacy Policy.
 *
 * Written against the real implementation — every claim here maps to code:
 *  · academic data lives in window.localStorage (see src/lib/constants.ts,
 *    src/lib/storage.ts, the *Planner pages and School.tsx)
 *  · there is no analytics, advertising, or error-tracking SDK
 *  · the only third-party requests are the Google Fonts stylesheet/font files
 * Do not add claims that the code does not support.
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

export default function Privacy() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
          Legal
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated {LAST_UPDATED} · applies to {APP_NAME} v{APP_VERSION}
        </p>

        {/* Plain-language summary first — the detail follows below. */}
        <div className="surface mt-6 p-5">
          <h2 className="font-display text-sm font-bold">The short version</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {APP_NAME} is a calculator that runs entirely in your browser. There
            are no accounts, no sign-up, and no server that receives your
            academic data. The subjects, marks, and scores you type are saved in
            your own browser's local storage on your own device, and they stay
            there until you clear them.
          </p>
        </div>

        <Section title="1. What is stored, and where">
          <p>
            Everything you enter is written to your browser's{" "}
            <span className="font-medium text-foreground">localStorage</span> —
            a small, per-site storage area on the device you are using. It is
            not sent to us or to any third party. The stored items are:
          </p>
          <Bullets
            items={[
              <>
                <span className="font-medium text-foreground">
                  Calculator data
                </span>{" "}
                — semester names, subject names, credits, grades, and the
                resulting GPA/CGPA (
                <code className="text-xs">classycs.semesters.v1</code>). A
                legacy single-semester key (
                <code className="text-xs">classycs.subjects.v1</code>) is read
                once to migrate older data.
              </>,
              <>
                <span className="font-medium text-foreground">
                  School records
                </span>{" "}
                — board, class, stream, and subject marks you enter in the
                School section (
                <code className="text-xs">classy.school.*</code>).
              </>,
              <>
                <span className="font-medium text-foreground">
                  Admission planner inputs
                </span>{" "}
                — exam scores, category, and college choice lists you type into
                the TNEA / JEE / NEET planners (
                <code className="text-xs">classy.admissions.*</code>), plus the
                module stores listed in{" "}
                <code className="text-xs">src/lib/storage.ts</code> (
                <code className="text-xs">classy.*</code>).
              </>,
              <>
                <span className="font-medium text-foreground">
                  Preferences
                </span>{" "}
                — your light/dark theme choice (
                <code className="text-xs">classycs-theme</code>) and whether
                demo data is switched on (
                <code className="text-xs">classy.demoMode</code>).
              </>,
            ]}
          />
          <p>
            An earlier version of the app offered an optional name field for PDF
            report headers (<code className="text-xs">classycs.profile.v1</code>
            ). It is not requested anywhere in the current app, and it is
            removed by the Reset button or by clearing site data.
          </p>
        </Section>

        <Section title="2. What is not collected">
          <Bullets
            items={[
              "No account, and no email address, phone number, or password is required to use any calculator.",
              "No academic data is uploaded to a server. Calculations run in your browser.",
              "No analytics, advertising, or behaviour-tracking scripts are loaded. There is no Google Analytics, no pixel, and no error-tracking SDK.",
              "We do not set cookies of our own, and we do not build a profile of you.",
              "No student ID, roll number, or identity documents are ever requested.",
            ]}
          />
          <p>
            Because no personal data reaches us, there is nothing on our side to
            sell, share, or leak.
          </p>
        </Section>

        <Section title="3. Third-party services that are actually used">
          <p>
            Two kinds of third parties are involved when you open the site, and
            both are described here in plain language:
          </p>
          <Bullets
            items={[
              <>
                <span className="font-medium text-foreground">
                  Google Fonts (typography)
                </span>{" "}
                — the two typefaces (Sora and Manrope) are loaded from{" "}
                <code className="text-xs">fonts.googleapis.com</code> and{" "}
                <code className="text-xs">fonts.gstatic.com</code>. As with any
                file fetched from another domain, Google receives your IP
                address and browser details when the font files are requested.
                Google's handling of that request is governed by Google's own
                privacy policy. No academic data is part of that request.
              </>,
              <>
                <span className="font-medium text-foreground">
                  The web host
                </span>{" "}
                — like every website, the server that delivers these files may
                keep standard access logs (IP address, time, requested URL).
                Those logs belong to the hosting provider and are outside the
                app's control.
              </>,
            ]}
          />
          <p>
            All other third-party code — React, React Router, Tailwind CSS,
            Radix UI, lucide-react, Framer Motion, Sonner, jsPDF, and the rest —
            is open-source library code bundled into the page and executed
            locally in your browser. Those libraries do not transmit your data.
            Licences are listed on the{" "}
            <Link
              to="/terms"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            page.
          </p>
        </Section>

        <Section title="4. Offline caching">
          <p>
            In a production build the app registers a service worker that caches
            its own files so the calculator keeps working without a network
            connection. That cache holds the app's code and your entries stay in
            localStorage as described above — no data is transmitted by it.
          </p>
        </Section>

        <Section title="5. Deleting your data">
          <p>
            Since everything is on your device, deletion is in your hands and
            takes effect immediately:
          </p>
          <Bullets
            items={[
              <>
                <span className="font-medium text-foreground">
                  Reset in the calculator
                </span>{" "}
                — the Reset button (with its confirmation dialog) clears all
                semesters and subjects, and removes any stored report name from
                older versions.
              </>,
              <>
                <span className="font-medium text-foreground">
                  Clear site data in your browser
                </span>{" "}
                — removing stored data/cookies for this site deletes every key
                listed in section 1 in one step.
              </>,
              <>
                <span className="font-medium text-foreground">
                  Uninstalling the app
                </span>{" "}
                — if you installed it as an app, uninstalling it removes its
                stored data too.
              </>,
            ]}
          />
          <p>
            There is no copy of your data on a server for us to delete, and
            there is no support address to send a request to — the deletion
            controls above are the complete process. Use the JSON or CSV export
            first if you want to keep a copy.
          </p>
        </Section>

        <Section title="6. Children and students">
          <p>
            The app is used by school and college students, including minors.
            Because it asks for no personal information and stores nothing on a
            server, there is no age gate and no parental-consent step. Academic
            entries stay on the device they were typed on.
          </p>
        </Section>

        <Section title="7. Who runs this site">
          <p>
            This is an independent, non-commercial student project. It is not
            operated by a registered company, there is no Data Protection
            Officer, and no business address or support team exists to list
            here. That is why this policy describes a self-service app instead
            of offering a contact channel it cannot honour.
          </p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            If a future version of the app adds a feature that stores or
            transmits different data — for example an account, a synced
            profile, or a third-party service — this page will be updated before
            or when that feature ships, and the "last updated" date above will
            change. Please re-read it if the app changes significantly.
          </p>
        </Section>

        <p className="mt-10 text-sm text-muted-foreground">
          See also:{" "}
          <Link
            to="/terms"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
