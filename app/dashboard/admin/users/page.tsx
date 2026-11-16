import { getUser } from "@/lib/api/user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserManagement from "./UserManagement";

const AdminUsersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  if (session?.user.accountType !== "admin") {
    redirect("/dashboard");
  }

  const result = await getUser();

//   console.log(result)
  // Extract the users array from the response object
  const users = Array.isArray(result)
    ? result
    : result?.users ?? [];

  return (

      <UserManagement users={users} />
    // <div>
    //     aa
    // </div>

  )


  
};

export default AdminUsersPage;