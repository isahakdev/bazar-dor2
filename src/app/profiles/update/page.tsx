
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession, authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("নাম ১০০ অক্ষরের মধ্যে লিখুন");
      return;
    }

    setIsSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "তথ্য আপডেট করা যায়নি"
        );
        return;
      }

      toast.success("আপনার নাম আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">লগইন প্রয়োজন</h1>
        <p>তথ্য আপডেট করতে প্রথমে লগইন করুন।</p>

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
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">
          তথ্য আপডেট
        </h1>

        <p className="mb-6 text-gray-500">
          আপনার প্রোফাইলের নাম পরিবর্তন করুন।
        </p>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-medium"
            >
              আপনার নাম
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={session.user.name || "আপনার নাম লিখুন"}
              required
              maxLength={100}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-green-600 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>

          <Link
            href="/profile"
            className="block text-center text-sm text-gray-500 hover:underline"
          >
            প্রোফাইলে ফিরে যান
          </Link>
        </form>
      </div>
    </main>
  );
}
