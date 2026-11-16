import { headers } from "next/headers";
import { auth } from "../auth";


const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");



export const getUser = async () => {

    const users = await auth.api.listUsers({
    query: {

        sortBy: "name", // The field to sort by.
        sortDirection: "desc", // The direction to sort by.
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});

return users;
};



