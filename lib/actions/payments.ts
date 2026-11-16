const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");



export const paymentVarify = async (sessionId: string) => {

    const res = await fetch(`${apiUrl}/payment/checkout-verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({sessionId}),
    });

    const result =await res.json()



    return result;
};