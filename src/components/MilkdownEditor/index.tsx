"use client";
import {
  useRef,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Save, CodeXml, Eye } from "lucide-react";
import { Crepe } from "@milkdown/crepe";
import { editorViewOptionsCtx, editorViewCtx } from "@milkdown/kit/core";
import { replaceAll } from "@milkdown/kit/utils";
import { diagram } from "@xiangfa/milkdown-plugin-diagram";
import { math } from "@xiangfa/milkdown-plugin-math";
import { MarkdownEditor } from "@xiangfa/mdeditor";
import FloatingMenu from "@/components/Internal/FloatingMenu";
import { cn } from "@/utils/style";

import "@milkdown/crepe/theme/common/style.css";
import "./style.css";

type EditorProps = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  tools?: ReactNode;
};

function MilkdownEditor(props: EditorProps) {
  const { className, value: defaultValue, onChange, tools } = props;
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const milkdownEditorRef = useRef<HTMLDivElement>(null);
  const markdownEditorRef = useRef<HTMLDivElement>(null);
  const [milkdownEditor, setMilkdownEditor] = useState<Crepe | null>(null);
  const [markdownEditor, setMarkdownEditor] = useState<MarkdownEditor | null>(null);
  const [mode, setMode] = useState<"markdown" | "WYSIWYM">("WYSIWYM");
  const [editable, setEditable] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>(defaultValue);
  const [error, setError] = useState<string | null>(null);

  // Safe wrapper for milkdown operations
  const safelyApplyMilkdownOperation = useCallback((operation: (editor: Crepe) => void) => {
    if (!milkdownEditor) return;
    
    try {
      operation(milkdownEditor);
    } catch (err) {
      console.error('Milkdown operation error:', err);
      setError(String(err));
    }
  }, [milkdownEditor]);

  const handleEditable = useCallback((enable: boolean) => {
    safelyApplyMilkdownOperation((editor) => {
      editor.setReadonly(!enable);
      setEditable(enable);
    });
  }, [safelyApplyMilkdownOperation]);

  const updateContent = useCallback((content: string) => {
    if (mode === "WYSIWYM") {
      safelyApplyMilkdownOperation((editor) => {
        if (editor.editor.status === "Created") {
          try {
            const ctx = editor.editor.ctx;
            if (ctx && ctx.get(editorViewCtx)) {
              replaceAll(content)(ctx);
            }
          } catch (err) {
            console.error('Failed to update Milkdown content:', err);
          }
        }
      });
    } else if (mode === "markdown") {
      if (markdownEditor?.status === "create") {
        markdownEditor.update(content);
      }
    }
  }, [mode, markdownEditor, safelyApplyMilkdownOperation]);

  const changeMode = useCallback((newMode: "markdown" | "WYSIWYM") => {
    try {
      updateContent(markdown);
      setMode(newMode);
      if (!editable) handleEditable(true);
    } catch (err) {
      console.error('Mode change error:', err);
    }
  }, [markdown, editable, handleEditable, updateContent]);

  const save = useCallback(() => {
    try {
      changeMode("WYSIWYM");
      handleEditable(false);
      onChange(markdown);
    } catch (err) {
      console.error('Save error:', err);
    }
  }, [changeMode, handleEditable, markdown, onChange]);

  // Update editor content when external data changes
  useEffect(() => {
    if (defaultValue === markdown) return;
    
    try {
      if (mode === "WYSIWYM" && milkdownEditor?.editor.status === "Created") {
        const ctx = milkdownEditor.editor.ctx;
        if (ctx && ctx.get(editorViewCtx)) {
          replaceAll(defaultValue)(ctx);
        }
      } else if (mode === "markdown" && markdownEditor?.status === "create") {
        markdownEditor.update(defaultValue);
      }
      setMarkdown(defaultValue);
    } catch (err) {
      console.error('Failed to update content from props:', err);
    }
  }, [mode, milkdownEditor, markdownEditor, defaultValue, markdown]);

  // Initialize the WYSIWYM editor
  useEffect(() => {
    if (!milkdownEditorRef.current) return;
    
    let crepe: Crepe | null = null;

    try {
      crepe = new Crepe({
        root: milkdownEditorRef.current,
        defaultValue: defaultValue || "",
        features: {
          [Crepe.Feature.ImageBlock]: false,
          [Crepe.Feature.Latex]: false,
        },
        featureConfigs: {
          [Crepe.Feature.Placeholder]: {
            text: t("editor.placeholder"),
          },
          [Crepe.Feature.BlockEdit]: {
            slashMenuTextGroupLabel: t("editor.text"),
            slashMenuListGroupLabel: t("editor.list"),
            slashMenuAdvancedGroupLabel: t("editor.advanced"),
            slashMenuTextLabel: t("editor.text"),
            slashMenuH1Label: t("editor.h1"),
            slashMenuH2Label: t("editor.h2"),
            slashMenuH3Label: t("editor.h3"),
            slashMenuH4Label: t("editor.h4"),
            slashMenuH5Label: t("editor.h5"),
            slashMenuH6Label: t("editor.h6"),
            slashMenuQuoteLabel: t("editor.quote"),
            slashMenuDividerLabel: t("editor.divider"),
            slashMenuBulletListLabel: t("editor.bulletList"),
            slashMenuOrderedListLabel: t("editor.orderedList"),
            slashMenuTaskListLabel: t("editor.taskList"),
            slashMenuImageLabel: t("editor.image"),
            slashMenuCodeBlockLabel: t("editor.codeBlock"),
            slashMenuTableLabel: t("editor.table"),
            slashMenuMathLabel: t("editor.math"),
          },
        },
      });

      crepe.editor.config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class: "milkdown-editor mx-auto outline-none",
            spellcheck: "false",
          },
        }));
      });

      crepe.editor.use(diagram).use(math);

      crepe.on((listener) => {
        listener.markdownUpdated((ctx, markdown) => {
          setMarkdown(markdown);
        });
      });

      crepe
        .setReadonly(true)
        .create()
        .then(() => {
          setMilkdownEditor(crepe);
          if (defaultValue) {
            setTimeout(() => {
              try {
                if (crepe && crepe.editor.status === "Created") {
                  replaceAll(defaultValue)(crepe.editor.ctx);
                }
              } catch (err) {
                console.error('Initial content setting error:', err);
              }
            }, 100);
          }
        })
        .catch(err => {
          console.error('Milkdown creation error:', err);
          setError(`Failed to initialize editor: ${err.message}`);
        });

      return () => {
        if (crepe) {
          try {
            crepe.destroy();
          } catch (e) {
            console.error('Error destroying Milkdown editor:', e);
          }
        }
      };
    } catch (err) {
      console.error('Milkdown initialization error:', err);
      setError(`Editor initialization failed: ${err}`);
      return () => {};
    }
  }, [t, defaultValue]);

  // Initialize the Markdown editor
  useEffect(() => {
    if (!markdownEditorRef.current) return;
    
    let editor: MarkdownEditor | null = null;

    try {
      editor = new MarkdownEditor({
        root: markdownEditorRef.current,
        defaultValue: defaultValue || "",
        onChange: (value) => {
          setMarkdown(value);
        },
      });

      editor.create()
        .then(() => {
          setMarkdownEditor(editor);
        })
        .catch(err => {
          console.error('Markdown editor creation error:', err);
        });

      return () => {
        if (editor) {
          try {
            editor.destroy();
          } catch (e) {
            console.error('Error destroying Markdown editor:', e);
          }
        }
      };
    } catch (err) {
      console.error('Markdown editor initialization error:', err);
      return () => {};
    }
  }, [defaultValue]);

  // If there's an error, show a simple fallback editor
  if (error) {
    return (
      <div className={cn("relative border p-4 rounded", className)}>
        <textarea
          className="w-full h-full min-h-40 p-2 border rounded bg-transparent"
          value={markdown}
          onChange={(e) => {
            setMarkdown(e.target.value);
            onChange(e.target.value);
          }}
        />
        <button 
          className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
          onClick={() => setError(null)}
        >
          Reset Editor
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        className={cn(
          "milkdown-editor prose prose-slate dark:prose-invert max-w-full",
          { hidden: mode !== "WYSIWYM" }
        )}
        ref={milkdownEditorRef}
      ></div>
      <div
        className={cn(
          "markdown-editor text-base whitespace-break-spaces print:hidden",
          {
            hidden: mode !== "markdown",
          }
        )}
        ref={markdownEditorRef}
      ></div>
      <FloatingMenu targetRef={containerRef} fixedTopOffset={16}>
        <div className="flex flex-col gap-1 border rounded-full py-2 p-1 bg-white dark:bg-slate-800 opacity-50 max-sm:opacity-80 print:hidden hover:opacity-100">
          {mode === "WYSIWYM" ? (
            <button
              className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Markdown"
              onClick={() => changeMode("markdown")}
              type="button"
            >
              <CodeXml className="w-5 h-5" />
            </button>
          ) : (
            <button
              className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
              title={t("editor.WYSIWYM")}
              onClick={() => changeMode("WYSIWYM")}
              type="button"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
          {editable ? (
            <button
              className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
              title={t("editor.save")}
              onClick={() => save()}
              type="button"
            >
              <Save className="w-5 h-5" />
            </button>
          ) : (
            <button
              className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
              title={t("editor.edit")}
              onClick={() => handleEditable(true)}
              type="button"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          {tools ? tools : null}
        </div>
      </FloatingMenu>
    </div>
  );
}

export default MilkdownEditor;
