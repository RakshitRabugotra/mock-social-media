import Image from "next/image";
import { useMemo } from "react";

interface AvatarProps {
  /**
   * Image URL for the avatar
   */
  src?: string | null;
  /**
   * User's name (used for fallback initials)
   */
  name?: string;
  /**
   * User's first name (alternative to name prop)
   */
  firstName?: string;
  /**
   * User's last name (alternative to name prop)
   */
  lastName?: string;
  /**
   * Size of the avatar in pixels
   * @default 40
   */
  size?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
}

/**
 * Avatar component that displays a user's profile picture or initials
 * 
 * @example
 * <Avatar src="/user.jpg" name="John Doe" size={48} />
 * <Avatar firstName="John" lastName="Doe" size={32} />
 */
export default function Avatar({
  src,
  name,
  firstName,
  lastName,
  size = 40,
  className = "",
  alt,
}: AvatarProps) {
  // Generate initials from name or firstName/lastName
  const initials = useMemo(() => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0]?.toUpperCase() || "";
    }
    
    if (firstName || lastName) {
      const first = firstName?.[0]?.toUpperCase() || "";
      const last = lastName?.[0]?.toUpperCase() || "";
      return first + last;
    }
    
    return "";
  }, [name, firstName, lastName]);

  // Generate a background color based on initials/name for consistency
  const backgroundColor = useMemo(() => {
    const str = name || `${firstName}${lastName}` || "User";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate a color from the hash
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
  }, [name, firstName, lastName]);

  const altText = alt || name || `${firstName} ${lastName}`.trim() || "Avatar";

  // Calculate font size based on avatar size
  const fontSize = Math.max(12, size * 0.4);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      role="img"
      aria-label={altText}
    >
      {src ? (
        <img
          src={src}
          alt={altText}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          // unoptimized={src.startsWith("data:") || src.startsWith("blob:")}
        />
      ) : (
        <div
          className="flex items-center justify-center w-full h-full text-white font-medium select-none"
          style={{
            backgroundColor,
            fontSize,
          }}
        >
          {initials || "?"}
        </div>
      )}
    </div>
  );
}
