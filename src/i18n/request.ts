import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale
  const locale = 'bg';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
}); 