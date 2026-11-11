import { auth } from '@/lib/auth';

import { headers } from 'next/headers';
import React from 'react';


const ManageJobs = async() => {

    const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
});

// console.log(session?.user.email);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${session?.user.email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const jobs = await res.json();
    console.log(jobs);


    return (
        <div>
            manage jobs
        </div>
    );
};

export default ManageJobs;