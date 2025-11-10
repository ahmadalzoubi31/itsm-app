// redirect to /iam/groups
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/iam/groups");
}
