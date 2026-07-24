import { useCallback, useEffect, useRef } from "react";
// dockview 7 split the framework-agnostic core from the React bindings:
// the component lives in dockview-react, the types and CSS in the core.
import {
  DockviewReact,
  themeAbyssSpaced,
  type IDockviewPanelProps,
} from "dockview-react";
import type {
  DockviewApi,
  DockviewReadyEvent,
  DockviewTheme,
} from "dockview-core";
import "dockview-core/dist/styles/dockview.css";

// Start from the "spaced" theme — it already draws rounded, gapped groups and
// a thin line drop-indicator (the square, flush edges came from the plain
// theme). `dockview-theme-bracket` layers on top to retint it to the app's
// own tokens; the tighter gap keeps the panels reading as one workspace.
const bracketTheme: DockviewTheme = {
  ...themeAbyssSpaced,
  name: "bracket",
  className: "dockview-theme-abyss-spaced dockview-theme-bracket",
  gap: 6,
};

import DescriptionPanel from "../panels/DescriptionPanel";
import TestcasesPanel from "../panels/TestcasesPanel";
import ResultPanel from "../panels/ResultPanel";
import CodePanel from "../panels/CodePanel";
import SolutionPanel from "./SolutionPanel";
import { useSolve } from "../context/SolveContext";

const LAYOUT_KEY = "bracket:solve-layout:v1";

/**
 * Panels read everything from SolveContext, so dockview never has to carry
 * props through its serialised layout — which matters, because the layout is
 * restored from localStorage and must not embed problem-specific data.
 */
function SolutionDockPanel() {
  const { problem } = useSolve();
  return (
    <div className="h-full overflow-y-auto bg-surface p-5">
      <SolutionPanel problem={problem} />
    </div>
  );
}

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  description: () => <DescriptionPanel />,
  solution: () => <SolutionDockPanel />,
  code: () => <CodePanel />,
  testcases: () => <TestcasesPanel />,
  result: () => <ResultPanel />,
};

/** The arrangement LeetCode calls "Default": docs left, code and console right. */
function buildDefaultLayout(api: DockviewApi) {
  const description = api.addPanel({
    id: "description",
    component: "description",
    title: "Description",
  });

  api.addPanel({
    id: "solution",
    component: "solution",
    title: "Solution",
    position: { referencePanel: description, direction: "within" },
  });

  const code = api.addPanel({
    id: "code",
    component: "code",
    title: "Code",
    position: { referencePanel: description, direction: "right" },
  });

  const testcases = api.addPanel({
    id: "testcases",
    component: "testcases",
    title: "Testcases",
    position: { referencePanel: code, direction: "below" },
  });

  api.addPanel({
    id: "result",
    component: "result",
    title: "Result",
    position: { referencePanel: testcases, direction: "within" },
  });

  testcases.api.setActive();
  description.api.setActive();
}

export interface SolveDockHandle {
  resetLayout: () => void;
  /** Bring a panel to the front — Run/Submit use it to surface Result. */
  focusPanel: (id: string) => void;
}

export default function SolveDock({
  onReady,
}: {
  /** Hands the parent a reset callback for the top bar's layout menu. */
  onReady?: (handle: SolveDockHandle) => void;
}) {
  const apiRef = useRef<DockviewApi | null>(null);
  const disposableRef = useRef<{ dispose: () => void } | null>(null);

  const persist = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(api.toJSON()));
    } catch {
      // Private mode or quota — the layout just won't survive this session.
    }
  }, []);

  const handleReady = useCallback(
    (event: DockviewReadyEvent) => {
      apiRef.current = event.api;

      // A saved layout can be from an older panel set; if anything about it
      // fails to deserialise, fall back rather than leaving an empty dock.
      let restored = false;
      try {
        const saved = localStorage.getItem(LAYOUT_KEY);
        if (saved) {
          event.api.fromJSON(JSON.parse(saved));
          restored = event.api.panels.length > 0;
        }
      } catch {
        restored = false;
      }

      if (!restored) {
        event.api.clear();
        buildDefaultLayout(event.api);
      }

      // Any move, resize, tab or close writes the arrangement back. Attached
      // after the build above, so seed the store once here — otherwise
      // nothing is saved until the user happens to touch the layout.
      disposableRef.current = event.api.onDidLayoutChange(persist);
      persist();

      onReady?.({
        resetLayout: () => {
          event.api.clear();
          buildDefaultLayout(event.api);
          persist();
        },
        focusPanel: (id: string) => {
          // The panel may have been closed by the user; ignore if so.
          event.api.getPanel(id)?.api.setActive();
        },
      });
    },
    [persist, onReady]
  );

  // onReady isn't an effect, so its listener has to be torn down here.
  useEffect(() => () => disposableRef.current?.dispose(), []);

  return (
    <DockviewReact
      components={components}
      onReady={handleReady}
      theme={bracketTheme}
      className="h-full"
    />
  );
}
