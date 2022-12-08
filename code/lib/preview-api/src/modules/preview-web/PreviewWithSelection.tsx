import { dedent } from 'ts-dedent';
import global from 'global';
import {
  CURRENT_STORY_WAS_SET,
  PRELOAD_ENTRIES,
  PREVIEW_KEYDOWN,
  SET_CURRENT_STORY,
  SET_INDEX,
  STORY_ARGS_UPDATED,
  STORY_CHANGED,
  STORY_ERRORED,
  STORY_MISSING,
  STORY_PREPARED,
  STORY_RENDER_PHASE_CHANGED,
  STORY_SPECIFIED,
  STORY_THREW_EXCEPTION,
  STORY_UNCHANGED,
  UPDATE_QUERY_PARAMS,
} from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import type {
  Renderer,
  Args,
  Globals,
  ModuleImportFn,
  StoryIndex,
  ProjectAnnotations,
  StoryId,
  ViewMode,
} from '@storybook/types';

import type { MaybePromise } from './Preview';
import { Preview } from './Preview';

import { PREPARE_ABORTED } from './render/Render';
import { StoryRender } from './render/StoryRender';
import { TemplateDocsRender } from './render/TemplateDocsRender';
import { StandaloneDocsRender } from './render/StandaloneDocsRender';
import type { Selection, SelectionStore } from './SelectionStore';
import type { View } from './View';
import type { StorySpecifier } from '../store/StoryIndexStore';

const globalWindow = globalThis;

function focusInInput(event: Event) {
  const target = event.target as Element;
  return /input|textarea/i.test(target.tagName) || target.getAttribute('contenteditable') !== null;
}

type PossibleRender<TFramework extends Renderer> =
  | StoryRender<TFramework>
  | TemplateDocsRender<TFramework>
  | StandaloneDocsRender<TFramework>;

function isStoryRender<TFramework extends Renderer>(
  r: PossibleRender<TFramework>
): r is StoryRender<TFramework> {
  return r.type === 'story';
}

export class PreviewWithSelection<TFramework extends Renderer> extends Preview<TFramework> {
  currentSelection?: Selection;

  currentRender?: PossibleRender<TFramework>;

  constructor(
    public selectionStore: SelectionStore,
    public view: View<TFramework['canvasElement']>
  ) {
    super();
  }

  setupListeners() {
    super.setupListeners();

    globalWindow.onkeydown = this.onKeydown.bind(this);

    this.channel.on(SET_CURRENT_STORY, this.onSetCurrentStory.bind(this));
    this.channel.on(UPDATE_QUERY_PARAMS, this.onUpdateQueryParams.bind(this));
    this.channel.on(PRELOAD_ENTRIES, this.onPreloadStories.bind(this));
  }

  initializeWithProjectAnnotations(projectAnnotations: ProjectAnnotations<TFramework>) {
    return super
      .initializeWithProjectAnnotations(projectAnnotations)
      .then(() => this.setInitialGlobals());
  }

  async setInitialGlobals() {
    if (!this.storyStore.globals)
      throw new Error(`Cannot call setInitialGlobals before initialization`);

    const { globals } = this.selectionStore.selectionSpecifier || {};
    if (globals) {
      this.storyStore.globals.updateFromPersisted(globals);
    }
    this.emitGlobals();
  }

  // If initialization gets as far as the story index, this function runs.
  initializeWithStoryIndex(storyIndex: StoryIndex): PromiseLike<void> {
    return super.initializeWithStoryIndex(storyIndex).then(() => {
      if (!global.FEATURES?.storyStoreV7) {
        this.channel.emit(SET_INDEX, this.storyStore.getSetIndexPayload());
      }

      return this.selectSpecifiedStory();
    });
  }

