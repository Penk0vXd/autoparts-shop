import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['bg'],

  // Used when no locale matches
  defaultLocale: 'bg',
  
  // Since we only have one locale, don't add locale prefixes
  localePrefix: 'never'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 