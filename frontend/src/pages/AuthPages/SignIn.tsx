import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
<<<<<<< HEAD
        title="Sign In | Expenzoir"
        description="Sign in to Expenzoir to manage your expenses."
      />
      <AuthLayout subtitle="Welcome back. Sign in to manage your expenses.">
=======
        title="React.js SignIn Dashboard | Expenzoir - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for Expenzoir - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
>>>>>>> 3c63753f807681cadcf3218491ef96754b0a5fb3
        <SignInForm />
      </AuthLayout>
    </>
  );
}
