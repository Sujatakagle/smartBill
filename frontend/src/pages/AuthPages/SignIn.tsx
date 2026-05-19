import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | Expenzoir"
        description="Sign in to Expenzoir to manage your expenses."
      />
      <AuthLayout subtitle="Welcome back. Sign in to manage your expenses.">
        <SignInForm />
      </AuthLayout>
    </>
  );
}
