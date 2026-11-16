

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

//user accountType update
export const updateUserRole = async(userId: string, accountType:string)=>{
    const res = await fetch(`${apiUrl}/update/user/${userId}`,{
        method: 'PATCH',
        headers:{
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({accountType}),
    });

    return res.json();
}

//role