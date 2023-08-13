"use client";

import { apiFetch } from "@/libs/apiWrapper";
import { User } from "@/models/user";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await apiFetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (response.ok) {
        setUsers(await response.json());
      }
    };
    loadUsers();
  }, []);

  return (
    <>
      {users.map((i) => (
        <p key={i.id}>
          <Link href={`/users/${i.id}`}>{i.email}</Link>
        </p>
      ))}
    </>
  );
}
