import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n/languages";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  variant?: "landing" | "default";
  className?: string;
};

export function LanguageSwitcher({ variant = "default", className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation("common");
  const current =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  const changeLanguage = (code: SupportedLanguage) => {
    void i18n.changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant === "landing" ? "ghostLight" : "outline"}
          size="sm"
          className={cn("gap-1.5 font-normal", className)}
          aria-label={t("language.label")}
        >
          <span aria-hidden>{current.flag}</span>
          <span>{current.label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              "gap-2 cursor-pointer",
              i18n.language === lang.code && "bg-accent",
            )}
          >
            <span aria-hidden>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
