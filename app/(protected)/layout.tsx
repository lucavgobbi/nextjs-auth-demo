"use client";

import Link from "next/link";
import authService from "@/libs/authService";

export default function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = authService.isAuthenticated;

  if (isAuthenticated) {
    return (
      <div>
        <div className="m-1 bg-slate-400 rounded-xl p-3">
          <Link href="/home">Home</Link> | <Link href="/users">Users</Link>
        </div>
        <div className="grid grid-flow-col auto-cols-max">{children}</div>
      </div>
    );
  }

  // The lines below will force the redirect to the login page if the user is not authenticated.
  const state = { returnUrl: window.location.href };
  authService.signIn({ state });

  return (
    <div>
      <h2>Please wait...</h2>
    </div>
  );
}
