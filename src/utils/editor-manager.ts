import { Extension } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { ExtensionsManager } from './extensions-manager';

export class EditorManager {
  private doc: Y.Doc;
  private wsProvider: WebsocketProvider;
  private persistence: IndexeddbPersistence;
  public filesMap: Y.Map<Y.Text>;
  private activeEditorView: EditorView | null = null;
  public editorViews: Map<string, EditorView> = new Map();

  constructor(
    projectId: string,
    wsUrl: string = `wss://${import.meta.env.PUBLIC_API_URL}`,
  ) {
    this.doc = new Y.Doc();
    this.filesMap = this.doc.getMap('files');
    this.wsProvider = new WebsocketProvider(wsUrl, projectId, this.doc);

    this.persistence = new IndexeddbPersistence(projectId, this.doc);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.wsProvider.on('status', (event: { status: string }) => {
      console.log('Sync Status:', event.status);
    });
    this.persistence.on('synced', () => {
      console.log('Indexed DB synced successfully');
    });
  }

  private async waitForSync(): Promise<void> {
    return new Promise((resolve) => {
      if (this.persistence.synced) {
        resolve();
      } else {
        this.persistence.once('synced', () => resolve());
      }
    });
  }

  getOrCreateFileText(fileId: string): Y.Text {
    if (this.filesMap.has(fileId)) {
      return this.filesMap.get(fileId)!;
    }
    const text = new Y.Text('');
    this.filesMap.set(fileId, text);
    return text;
  }

  async getOrCreateEditorView(
    fileId: string,
    fileName: string,
    container: HTMLDivElement,
    additionalExtensions: Extension[] = [],
  ): Promise<EditorView> {
    await this.waitForSync();
    const yText = this.getOrCreateFileText(fileId);
    const extensions = await ExtensionsManager.getExtensions(
      fileName,
      yText,
      this.wsProvider.awareness,
      additionalExtensions,
    );
    if (this.editorViews.has(fileId)) {
      // 有就复用，并且更新内容与对应的 Y.Text 一致
      const view = this.editorViews.get(fileId)!;
      // const newState = EditorState.create({
      //   doc: yText.toString(),
      //   extensions
      // })
      // view.setState(newState)
      // const transaction = view.state.update({
      //   changes: {
      //     from: 0,
      //     to: view.state.doc.length,
      //     insert: yText.toString(),
      //   },
      // });
      // view.dispatch(transaction);
      if (view.dom.parentElement !== container) {
        container.appendChild(view.dom);
      }
      return view;
    }
    // 没有就创建新的 EditorView

    const editorView = new EditorView({
      state: EditorState.create({
        doc: yText.toString(),
        extensions,
      }),
      parent: container,
    });

    this.editorViews.set(fileId, editorView);
    return editorView;
  }

  // 切换活跃文件
  async switchActiveFile(
    fileId: string,
    fileName: string,
    container: HTMLDivElement,
    extensions: Extension[],
  ): Promise<EditorView> {
    // 如果当前活跃编辑器不为空，隐藏它
    if (this.activeEditorView) {
      this.activeEditorView.dom.remove();
    }

    // 获取或创建新的编辑器视图
    const newEditorView = await this.getOrCreateEditorView(
      fileId,
      fileName,
      container,
      extensions,
    );
    this.activeEditorView = newEditorView;
    return newEditorView;
  }

  // 获取所有已打开的文件ID
  getOpenedFiles(): string[] {
    return Array.from(this.editorViews.keys());
  }

  // 关闭特定文件的编辑器
  closeFile(fileId: string) {
    const editorView = this.editorViews.get(fileId);
    if (editorView) {
      editorView.destroy();
      this.editorViews.delete(fileId);
    }
  }

  getCurrentView(fileId: string) {
    const editorView = this.editorViews.get(fileId);
    return editorView;
  }

  // 全局销毁
  destroy() {
    if (this.editorViews) {
      this.editorViews.forEach((view) => view.destroy());
    }
    if (this.wsProvider) {
      this.wsProvider.destroy();
    }
    if (this.persistence) {
      this.persistence.destroy();
    }
    if (this.doc) {
      this.doc.destroy();
    }
  }
}
