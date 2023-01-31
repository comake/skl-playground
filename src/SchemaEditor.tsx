import type { Entity } from '@comake/skql-js-engine';
import { useRef, useEffect, useContext } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";
import { oneDark } from '@codemirror/theme-one-dark';
import { ThemeContext } from './contexts/ThemeContext';

export type SchemaEditorProps = {
  schema?: Entity;
  onChange: (doc: string) => void;
}

function SchemaEditor({ schema, onChange }: SchemaEditorProps) {
  const { theme } = useContext(ThemeContext);
  const editorRef = useRef<EditorView>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateListener = EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          onChange(editorRef.current!.state.doc.toString());
        }
      });

    if (containerRef.current && !editorRef.current) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: schema ? JSON.stringify(schema, null, 2) : '',
          extensions: [
            theme === 'light' ? githubLight : oneDark,
            basicSetup,
            json(),
            updateListener,
            EditorView.theme({
              "&": { height: "100%" },
              '&.cm-editor.cm-focused': { outline: 'none' },
              '.cm-scroller': { overflow: 'auto' },
              '.cm-gutters': { border: 'none', background: 'none' },
              '.cm-foldGutter': { visibility: 'hidden' },
              '.cm-gutters:hover .cm-foldGutter': { visibility: 'visible' },
              '.cm-gutterElement span[title="Unfold line"]': { fontSize: '19px' }
            }),
          ],
        }),
        parent: containerRef.current,
      });

      return () => {
        editorRef.current?.destroy()
        editorRef.current = undefined;
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, editorRef, theme]);

  return <div className='Schema-Editor' ref={containerRef} />;
}

export default SchemaEditor;
