"use client";

import Link from "next/link";

export default function PublicRootPage() {
  return (
    <div>
      <h1>Public Page</h1>
      <p>
        Click <Link href="/users">here</Link> to navigate to a protected route,
        or type /users on your address bar.
      </p>
    </div>
  );
}
