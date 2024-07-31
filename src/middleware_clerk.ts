import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

// Define public routes
const publicRoutes: string[] = ['/site', '/api/uploadthing'];

// Middleware function
export default function middleware(req: NextRequest, event: NextFetchEvent) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Check if the route is public
    if (publicRoutes.includes(url.pathname)) {
        return NextResponse.next();
    }

    // Subdomain handling
    const customSubDomain = hostname
        .split(`.${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0];

    if (customSubDomain) {
        return NextResponse.rewrite(new URL(`/${customSubDomain}${url.pathname}`, req.url));
    }

    // Specific path handling
    if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
        return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (url.pathname === '/' || (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)) {
        return NextResponse.rewrite(new URL('/site', req.url));
    }

    if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
        return NextResponse.rewrite(new URL(url.pathname, req.url));
    }

    // Use Clerk's middleware for authentication and handle the request and event
    return clerkMiddleware()(req, event);
}

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
