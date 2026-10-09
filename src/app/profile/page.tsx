
"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/signin");
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">লগইন করুন</h1>
        <p>প্রোফাইল দেখতে আপনাকে লগইন করতে হবে।</p>

        <Link
          href="/signin"
          className="rounded-lg bg-green-600 px-5 py-3 text-white"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-16">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">আমার প্রোফাইল</h1>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500">নাম</p>
            <p className="font-medium">
              {session.user.name || "নাম দেওয়া নেই"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">ইমেইল</p>
            <p className="break-all font-medium">{session.user.email}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/profiles/update"
            className="rounded-lg bg-green-600 px-5 py-3 text-white"
          >
            তথ্য আপডেট
          </Link>

          <button
            onClick={handleSignOut}
            className="rounded-lg border px-5 py-3 hover:bg-gray-100"
          >
            সাইন আউট
          </button>
        </div>
      </div>
    </main>
  );
}