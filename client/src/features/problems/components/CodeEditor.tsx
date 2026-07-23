import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Prec, type Extension } from "@codemirror/state";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { rust } from "@codemirror/lang-rust";

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: string;
  /** Fired on Cmd/Ctrl+Enter, mirroring the top bar's Run button. */
  onRun?: () => void;
}

/** Map our language keys to a CodeMirror language extension. */
function languageExtension(language: string): Extension {
  switch (language) {
    case "typescript":
      return javascript({ typescript: true });
    case "javascript":
      return javascript();
    case "python":
      return python();
    case "java":
      return java();
    // The C++ grammar handles plain C well enough for a starter template.
    case "cpp":
    case "c":
      return cpp();
    case "go":
      return go();
    case "rust":
      return rust();
    default:
      return [];
  }
}

// Editor theme built from the app's design tokens so the workspace reads as
// one surface rather than a bolted-on third-party widget. Dark-only, matching
// the rest of the product.
const editorTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#101017", // --surface
    foreground: "#ececf3", // --ink
    caret: "#7c5cff", // --brand
    selection: "rgba(124,92,255,0.28)",
    selectionMatch: "rgba(124,92,255,0.18)",
    lineHighlight: "rgba(255,255,255,0.03)",
    gutterBackground: "#101017",
    gutterForeground: "#6c6c82", // --ink-subtle
    gutterActiveForeground: "#a2a2b5", // --ink-muted
    fontFamily:
      '"JetBrains Mono Variable", ui-monospace, "SF Mono", monospace',
  },
  styles: [
    { tag: [t.comment, t.lineComment, t.blockComment], color: "#6c6c82" },
    { tag: [t.keyword, t.modifier, t.controlKeyword], color: "#957bff" },
    { tag: [t.string, t.special(t.string), t.regexp], color: "#34d399" },
    { tag: [t.number, t.bool, t.null, t.atom], color: "#fbbf24" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#22d3ee" },
    { tag: [t.definition(t.variableName), t.variableName], color: "#ececf3" },
    { tag: [t.typeName, t.className, t.namespace], color: "#22d3ee" },
    { tag: [t.propertyName, t.attributeName], color: "#a2a2b5" },
    { tag: [t.operator, t.punctuation, t.bracket], color: "#a2a2b5" },
  ],
});

// Fill the pane and let long lines scroll horizontally (no wrap), the way a
// real code editor behaves — the gutter and text stay in lockstep.
const fillHeight = EditorView.theme({
  "&": { height: "100%", fontSize: "0.875rem" },
  ".cm-scroller": { overflow: "auto" },
});

export default function CodeEditor({ value, onChange, language, onRun }: Props) {
  const extensions = useMemo<Extension[]>(() => {
    const runKey = Prec.highest(
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            onRun?.();
            return true;
          },
        },
      ])
    );
    return [languageExtension(language), fillHeight, runKey];
  }, [language, onRun]);

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={editorTheme}
      extensions={extensions}
      height="100%"
      className="h-full text-sm"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
        autocompletion: false,
        foldGutter: false,
      }}
    />
  );
}