  // Use the selection specifier to choose a story, then render it
  async selectSpecifiedStory() {
    if (!this.storyStore.storyIndex)
      throw new Error(`Cannot call selectSpecifiedStory before initialization`);

    if (!this.selectionStore.selectionSpecifier) {
      this.renderMissingStory();
      return;
    }

    const { storySpecifier, args } = this.selectionStore.selectionSpecifier;
    const entry = this.storyStore.storyIndex.entryFromSpecifier(storySpecifier);

    if (!entry) {
      if (storySpecifier === '*') {
        this.renderStoryLoadingException(
          storySpecifier,
          new Error(dedent`
            Couldn't find any stories in your Storybook.
            - Please check your stories field of your main.js config.
            - Also check the browser console and terminal for error messages.
          `)
        );
      } else {
        this.renderStoryLoadingException(
          storySpecifier,
          new Error(dedent`
            Couldn't find story matching '${storySpecifier}'.
            - Are you sure a story with that id exists?
            - Please check your stories field of your main.js config.
            - Also check the browser console and terminal for error messages.
          `)
        );
      }

      return;
    }

    const { id: storyId, type: viewMode } = entry;
    this.selectionStore.setSelection({ storyId, viewMode });
    this.channel.emit(STORY_SPECIFIED, this.selectionStore.selection);

    this.channel.emit(CURRENT_STORY_WAS_SET, this.selectionStore.selection);

    await this.renderSelection({ persistedArgs: args });
  }

  // EVENT HANDLERS

  // This happens when a config file gets reloaded
  async onGetProjectAnnotationsChanged({
    getProjectAnnotations,
  }: {
    getProjectAnnotations: () => MaybePromise<ProjectAnnotations<TFramework>>;
  }) {
    await super.onGetProjectAnnotationsChanged({ getProjectAnnotations });

    if (this.selectionStore.selection) {
      this.renderSelection();
    }
  }

  // This happens when a glob gets HMR-ed
  async onStoriesChanged({
    importFn,
    storyIndex,
  }: {
    importFn?: ModuleImportFn;
    storyIndex?: StoryIndex;
  }) {
    await super.onStoriesChanged({ importFn, storyIndex });

    if (!global.FEATURES?.storyStoreV7) {
      this.channel.emit(SET_INDEX, await this.storyStore.getSetIndexPayload());
    }

    if (this.selectionStore.selection) {
      await this.renderSelection();
    } else {
      // Our selection has never applied before, but maybe it does now, let's try!
      await this.selectSpecifiedStory();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.storyRenders.find((r) => r.disableKeyListeners) && !focusInInput(event)) {
      // We have to pick off the keys of the event that we need on the other side
      const { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode } = event;
      this.channel.emit(PREVIEW_KEYDOWN, {
        event: { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode },
      });
    }
  }

  async onSetCurrentStory(selection: { storyId: StoryId; viewMode?: ViewMode }) {
    await this.storyStore.initializationPromise;

    this.selectionStore.setSelection({ viewMode: 'story', ...selection });
    this.channel.emit(CURRENT_STORY_WAS_SET, this.selectionStore.selection);
    this.renderSelection();
  }

  onUpdateQueryParams(queryParams: any) {
    this.selectionStore.setQueryParams(queryParams);
  }

  async onUpdateGlobals({ globals }: { globals: Globals }) {
    super.onUpdateGlobals({ globals });
    if (
      this.currentRender instanceof StandaloneDocsRender ||
      this.currentRender instanceof TemplateDocsRender
    ) {
      await this.currentRender.rerender?.();
    }
  }

  async onUpdateArgs({ storyId, updatedArgs }: { storyId: StoryId; updatedArgs: Args }) {
    super.onUpdateArgs({ storyId, updatedArgs });
  }

  async onPreloadStories({ ids }: { ids: string[] }) {
    /**
     * It's possible that we're trying to preload a story in a ref we haven't loaded the iframe for yet.
     * Because of the way the targeting works, if we can't find the targeted iframe,
     * we'll use the currently active iframe which can cause the event to be targeted
     * to the wrong iframe, causing an error if the storyId does not exists there.
     */
    await Promise.allSettled(ids.map((id) => this.storyStore.loadEntry(id)));
  }

  // RENDERING

