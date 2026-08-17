import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Landing from "./Landing";

export default function Signup() {
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("signup");
  }, [openAuthModal]);

  return <Landing />;
}
