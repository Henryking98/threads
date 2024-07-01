import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home({searchParams}: {searchParams: { [key: string]: string | undefined }}) {
	const user = await currentUser();

	if (!user) return null;
	const userInfo = await fetchUser(user.id);
	
	if (!userInfo?.onboarded) redirect("/onboarding");
	
	const result = await fetchPosts( searchParams.page ? +searchParams.page : 1, 30 );

  return (
    <>
		<h1 className="head-text text-left">Home</h1>

		<section className="mt-9 flex flex-col gap-10">
			{result.posts.length === 0 ? (
				<p className="no-result">No threads found</p>
			): (
				<>
					{result.posts.map((post) => (
						<ThreadCard
							key={post._id}
							id={post._id}
							currentUserId={user?.id || ""}
							parentId={post.parentId}
							content={post.text}
							author={post.author}
							community={post.community}
							createdAt={post.createdAt}
							comments={post.children}
						/>
					))}
				</>
			)}
		</section>

		<Pagination
			path='/'
        	pageNumber={searchParams?.page ? +searchParams.page : 1}
        	isNext={result.isNext}
      	/>
    </>
  );
}
















// "use client";

// import {useUser, useRedirectFunctions, useLogoutFunction} from "@propelauth/nextjs/client";

// export default function Home() {
// 	const {loading, user} = useUser();
// 	const {redirectToSignupPage, redirectToLoginPage, redirectToAccountPage} = useRedirectFunctions();
// 	const logoutFn = useLogoutFunction();

// 	if(loading) return <div>Loading....</div>;

//   return (
//     <div className="head-text text-left text-white">
//       {user ? (
//         <div className="text-white">
//           <p>You are logged in as {user.email}</p>
//           <button onClick={() => redirectToAccountPage()}>Account</button>
//         </div>
//       ) : (
//         <div className="text-white">
//           <div className="text white">
//             <p>You are not logged in</p>
//             <button onClick={() => redirectToLoginPage()}>Login {" "}</button>
//             <button onClick={() => redirectToSignupPage()}>Signup {" "}</button>
//             <button onClick={logoutFn}>Logout</button>
//           </div>
//         </div>
//       )}
//       {/* <h1 className="head-text text-left">Home</h1> */}
//     </div>
//   );
// }
