import NextImage, { type ImageProps } from 'next/image';

// App-wide image component (use this everywhere instead of next/image).
// Defaults `unoptimized` since every asset ships in /public; caller can
// still pass `unoptimized={false}` to opt back into Next.js optimization
// (e.g., for remote URLs that arrive with API integration).

export type AppImageProps = ImageProps;

export function AppImage(props: AppImageProps) {
  return <NextImage unoptimized {...props} />;
}
