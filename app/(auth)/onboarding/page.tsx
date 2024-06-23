import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { getUser } from "@propelauth/nextjs/server/app-router";
import {redirect} from "next/navigation";


async function Page() {
    const user = await getUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.userId)

    if(userInfo.onboarded) redirect('/')

    const userData = {
        id: user?.userId,
        objectId: userInfo?._id,
        username: userInfo ? userInfo?.username : user?.username,
        name: userInfo ? userInfo?.firstName : user?.firstName || "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user?.properties?.picture_url,
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">Complete your profile now to use Threads</p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle="continue"/>
            </section>
        </main>
    )
}

export default Page;