  // We can either have:
  // - a story selected in "story" viewMode,
  //     in which case we render it to the root element, OR
  // - a story selected in "docs" viewMode,
  //     in which case we render the docsPage for that story
  async renderSelection({ persistedArgs }: { persistedArgs?: Args } = {}) {
    const { renderToCanvas } = this;
    if (!renderToCanvas) throw new Error('Cannot call renderSelection before initialization');
    const { selection } = this.selectionStore;
    if (!selection) throw new Error('Cannot call renderSelection as no selection was made');

    const { storyId } = selection;
    let entry;
    try {
      entry = await this.storyStore.storyIdToEntry(storyId);
    } catch (err) {
      if (this.currentRender) await this.teardownRender(this.currentRender);
      this.renderStoryLoadingException(storyId, err as Error);
      return;
    }

    const storyIdChanged = this.currentSelection?.storyId !== storyId;
    const viewModeChanged = this.currentRender?.type !== entry.type;

    // Show a spinner while we load the next story
    if (entry.type === 'story') {
      this.view.showPreparingStory({ immediate: viewModeChanged });
    } else {
      this.view.showPreparingDocs();
    }

    // If the last render is still preparing, let's drop it right now. Either
    //   (a) it is a different story, which means we would drop it later, OR
    //   (b) it is the *same* story, in which case we will resolve our own .prepare() at the
    //       same moment anyway, and we should just "take over" the rendering.
    // (We can't tell which it is yet, because it is possible that an HMR is going on and
    //  even though the storyId is the same, the story itself is not).
    if (this.currentRender?.isPreparing()) {
      await this.teardownRender(this.currentRender);
    }

    let render: PossibleRender<TFramework>;
    if (entry.type === 'story') {
      render = new StoryRender<TFramework>(
        this.channel,
        this.storyStore,
        (...args: Parameters<typeof renderToCanvas>) => {
          // At the start of renderToCanvas we make the story visible (see note in WebView)
          this.view.showStoryDuringRender();
          return renderToCanvas(...args);
        },
        this.mainStoryCallbacks(storyId),
        storyId,
        'story'
      );
    } else if (entry.standalone) {
      render = new StandaloneDocsRender<TFramework>(this.channel, this.storyStore, entry);
    } else {
      render = new TemplateDocsRender<TFramework>(this.channel, this.storyStore, entry);
    }

    // We need to store this right away, so if the story changes during
    // the async `.prepare()` below, we can (potentially) cancel it
    const lastSelection = this.currentSelection;
    this.currentSelection = selection;

    const lastRender = this.currentRender;
    this.currentRender = render;

    try {
      await render.prepare();
    } catch (err) {
      if (err !== PREPARE_ABORTED) {
        // We are about to render an error so make sure the previous story is
        // no longer rendered.
        if (lastRender) await this.teardownRender(lastRender);
        this.renderStoryLoadingException(storyId, err as Error);
      }
      return;
    }

    const implementationChanged = !storyIdChanged && lastRender && !render.isEqual(lastRender);

    if (persistedArgs && isStoryRender(render)) {
      if (!render.story) throw new Error('Render has not been prepared!');
      this.storyStore.args.updateFromPersisted(render.story, persistedArgs);
    }

    // Don't re-render the story if nothing has changed to justify it
    if (
      lastRender &&
      !lastRender.torndown &&
      !storyIdChanged &&
      !implementationChanged &&
      !viewModeChanged
    ) {
      this.currentRender = lastRender;
      this.channel.emit(STORY_UNCHANGED, storyId);
      this.view.showMain();
      return;
    }

    // Wait for the previous render to leave the page. NOTE: this will wait to ensure anything async
    // is properly aborted, which (in some cases) can lead to the whole screen being refreshed.
    if (lastRender) await this.teardownRender(lastRender, { viewModeChanged });

    // If we are rendering something new (as opposed to re-rendering the same or first story), emit
    if (lastSelection && (storyIdChanged || viewModeChanged)) {
      this.channel.emit(STORY_CHANGED, storyId);
    }

    if (isStoryRender(render)) {
      if (!render.story) throw new Error('Render has not been prepared!');
      const { parameters, initialArgs, argTypes, args } = this.storyStore.getStoryContext(
        render.story
      );

      if (global.FEATURES?.storyStoreV7) {
        this.channel.emit(STORY_PREPARED, {
          id: storyId,
          parameters,
          initialArgs,
          argTypes,
          args,
        });
      }

      // For v6 mode / compatibility
      // If the implementation changed, or args were persisted, the args may have changed,
      // and the STORY_PREPARED event above may not be respected.
      if (implementationChanged || persistedArgs) {
        this.channel.emit(STORY_ARGS_UPDATED, { storyId, args });
      }
    }

    if (isStoryRender(render)) {
      if (!render.story) throw new Error('Render has not been prepared!');
      this.storyRenders.push(render as StoryRender<TFramework>);
      (this.currentRender as StoryRender<TFramework>).renderToElement(
        this.view.prepareForStory(render.story)
      );
    } else {
      this.currentRender.renderToElement(
        this.view.prepareForDocs(),
        // This argument is used for docs, which is currently only compatible with HTMLElements
        this.renderStoryToElement.bind(this) as any
      );
    }
  }

