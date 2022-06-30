import { formatPrettyTitle } from './formatPrettyTitle';

describe('formatPrettyTitle', () => {
  it('should format an all caps title', () => {
    expect(formatPrettyTitle('ALL CAPS')).toEqual('All Caps');
  });

  it('should format a title with robotic separators', () => {
    expect(formatPrettyTitle('robotic-separators_from     robots')).toEqual('Robotic Separators From Robots');
  });

  it('should not capitalize a default set of words (connectors)', () => {
    expect(formatPrettyTitle('play with a game of chance')).toEqual('Play with a Game of Chance');
  });

  it('should capitalize the default set of words (connectors) if they start the title', () => {
    expect(formatPrettyTitle('a game of chance')).toEqual('A Game of Chance');
  });

  it('should take a custom set of words to ignore capitalization', () => {
    expect(formatPrettyTitle('a game of chance', ['game'])).toEqual('A game Of Chance');
  });

  it('should not crash with falsy args', () => {
    expect(formatPrettyTitle('')).toEqual('');
    expect(formatPrettyTitle(null)).toEqual('');
    expect(formatPrettyTitle(undefined)).toEqual('');
  });
});
