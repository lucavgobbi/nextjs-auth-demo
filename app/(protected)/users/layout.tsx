"use client";

export default function UsersLayout(props: {
  children: React.ReactNode;
  userDetails: React.ReactNode;
}) {
  return (
    <>
      <div className="m-5 bg-slate-100 rounded-xl p-8">{props.children}</div>
      <div className="m-5 bg-slate-100 rounded-xl p-8">{props.userDetails}</div>
    </>
  );
}
