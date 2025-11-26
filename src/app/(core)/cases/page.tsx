import { use } from "react";
import { listCasesServer } from "./services/case.server";
import CasesPageClient from "./components/cases-page-client";

const Page = () => {
  // HOOKS
  // Custom Hooks

  // React Hooks
  const casesPromise = listCasesServer();
  const cases = use(casesPromise);

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

  return <CasesPageClient initialCases={cases} />;
};

export default Page;
