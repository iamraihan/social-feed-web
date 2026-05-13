import { AppImage, type AppImageProps } from './app-image';

// Generic avatar atom. Single `size` prop covers width + height (avatars are
// always square). Nullable `src` falls back to a default. Any remaining
// image props (className, priority, sizes, …) flow through via the Omit<…>
// intersection so callers can still pass design class names. Built on top
// of AppImage so optimization policy stays centralised.

type AvatarProps = {
  src: string | null | undefined;
  alt: string;
  size: number;
  fallback?: string;
} & Omit<AppImageProps, 'src' | 'alt' | 'width' | 'height'>;

const DEFAULT_FALLBACK = '/assets/images/profile.png';

export function Avatar({
  src,
  alt,
  size,
  fallback = DEFAULT_FALLBACK,
  ...rest
}: AvatarProps) {
  return (
    <AppImage
      src={src ?? fallback}
      alt={alt}
      width={size}
      height={size}
      {...rest}
    />
  );
}
