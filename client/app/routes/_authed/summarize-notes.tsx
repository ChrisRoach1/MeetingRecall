import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'redaxios'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

const formSchema = z.object({
  meetingNotes: z.string().min(10,{
    message: "notes must be at least 10 characters long"
  })
})

export const Route = createFileRoute('/_authed/summarize-notes')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient();
  const myContext = useRouteContext({from: '/_authed'})

  const summarizeMutation = useMutation({
    mutationFn: (notes: string) => axios.post('https://localhost:7193/api/meetingnotes', { notes }, {
      headers:{
        Authorization: `Bearer ${myContext.token}`
      }
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      meetingNotes: ""
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>){
    summarizeMutation.mutate(values.meetingNotes);
  }

  return (
    <div className="max-w-3xl mx-auto py-6 p-3">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Meeting Notes Summarizer</CardTitle>
          <CardDescription>Paste your meeting notes and get them summarized automatically.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {summarizeMutation.isError && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
              <p className="text-sm font-medium">Error processing your notes. Please try again.</p>
            </div>
          )}
          
          {summarizeMutation.isSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
              <p className="text-sm font-medium">Notes successfully summarized!</p>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="meetingNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Meeting Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste your meeting notes here..." 
                        className="min-h-[200px] resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center gap-2">
                <Button 
                  type="submit" 
                  className="px-6"
                  disabled={summarizeMutation.isPending}
                >
                  {summarizeMutation.isPending ? "Processing..." : "Summarize Notes"}
                </Button>
                
                {summarizeMutation.isPending && (
                  <Badge variant="secondary" className="animate-pulse">
                    Summarizing...
                  </Badge>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6 text-xs text-gray-500">
          <p>Powered by AI</p>
          <p>Your notes are securely processed</p>
        </CardFooter>
      </Card>
    </div>
  )
}
