import AuthForm from "./AuthForm.jsx";
import AuthLayout from "./AuthLayout.jsx";

export default function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
