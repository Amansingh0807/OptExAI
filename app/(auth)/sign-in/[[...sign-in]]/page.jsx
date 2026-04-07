import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md",
          footerActionLink:
            "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
          socialButtonsBlockButton:
            "border border-emerald-500/40 hover:bg-emerald-500/10",
        },
      }}
    />
  );
}