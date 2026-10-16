import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const pillVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-extrabold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        primary: "bg-panda text-snow hover:bg-deepred active:bg-deepred",
        secondary: "border-2 border-deepred bg-brick text-deepred hover:bg-deepred hover:text-snow active:bg-deepred active:text-snow",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof pillVariants>;

export function PillButton({ className, variant, ...props }: Props) {
  return <button className={cn(pillVariants({ variant }), className)} {...props} />;
}
