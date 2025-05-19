import { InputHTMLAttributes, ReactElement, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  Icon?: ReactElement;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, Icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-1">
              {Icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full py-2 pr-4 text-sm bg-background text-foreground placeholder-muted-foreground border border-input rounded-md shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
              "transition-colors duration-200",
              Icon ? "pl-12" : "pl-4",
              error && "border-destructive focus:ring-destructive focus:border-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
