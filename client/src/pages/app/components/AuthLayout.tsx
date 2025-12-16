import { Navigate } from "react-router-dom";

import LoadingBar from "@/components/LoadingBar";
import { useAuthHandler } from "@/hooks/useAuthChecker";

interface AuthProtectorProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthProtectorProps) => {
  const { isError, isPending } = useAuthHandler();

  if (isPending) return <LoadingBar />;
  if (isError) return <Navigate to="/" />;

  return <>{children}</>;
};

export default AuthLayout;
