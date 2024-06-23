import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
// import { getUser } from "@propelauth/nextjs/server/app-router";
import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";



export default async function Home() {
  const result = await fetchPosts(1, 30)
  const user = await getUserOrRedirect();

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
							currentUserId={user?.userId || ""}
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
