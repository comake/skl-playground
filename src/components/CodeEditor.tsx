import { useRef, useEffect, useContext } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";
import { oneDark } from '@codemirror/theme-one-dark';
import { linter, lintGutter } from '@codemirror/lint';
import ThemeContext from '../contexts/ThemeContext';

export type CodeEditorProps = {
  code?: string;
  locked?: boolean;
  classes?: string;
  onChange?: (doc: string) => void;
  hideLineNumbers?: boolean;
  alwaysShowFolds?: boolean;
}

function CodeEditor({ code, onChange, locked, classes, hideLineNumbers, alwaysShowFolds }: CodeEditorProps) {
  const { theme } = useContext(ThemeContext);
  const editorRef = useRef<EditorView>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: code ?? '',
          extensions: [
            theme === 'light' ? githubLight : oneDark,
            basicSetup,
            json(),
            linter(jsonParseLinter()),
            lintGutter(),
            EditorView.updateListener.of((v) => {
              if (v.docChanged && onChange) {
                onChange(editorRef.current!.state.doc.toString());
              }
            }),
            EditorView.theme({
              "&": { height: "100%" },
              '&.cm-editor.cm-focused': { outline: 'none' },
              '.cm-scroller': { overflow: 'auto' },
              '.cm-gutters': { border: 'none', background: 'none', paddingLeft: hideLineNumbers ? '5px': '' },
              '.cm-gutter.cm-lineNumbers': hideLineNumbers ? { display: 'none !important' } : {},
              '.cm-gutterElement span[title="Fold line"]': alwaysShowFolds ? {} : { visibility: 'hidden' },
              '.cm-gutters:hover .cm-gutterElement span[title="Fold line"]': { visibility: 'visible' },
              '.cm-gutterElement span[title="Unfold line"]': { fontSize: '19px' },
              '.cm-content': { paddingTop: '0px' },
              '.cm-foldGutter span': { top: '-3px', position: 'relative' },
              '.cm-gutter-lint': { position: 'absolute', left: '0px', top: '0px', width: '4px' },
              '.cm-gutter-lint .cm-activeLineGutter': { backgroundColor: 'transparent !important' },
              '.cm-gutter-lint .cm-gutterElement': { padding: '2px 0px' },
              '.cm-gutter-lint .cm-lint-marker-error': {
                content: 'none',
                width: '4px',
                height: '100%',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
              }
            }),
            EditorView.editable.of(locked ?? true),
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
  }, [containerRef, editorRef, theme, locked, hideLineNumbers, alwaysShowFolds]);

  return <div className={classes} ref={containerRef} />;
}

export default CodeEditor;
