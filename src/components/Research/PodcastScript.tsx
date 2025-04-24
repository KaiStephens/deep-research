"use client";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText, Signature, LoaderCircle, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Internal/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import useDeepResearch from "@/hooks/useDeepResearch";
import { useTaskStore } from "@/store/task";
import { getSystemPrompt } from "@/utils/deep-research";
import { downloadFile } from "@/utils/file";

const MilkdownEditor = dynamic(() => import("@/components/MilkdownEditor"));
const Artifact = dynamic(() => import("@/components/Artifact"));

const formSchema = z.object({
  podcastRequirement: z.string().optional(),
});

function PodcastScript() {
  const { t } = useTranslation();
  const taskStore = useTaskStore();
  const { status, writePodcastScript } = useDeepResearch();
  const {
    formattedTime,
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const taskFinished = useMemo(() => {
    const unfinishedTasks = taskStore.tasks.filter(
      (task) => task.state !== "completed"
    );
    return taskStore.tasks.length > 0 && unfinishedTasks.length === 0;
  }, [taskStore.tasks]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastRequirement: taskStore.podcastRequirement,
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { setPodcastRequirement } = useTaskStore.getState();
    try {
      accurateTimerStart();
      setIsWriting(true);
      if (values.podcastRequirement) setPodcastRequirement(values.podcastRequirement);
      await writePodcastScript();
    } finally {
      setIsWriting(false);
      accurateTimerStop();
    }
  }

  useEffect(() => {
    form.setValue("podcastRequirement", taskStore.podcastRequirement);
  }, [taskStore.podcastRequirement, form]);

  function getPodcastScriptContent() {
    const { podcastScript, sources } = useTaskStore.getState();

    return [
      podcastScript,
      sources.length > 0
        ? [
            "\n\n---",
            `## ${t("research.podcastScript.researchedInfor", {
              total: sources.length,
            })}`,
            `${sources
              .map(
                (source, idx) =>
                  `${idx + 1}. [${source.title || source.url}](${source.url})`
              )
              .join("\n")}`,
          ].join("\n\n")
        : "",
    ].join("\n\n");
  }

  async function handleDownloadPDF() {
    const originalTitle = document.title;
    document.title = `${taskStore.title} - Podcast Script`;
    window.print();
    document.title = originalTitle;
  }

  return (
    <section className="p-4 border rounded-md mt-4 print:border-none">
      <h3 className="font-semibold text-lg border-b mb-2 leading-10 print:hidden">
        {t("research.podcastScript.title")}
      </h3>
      {taskStore.podcastScript !== "" ? (
        <article className="border-b">
          <MilkdownEditor
            className="min-h-72"
            value={taskStore.podcastScript}
            onChange={(value) => taskStore.updatePodcastScript(value)}
            tools={
              <>
                <div className="px-1">
                  <Separator className="dark:bg-slate-700" />
                </div>
                <Artifact
                  value={taskStore.podcastScript}
                  systemInstruction={getSystemPrompt()}
                  onChange={taskStore.updatePodcastScript}
                  buttonClassName="float-menu-button"
                  dropdownMenuSideOffset={8}
                  tooltipSideOffset={8}
                />
                <div className="px-1">
                  <Separator className="dark:bg-slate-700" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="float-menu-button"
                      type="button"
                      size="icon"
                      variant="ghost"
                      title={t("editor.export")}
                      side="left"
                      sideoffset={8}
                    >
                      <Download />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="print:hidden"
                    side="left"
                    sideOffset={8}
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        downloadFile(
                          getPodcastScriptContent(),
                          `${taskStore.title} - Podcast Script.md`,
                          "text/markdown;charset=utf-8"
                        )
                      }
                    >
                      <FileText />
                      <span>Markdown</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadPDF()}>
                      <Signature />
                      <span>PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            }
          />
          {taskStore.sources?.length > 0 ? (
            <div className="prose prose-slate dark:prose-invert">
              <hr className="my-6" />
              <h2>
                {t("research.podcastScript.researchedInfor", {
                  total: taskStore.sources.length,
                })}
              </h2>
              <ol>
                {taskStore.sources.map((source, idx) => {
                  return (
                    <li key={idx}>
                      <a href={source.url} target="_blank">
                        {source.title || source.url}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}
        </article>
      ) : null}
      {taskFinished ? (
        <Form {...form}>
          <form className="mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="podcastRequirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 font-semibold">
                    {t("research.podcastScript.podcastRequirementLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder={t(
                        "research.podcastScript.podcastRequirementPlaceholder"
                      )}
                      disabled={isWriting}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="w-full mt-4" type="submit" disabled={isWriting}>
              {isWriting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  <span>{status}</span>
                  <small className="font-mono">{formattedTime}</small>
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  {t("research.common.writePodcastScript")}
                </>
              )}
            </Button>
          </form>
        </Form>
      ) : null}
      {taskStore.podcastScript === "" && !taskFinished ? (
        <div>{t("research.podcastScript.emptyTip")}</div>
      ) : null}
    </section>
  );
}

export default PodcastScript; 