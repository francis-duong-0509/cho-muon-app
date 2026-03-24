import { Loader2 } from "lucide-react";
import { cn } from "@chomuon/ui/lib/utils";

/**
 * **Spinner — Reusable loading spinner component.**
 *
 * **Concept: Lucide `Loader2` + CSS `animate-spin`**
 * → `Loader2` là icon có thiết kế tròn, phù hợp cho animation xoay.
 * → Tailwind `animate-spin` tạo CSS animation xoay 360° liên tục.
 * → Kết hợp = spinner đẹp, nhẹ, không cần thêm thư viện.
 *
 * **3 Variants:**
 * - `page`: Full-page centered spinner (cho loading state toàn trang)
 * - `inline`: Small spinner inline với text (cho loading trong button)
 * - `section`: Medium spinner centered trong section
 */

interface SpinnerProps {
  /** Size variant */
  variant?: "page" | "inline" | "section";
  /** Optional text label */
  label?: string;
  /** Additional className */
  className?: string;
}

const SIZES = {
  page: "w-8 h-8",
  section: "w-6 h-6",
  inline: "w-4 h-4",
} as const;

export function Spinner({ variant = "section", label, className }: SpinnerProps) {
  const iconSize = SIZES[variant];

  if (variant === "page") {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[50vh] gap-3", className)}>
        <Loader2 className={cn(iconSize, "animate-spin text-primary")} />
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className={cn("flex items-center justify-center py-12 gap-2", className)}>
        <Loader2 className={cn(iconSize, "animate-spin text-muted-foreground")} />
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    );
  }

  // inline — used inside buttons
  return <Loader2 className={cn(iconSize, "animate-spin", className)} />;
}