  async teardownRender(
    render: PossibleRender<TFramework>,
    { viewModeChanged = false }: { viewModeChanged?: boolean } = {}
  ) {
    this.storyRenders = this.storyRenders.filter((r) => r !== render);
    await render?.teardown?.({ viewModeChanged });
  }

  // API
  async extract(options?: { includeDocsOnly: boolean }) {
    if (this.previewEntryError) {
      throw this.previewEntryError;
    }

    if (!this.storyStore.projectAnnotations) {
      // In v6 mode, if your preview.js throws, we never get a chance to initialize the preview
      // or store, and the error is simply logged to the browser console. This is the best we can do
      throw new Error(dedent`Failed to initialize Storybook.

      Do you have an error in your \`preview.js\`? Check your Storybook's browser console for errors.`);
    }

    if (global.FEATURES?.storyStoreV7) {
      await this.storyStore.cacheAllCSFFiles();
    }

    return this.storyStore.extract(options);
  }

  // UTILITIES
  mainStoryCallbacks(storyId: StoryId) {
    return {
      showMain: () => this.view.showMain(),
      showError: (err: { title: string; description: string }) => this.renderError(storyId, err),
      showException: (err: Error) => this.renderException(storyId, err),
    };
  }

  inlineStoryCallbacks(storyId: StoryId) {
    return {
      showMain: () => {},
      showError: (err: { title: string; description: string }) =>
        logger.error(`Error rendering docs story (${storyId})`, err),
      showException: (err: Error) => logger.error(`Error rendering docs story (${storyId})`, err),
    };
  }

  renderPreviewEntryError(reason: string, err: Error) {
    super.renderPreviewEntryError(reason, err);
    this.view.showErrorDisplay(err);
  }

  renderMissingStory() {
    this.view.showNoPreview();
    this.channel.emit(STORY_MISSING);
  }

  renderStoryLoadingException(storySpecifier: StorySpecifier, err: Error) {
    // logger.error(`Unable to load story '${storySpecifier}':`);
    logger.error(err);
    this.view.showErrorDisplay(err);
    this.channel.emit(STORY_MISSING, storySpecifier);
  }

  // renderException is used if we fail to render the story and it is uncaught by the app layer
  renderException(storyId: StoryId, error: Error) {
    const { name = 'Error', message = String(error), stack } = error;
    this.channel.emit(STORY_THREW_EXCEPTION, { name, message, stack });
    this.channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: 'errored', storyId });

    // Ignored exceptions exist for control flow purposes, and are typically handled elsewhere.
    //
    // FIXME: Should be '=== IGNORED_EXCEPTION', but currently the object
    // is coming from two different bundles (index.js vs index.mjs)
    //
    // https://github.com/storybookjs/storybook/issues/19321
    if (!error.message?.startsWith('ignoredException')) {
      this.view.showErrorDisplay(error);
      logger.error(`Error rendering story '${storyId}':`);
      logger.error(error);
    }
  }

  // renderError is used by the various app layers to inform the user they have done something
  // wrong -- for instance returned the wrong thing from a story
  renderError(storyId: StoryId, { title, description }: { title: string; description: string }) {
    logger.error(`Error rendering story ${title}: ${description}`);
    this.channel.emit(STORY_ERRORED, { title, description });
    this.channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: 'errored', storyId });
    this.view.showErrorDisplay({
      message: title,
      stack: description,
    });
  }
}
