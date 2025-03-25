/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/tanstack-start'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { createServerFn } from '@tanstack/start'
import * as React from 'react'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary.js'
import { NotFound } from '~/components/NotFound.js'
import appCss from '~/styles/app.css?url'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu"
import { Button } from "~/components/ui/button"

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId, getToken } = await getAuth(getWebRequest()!)

  console.log(userId)
  var token = await getToken()

  return {
    userId,
    token
  }
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  beforeLoad: async () => {
    const { userId, token } = await fetchClerkAuth()

    return {
      userId,
      token
    }
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <ClerkProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ClerkProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="">
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 p-1">
            <NavigationMenu className="mx-6">
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <Link to="/" preload="intent">
                    <NavigationMenuLink
                      className="text-sm font-medium transition-colors hover:text-primary/80 text-foreground/60"
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <SignedIn>
                <NavigationMenuItem>
                  <Link to="/summarize-notes" preload="intent">
                    <NavigationMenuLink
                      className="text-sm font-medium transition-colors hover:text-primary/80 text-foreground/60"
                    >
                      Summarize
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/notes" preload="intent">
                    <NavigationMenuLink
                      className="text-sm font-medium transition-colors hover:text-primary/80 text-foreground/60"
                    >
                      Notes
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>                
                </SignedIn>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="ml-auto flex items-center space-x-4">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </header>
        <main className="">
          {children}
        </main>
        <footer className="border-t bg-background mt-32">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="grid md:grid-cols-4 gap-8 text-sm text-muted-foreground mb-8">
            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Product</div>
              <div>Features</div>
              <div>Pricing</div>
              <div>Security</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Company</div>
              <div>About</div>
              <div>Blog</div>
              <div>Careers</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Legal</div>
              <div>Privacy</div>
              <div>Terms</div>
              <div>Cookie Policy</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-slate-900">Contact</div>
              <div>Support</div>
              <div>Twitter</div>
              <div>LinkedIn</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Meeting Recall. All rights reserved.
          </div>
        </div>
      </footer>
      
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />

        <Scripts />
      </body>
    </html>
  )
}
