import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "m3-state-layer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-[background-color,color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-[0.38] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-none cursor-pointer",
        destructive:
          "cursor-pointer bg-destructive text-white shadow-none focus-visible:ring-destructive/30",
        outline:
          "cursor-pointer border border-border bg-transparent text-foreground shadow-none",
        secondary:
          "cursor-pointer bg-primary/15 text-primary shadow-none",
        tonal:
          "cursor-pointer bg-primary/15 text-primary shadow-none",
        ghost:
          "cursor-pointer bg-transparent text-foreground",
        text:
          "cursor-pointer bg-transparent text-primary px-3",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        "default": "h-10 px-6 py-2 has-[>svg]:pl-4 has-[>svg]:pr-6",
        "sm": "h-8 gap-1.5 px-4 has-[>svg]:pl-3 has-[>svg]:pr-4",
        "lg": "h-12 px-8 has-[>svg]:pl-6 has-[>svg]:pr-8",
        "icon": "size-10 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
