import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { notesQueryOptions } from '~/utils/notes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

export const Route = createFileRoute('/_authed/notes')({
  component: NotesComponent,
})

function NotesComponent() {
  const posts = Route.useLoaderData()
  const myContext = useRouteContext({from: '/_authed'})

  const { data, error, isLoading } = useQuery(
    notesQueryOptions(myContext.token!, myContext.userId ?? "")
  );  

  return (
    <div className="max-w-4xl mx-auto py-6 p-3">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Meeting Notes</CardTitle>
          <CardDescription>View all your summarized meeting notes</CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="animate-pulse">
                Loading notes...
              </Badge>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
              <p className="text-sm font-medium">Error loading notes. Please try again.</p>
            </div>
          )}
          
          {data && data.length === 0 && (
            <div className="p-3 bg-gray-50 text-gray-800 rounded-md border border-gray-200">
              <p className="text-sm font-medium">No notes found. Create your first note!</p>
            </div>
          )}
          
          <div className="space-y-4">
            {data?.map((note) => (
              <Card key={note.id} className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {new Date(note.createdOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Badge>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{note.summarizedNotes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6 text-xs text-gray-500">
          <p>Total notes: {data?.length ?? 0}</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
