import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { getUser } from "@propelauth/nextjs/server/app-router";
import { redirect } from "next/navigation";

const Page = async ({params}: {params: {id: string}}) => {
    if(!params.id) return null;

    const user = await getUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.userId)
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id)

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.userId || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            <div className="mt-7">
                <Comment 
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((childItem: any) => (
                    <ThreadCard
                    key={childItem._id}
                    id={childItem._id}
                    currentUserId={childItem?.userId || ""}
                    parentId={childItem.parentId}
                    content={childItem.text}
                    author={childItem.author}
                    community={childItem.community}
                    createdAt={childItem.createdAt}
                    comments={childItem.children}
                    isComment
                />
                ))}
            </div>
        </section>
    )
}

export default Page;