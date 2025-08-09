import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add at least one property to avoid empty interface warning
  variant?: "default" | "search"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, variant = "default", ...props }, ref) => {
    const baseStyles = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
    
    const variantStyles = {
      default: "",
      search: "bg-black/50 border-white/20 text-white"
    }

    return (
      <input
        type={type}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
