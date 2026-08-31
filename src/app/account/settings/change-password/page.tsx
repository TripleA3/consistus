import { RequireAuth } from "@/components/auth/RequireAuth";
import { SecurityChangeFlow } from "@/components/account/SecurityChangeFlow";

export default function ChangePasswordPage() {
  return (
    <RequireAuth>
      <SecurityChangeFlow field="password" />
    </RequireAuth>
  );
}
