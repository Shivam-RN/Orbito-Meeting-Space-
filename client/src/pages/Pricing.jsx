import { PricingTable } from "@clerk/react";

const appearance = {
  variables: {
    colorPrimary: "#0ea5e9",
    borderRadius: "1rem",
    fontFamily: "inherit",
  },
  elements: {
    card: "shadow-xl border border-white/60 rounded-3xl",
  },
};

const Pricing = () => {
  return (
<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-8 px-4 pb-10 pt-10 sm:px-8 sm:pt-16">      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Upgrade your plan
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 sm:text-base">
          Choose the plan that's right for you and unlock all the features of Orbito.
        </p>
      </div>

      <div className="w-full">
        <PricingTable appearance={appearance} />
      </div>
    </div>
  );
};

export default Pricing;