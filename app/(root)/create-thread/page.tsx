import { fetchUser } from "@/lib/actions/user.actions";
import { getUser } from "@propelauth/nextjs/server/app-router";
import {redirect} from 'next/navigation';
import PostThread from '@/components/forms/PostThread';

async function Page() {
    const user = await getUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.userId)

    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
            <h1 className="head-text">Create Thread</h1>

            <PostThread userId={userInfo._id}/>
        </>
    )
}

export default Page;