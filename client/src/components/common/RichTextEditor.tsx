import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";

/**
 * Rich-text editor for admin-authored problem content.
 *
 * Replaces react-quill, which is unmaintained and pulled in a `quill` with a
 * published XSS advisory (GHSA-4943-9vgg-gr5r) as a production dependency.
 * The contract is unchanged — HTML in, HTML out — and the server still runs
 * everything through sanitize-html on write, so this is defence in depth
 * rather than the only guard.
 */
interface Props {
  value: string;
  onChange: (html: string) => void;
  ariaLabel: string;
}

export default function RichTextEditor({ value, onChange, ariaLabel }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // The statement is a fragment inside the page, not a document — a
        // top-level H1 would collide with the problem title.
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        "aria-label": ariaLabel,
        class:
          "prose prose-invert max-w-none min-h-[10rem] px-4 py-3 outline-none prose-pre:bg-surface-2 prose-code:text-brand",
      },
    },
    onUpdate: ({ editor }) => {
      // TipTap represents "empty" as <p></p>; report it as an empty string so
      // an untouched field doesn't save a stray paragraph.
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Re-seed when the form switches to a different problem. Guarded on the
  // current HTML so this doesn't fire on every keystroke and reset the cursor.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const tools = [
    { icon: Bold, label: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: Code, label: "Code", action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code") },
    { icon: Heading2, label: "Heading", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: List, label: "Bullet list", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: ListOrdered, label: "Numbered list", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: Quote, label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: Undo2, label: "Undo", action: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo2, label: "Redo", action: () => editor.chain().focus().redo().run(), active: false },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface focus-within:border-brand">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface-2 px-2 py-1.5">
        {tools.map(({ icon: Icon, label, action, active }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`rounded p-1.5 transition-colors ${
              active
                ? "bg-brand-soft text-brand"
                : "text-ink-muted hover:bg-surface hover:text-ink"
            }`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
