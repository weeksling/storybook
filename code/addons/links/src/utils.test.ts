import { addons } from '@storybook/preview-api';
import { SELECT_STORY } from '@storybook/core-events';

import { linkTo, hrefTo } from './utils';

jest.mock('@storybook/preview-api');
jest.mock('global', () => ({
  document: global.document,
  window: global,
}));

const mockAddons = addons as unknown as jest.Mocked<typeof addons>;

describe('preview', () => {
  const channel = { emit: jest.fn() };
  beforeAll(() => {
    mockAddons.getChannel.mockReturnValue(channel as any);
  });
  beforeEach(channel.emit.mockReset);
  describe('linkTo()', () => {
    it('should select the title and name provided', () => {
      const handler = linkTo('title', 'name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'title',
        story: 'name',
      });
    });

    it('should select the title (only) provided', () => {
      const handler = linkTo('title');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'title',
      });
    });

    it('should select the story (only) provided', () => {
      // simulate a currently selected, but not found as ID
      // @ts-expect-error (not strict)
      const handler = linkTo(undefined, 'name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        story: 'name',
      });
    });

    it('should select the id provided', () => {
      const handler = linkTo('title--name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        storyId: 'title--name',
      });
    });

    it('should handle functions returning strings', () => {
      const handler = linkTo(
        (a, b) => a + b,
        (a, b) => b + a
      );
      handler('title', 'name');

      expect(channel.emit.mock.calls).toContainEqual([
        SELECT_STORY,
        {
          kind: 'titlename',
          story: 'nametitle',
        },
      ]);
    });
  });

  describe('hrefTo()', () => {
    it('should return promise resolved with story href', async () => {
      const href = await hrefTo('title', 'name');
      expect(href).toContain('?id=title--name');
    });
  });
});
