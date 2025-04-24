"use client";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  GraduationCap,
  School,
  PersonStanding,
  Baby,
  Swords,
  Languages,
  SlidersVertical,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  LoaderCircle,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useArtifact from "@/hooks/useArtifact";

type Props = {
  value: string;
  systemInstruction?: string;
  onChange: (value: string) => void;
  buttonClassName?: string;
  dropdownMenuSide?: "top" | "right" | "bottom" | "left";
  dropdownMenuSideOffset?: number;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipSideOffset?: number;
};

function Artifact(props: Props) {
  const {
    value,
    onChange,
    systemInstruction,
    buttonClassName,
    dropdownMenuSide = "left",
    dropdownMenuSideOffset = 0,
    tooltipSide = "left",
    tooltipSideOffset = 0,
  } = props;
  const { t } = useTranslation();
  const {
    loadingAction,
    translate,
    changeReadingLevel,
    adjustLength,
    continuation,
  } = useArtifact({ value, onChange });

  return (
    <>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className={buttonClassName}
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={loadingAction !== ""}
                >
                  {loadingAction === "readingLevel" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side={tooltipSide}
              sideOffset={tooltipSideOffset}
              className="max-md:hidden"
            >
              <p>{t("artifact.readingLevel")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          side={dropdownMenuSide}
          sideOffset={dropdownMenuSideOffset}
        >
          <DropdownMenuItem
            onClick={() => changeReadingLevel("PhD student", systemInstruction)}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>{t("artifact.PhD")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              changeReadingLevel("college student", systemInstruction)
            }
          >
            <School className="mr-2 h-4 w-4" />
            <span>{t("artifact.college")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              changeReadingLevel("high school student", systemInstruction)
            }
          >
            <PersonStanding className="mr-2 h-4 w-4" />
            <span>{t("artifact.teenager")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              changeReadingLevel("elementary school student", systemInstruction)
            }
          >
            <Baby className="mr-2 h-4 w-4" />
            <span>{t("artifact.child")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeReadingLevel("pirate", systemInstruction)}
          >
            <Swords className="mr-2 h-4 w-4" />
            <span>{t("artifact.pirate")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className={buttonClassName}
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={loadingAction !== ""}
                >
                  {loadingAction === "adjustLength" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <SlidersVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side={tooltipSide}
              sideOffset={tooltipSideOffset}
              className="max-md:hidden"
            >
              <p>{t("artifact.adjustLength")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          side={dropdownMenuSide}
          sideOffset={dropdownMenuSideOffset}
        >
          <DropdownMenuItem
            onClick={() =>
              adjustLength(
                "much longer than it currently is",
                systemInstruction
              )
            }
          >
            <ChevronsUp className="mr-2 h-4 w-4" />
            <span>{t("artifact.longest")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              adjustLength(
                "slightly longer than it currently is",
                systemInstruction
              )
            }
          >
            <ChevronUp className="mr-2 h-4 w-4" />
            <span>{t("artifact.long")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              adjustLength(
                "slightly shorter than it currently is",
                systemInstruction
              )
            }
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            <span>{t("artifact.shorter")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              adjustLength(
                "much shorter than it currently is",
                systemInstruction
              )
            }
          >
            <ChevronsDown className="mr-2 h-4 w-4" />
            <span>{t("artifact.shortest")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className={buttonClassName}
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={loadingAction !== ""}
                >
                  {loadingAction === "translate" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side={tooltipSide}
              sideOffset={tooltipSideOffset}
              className="max-md:hidden"
            >
              <p>{t("artifact.translate")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          side={dropdownMenuSide}
          sideOffset={dropdownMenuSideOffset}
        >
          <DropdownMenuItem
            onClick={() => translate("English", systemInstruction)}
          >
            <span className="mr-2">🇬🇧</span>
            <span>English</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Simplified Chinese", systemInstruction)}
          >
            <span className="mr-2">🇨🇳</span>
            <span>简体中文</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Traditional Chinese", systemInstruction)}
          >
            <span className="mr-2">🇭🇰</span>
            <span>繁体中文</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Japanese", systemInstruction)}
          >
            <span className="mr-2">🇯🇵</span>
            <span>日本語</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Korean", systemInstruction)}
          >
            <span className="mr-2">🇰🇷</span>
            <span>한국어</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Spanish", systemInstruction)}
          >
            <span className="mr-2">🇪🇸</span>
            <span>Español</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("German", systemInstruction)}
          >
            <span className="mr-2">🇩🇪</span>
            <span>Deutsch</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("French", systemInstruction)}
          >
            <span className="mr-2">🇫🇷</span>
            <span>Français</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Portuguese", systemInstruction)}
          >
            <span className="mr-2">🇧🇷</span>
            <span>Português</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Russian", systemInstruction)}
          >
            <span className="mr-2">🇷🇺</span>
            <span>Русский</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Hindi", systemInstruction)}
          >
            <span className="mr-2">🇮🇳</span>
            <span>हिन्दी</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => translate("Arabic", systemInstruction)}
          >
            <span className="mr-2">🇸🇦</span>
            <span>العربية</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className={buttonClassName}
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={loadingAction !== ""}
                >
                  {loadingAction === "continuation" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ScrollText className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side={tooltipSide}
              sideOffset={tooltipSideOffset}
              className="max-md:hidden"
            >
              <p>{t("artifact.continuation")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          side={dropdownMenuSide}
          sideOffset={dropdownMenuSideOffset}
        >
          <DropdownMenuItem onClick={() => continuation(systemInstruction)}>
            <ScrollText className="mr-2 h-4 w-4" />
            <span>{t("artifact.continuation")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default Artifact;
