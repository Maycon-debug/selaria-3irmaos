import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white hover:bg-neutral-800 hover:border-neutral-700 border border-neutral-800 shadow-[0_1px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.4)]",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-300 border border-neutral-200 shadow-sm hover:shadow-md",
        outline:
          "border border-neutral-700/60 bg-transparent text-neutral-200 hover:bg-neutral-900/50 hover:border-neutral-600 hover:text-white shadow-none hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]",
        ghost:
          "bg-transparent text-neutral-300 hover:bg-neutral-900/40 hover:text-white border border-transparent hover:border-neutral-800/50",
        subtle:
          "bg-neutral-900/40 text-neutral-200 hover:bg-neutral-800/60 hover:text-white border border-neutral-800/50 hover:border-neutral-700/50 backdrop-blur-sm",
        destructive:
          "bg-red-950/80 text-red-100 hover:bg-red-900/80 hover:text-white border border-red-900/50 hover:border-red-800/60 shadow-[0_1px_2px_0_rgba(220,38,38,0.2)] hover:shadow-[0_4px_8px_0_rgba(220,38,38,0.3)]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
