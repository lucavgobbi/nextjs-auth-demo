"use client";

import authService, { AuthenticationResultStatus } from "@/libs/authService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticationPage({
  params,
}: {
  params: { operation: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      const url = window.location.href;
      const authResult = await authService.completeSignIn(url);
      switch (authResult.status) {
        case AuthenticationResultStatus.Success:
          const params = new URLSearchParams(window.location.search);
          const fromQuery = params.get("returnUrl");
          const state = (authResult as any).state;
          router.push((state && state.returnUrl) || fromQuery || "/home");
          break;
        default:
          throw new Error(
            `Invalid authentication result status '${authResult.status}'.`
          );
      }
    };
    if (params.operation === "login-callback") {
      completeSignIn();
    }
  }, [params.operation, router]);

  return <>{params.operation === "login-callback" && "Please wait..."}</>;
}
