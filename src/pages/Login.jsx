import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Landing from "./Landing";

export default function Login() {
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("login");
  }, [openAuthModal]);

  return <Landing />;
}
