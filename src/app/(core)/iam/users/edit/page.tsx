// redirect to /iam/users
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/iam/users");
}
