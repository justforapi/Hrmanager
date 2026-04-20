import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ApplySuccessPage() {
  return (
    <div className="main-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-8 text-center shadow-sm backdrop-blur-lg sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Application Submitted!
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
            Thank you for your interest. We have received your application and
            will be in touch if your profile is a good match for the role.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Button asChild size="lg">
              <Link href="/careers">Explore Other Roles</Link>
            </Button>
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
