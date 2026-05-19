import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up | Expenzoir"
        description="Create your Expenzoir account to start tracking expenses."
      />
      <AuthLayout subtitle="Create your account and start tracking with clarity.">
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
