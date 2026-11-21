import AuthForm from "./AuthForm.jsx";
import AuthLayout from "./AuthLayout.jsx";

export default function LoginPage() {
  return (
    <AuthLayout mode="login">
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
