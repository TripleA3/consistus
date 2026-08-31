import { RequireAuth } from "@/components/auth/RequireAuth";
import { SecurityChangeFlow } from "@/components/account/SecurityChangeFlow";

export default function ChangeEmailPage() {
  return (
    <RequireAuth>
      <SecurityChangeFlow field="email" />
    </RequireAuth>
  );
}
