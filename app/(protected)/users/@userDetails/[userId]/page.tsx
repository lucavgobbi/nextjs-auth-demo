"use client";

import { apiFetch } from "@/libs/apiWrapper";
import { User } from "@/models/user";
import { useEffect, useState } from "react";

export default function UserDetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const loadUser = async (userId: string) => {
      const response = await apiFetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      if (response.ok) {
        setUser(await response.json());
      }
    };
    loadUser(params.userId);
  }, [params.userId]);

  return <>{user?.email}</>;
}
