

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");



export const isUserPremium = async (session_id: string) => {

    const res = await fetch(`${apiUrl}/premium-user/${session_id}`, {
        method: "GET",
    });

    const result =await res.json();

    return result;
};