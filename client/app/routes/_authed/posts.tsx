import { Link, Outlet, createFileRoute, useRouteContext } from '@tanstack/react-router'
import { fetchPosts } from '~/utils/posts.js'
import {
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from '@clerk/tanstack-start';
import { weatherQueryOptions } from '~/utils/posts-client';

export const Route = createFileRoute('/_authed/posts')({
  loader: () => fetchPosts(),
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData()
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()
  const myContext = useRouteContext({from: '/_authed'})

  console.log(myContext.token)

  const { data, error, isLoading } = useQuery(
    weatherQueryOptions(myContext.token!)
  );

  console.log(data)
  

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(
          (post) => {
            return (
              <li key={post.id} className="whitespace-nowrap">
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: post.id,
                  }}
                  className="block py-1 text-blue-800 hover:text-blue-600"
                  activeProps={{ className: 'text-black font-bold' }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            )
          },
        )}
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
