import { waitFor } from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-hooks';
import { useControlTutorial } from '_commons/hooks/useControlTutorial';

describe('useControlTutorial', () => {
  it('should update tutorial elements', async () => {
    const { result } = renderHook(() => useControlTutorial());
    await waitFor(() => {
      result.current.updateTutorialItems(1, { x: 0, y: 0, isParent: false, children: undefined, style: undefined });
      expect(result.current.parentTutorialItems.size).toBe(0);
      expect(result.current.tutorialItems.size).toBe(1);
    });
  });

  it('should update tutorial elements parent', async () => {
    const { result } = renderHook(() => useControlTutorial());
    await waitFor(() => {
      result.current.updateTutorialItems(1, { x: 0, y: 0, isParent: true, children: undefined, style: undefined });
      expect(result.current.parentTutorialItems.size).toBe(1);
      expect(result.current.tutorialItems.size).toBe(0);
    });
  });
});
