import type { ReactElement, SVGProps } from "react";

/**
 * Hand-tuned 24px line icons (1.5 stroke) — no icon library dependency.
 */
type IconName =
  | "cart" | "whatsapp" | "phone" | "arrow" | "arrowUpRight" | "plus" | "minus" | "close" | "menu" | "heart"
  | "search" | "flame" | "leaf" | "spice" | "platter" | "clock" | "family" | "pin" | "mail" | "star"
  | "instagram" | "facebook" | "tiktok" | "truck" | "bag" | "dine" | "chevronLeft" | "chevronRight"
  | "check" | "trash" | "calendar" | "users" | "quote" | "directions" | "chili" | "veg" | "sparkle";

const paths: Record<IconName, ReactElement> = {
  cart: (<><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6.2" /><circle cx="10" cy="20" r="1.2" /><circle cx="17" cy="20" r="1.2" /></>),
  whatsapp: (<><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 20.5 11.8Z" /><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.2.4 0 .6.6 1 1.5 1.9 2.6 2.5.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.3.6-.1.9-.9 1.7-1.9 1.7-2.8 0-6.4-3.4-6.4-6.3 0-.7.3-1.3.5-1.7Z" /></>),
  phone: <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>),
  flame: <path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-4.3-3.6-6.4-4.3-10.3-2.3 1.3-3.6 3.6-3.6 5.8-1-.6-1.6-1.7-1.8-2.8C7 9 5.5 11.3 5.5 14.8 5.5 18.4 8.1 21 12 21Zm0 0c-1.7 0-2.8-1.2-2.8-2.8 0-1.8 1.5-2.6 2.8-4.4 1.3 1.8 2.8 2.6 2.8 4.4 0 1.6-1.1 2.8-2.8 2.8Z" />,
  leaf: (<><path d="M5 19c0-8 5-13 15-14 0 9-5 15-12 15a3 3 0 0 1-3-1Z" /><path d="M5 19c3-4 6-6.5 9.5-8.5" /></>),
  spice: (<><path d="M4 13h16a8 8 0 0 1-16 0Z" /><path d="M9 9.5c0-1.5 1-2 1-3.5M13 9.5c0-1.5 1-2 1-3.5M17 4l-3 5" /></>),
  platter: (<><path d="M3 17h18M4.5 17a7.5 7.5 0 0 1 15 0" /><path d="M12 7V5.5M10.5 5.5h3" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  family: (<><circle cx="8" cy="7" r="2.5" /><circle cx="16.5" cy="8.5" r="2" /><path d="M3.5 19v-2.5A3.5 3.5 0 0 1 7 13h2a3.5 3.5 0 0 1 3.5 3.5V19M13.5 19v-2a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v2" /></>),
  pin: (<><path d="M12 21s-6.5-6-6.5-11.2A6.5 6.5 0 0 1 12 3.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15 12 21 12 21Z" /><circle cx="12" cy="9.8" r="2.3" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 7 8 6 8-6" /></>),
  star: <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8L12 3.8Z" />,
  instagram: (<><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  facebook: <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z" />,
  tiktok: <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.3 2.4 1.9 4 4.5 4.3" />,
  truck: (<><path d="M3 6.5h11v9H3zM14 9.5h3.5l3 3v3H14" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>),
  bag: (<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>),
  dine: (<><path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v5" /><path d="M16.5 21V3c-1.9 1-3 3.3-3 6.5V13h3" /></>),
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  trash: <path d="M4.5 7h15M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4.5h6V7" />,
  calendar: (<><rect x="4" y="5.5" width="16" height="14" rx="1.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>),
  users: (<><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M15.5 5.5a3 3 0 0 1 0 5.5M17.5 13.8A5.5 5.5 0 0 1 20.5 19" /></>),
  quote: <path d="M10 7H6.5A1.5 1.5 0 0 0 5 8.5V12h4v5H5M19 7h-3.5A1.5 1.5 0 0 0 14 8.5V12h4v5h-4" />,
  directions: (<><path d="M12 2.8 21.2 12 12 21.2 2.8 12 12 2.8Z" /><path d="M9.5 14v-2.5h5M12.5 9.5l2 2-2 2" /></>),
  chili: <path d="M17 6.5c1.8.8 2.6 2.8 2 5-1.3 5-7.7 8.7-13.5 8 3.3-1.4 6.8-4.6 7.8-9.1.5-2.3 1.8-3.7 3.7-3.9ZM17 6.5c0-1.3.6-2.3 1.8-3" />,
  veg: (<><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="12" r="3.5" fill="currentColor" /></>),
  sparkle: <path d="M12 3.5c.6 4.3 2.2 6 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.5 5.9-2.2 6.5-6.5Z" />,
};

export function Icon({ name, className, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? "h-5 w-5"}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export type { IconName };
