import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="px-5 mt-16">
      <div className="flex items-center justify-between mb-5">
        {/* <h1 className="text-6xl mt-16 font-bold tracking-tight gradient-title">
          This is Your Personal Finance World
        </h1> */}
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}