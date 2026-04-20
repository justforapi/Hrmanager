import { AdminLoginForm } from "@/components/forms/AdminLoginForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center main-background p-4">
      <Card className="w-full max-w-md rounded-2xl border-gray-200/80 bg-white/60 shadow-lg backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Access
          </CardTitle>
          <CardDescription className="pt-2">
            Enter the password to manage jobs and applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <AdminLoginForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
