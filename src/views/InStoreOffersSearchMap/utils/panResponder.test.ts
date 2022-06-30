import {
  gestureIsClick,
  getSwipeDirection,
  handlePanResponderEnd,
  handleShouldSetPanResponder,
  isValidSwipe,
  isValidVerticalSwipe,
  triggerSwipeHandlers
} from './panResponder';

const swipeDirections = {
  swipeUp: 'SWIPE_UP',
  swipeDown: 'SWIPE_DOWN'
};

const mockedHandleSwipeUp = jest.fn();
const mockedHandleSwipeDown = jest.fn();

describe('Utils Map', () => {
  it('should return that a gesture is a Click', () => {
    expect(gestureIsClick({ dx: 4, dy: 4 })).toBeTruthy();
  });

  it('should return that a gesture is not a Click', () => {
    expect(gestureIsClick({ dx: 6, dy: 4 })).toBeFalsy();
  });

  it('should set a Pan Responder', () => {
    expect(handleShouldSetPanResponder({ nativeEvent: { touches: [''] } }, { dx: 6, dy: 6 })).toBeTruthy();
  });

  it('should not set a Pan Responder', () => {
    expect(handleShouldSetPanResponder({ nativeEvent: { touches: [] } }, { dx: 4, dy: 4 })).toBeFalsy();
  });

  it('should return that a gesture is a valid swipe', () => {
    expect(isValidSwipe(5, 4, 4, 5)).toBeTruthy();
  });

  it('should return that a gesture is not a valid swipe', () => {
    expect(isValidSwipe(4, 5, 5, 4)).toBeFalsy();
  });

  it('should return that is a valid vertical swipe', () => {
    expect(isValidVerticalSwipe({ vy: 1, dx: 10 })).toBeTruthy();
  });

  it('should return that is not a valid vertical swipe', () => {
    expect(isValidVerticalSwipe({ vy: 0.2, dx: 81 })).toBeFalsy();
  });

  it('should return Swipe Down direction', () => {
    expect(getSwipeDirection({ swipeUp: swipeDirections.swipeUp, swipeDown: swipeDirections.swipeDown, vy: 1, dx: 10, dy: 1 })).toEqual(
      swipeDirections.swipeDown
    );
  });

  it('should return Swipe Up direction', () => {
    expect(getSwipeDirection({ swipeUp: swipeDirections.swipeUp, swipeDown: swipeDirections.swipeDown, vy: 1, dx: 10, dy: 0 })).toEqual(
      swipeDirections.swipeUp
    );
  });

  it('should return that a gesture is not a Swipe Up and Swipe Down', () => {
    expect(getSwipeDirection({ swipeUp: swipeDirections.swipeUp, swipeDown: swipeDirections.swipeDown, vy: 0.2, dx: 81, dy: 1 })).toBeNull();
  });

  it('should execute on Swipe Up callback', () => {
    triggerSwipeHandlers(swipeDirections.swipeUp, mockedHandleSwipeUp, mockedHandleSwipeDown);
    expect(mockedHandleSwipeUp).toBeCalledWith();
  });

  it('should execute on Swipe Down callback', () => {
    triggerSwipeHandlers(swipeDirections.swipeDown, mockedHandleSwipeUp, mockedHandleSwipeDown);
    expect(mockedHandleSwipeDown).toBeCalledWith();
  });

  it('should execute on Swipe Up callback when a gesture is valid', () => {
    handlePanResponderEnd(
      { swipeUp: swipeDirections.swipeUp, swipeDown: swipeDirections.swipeDown, vy: 1, dx: 10, dy: 0 },
      mockedHandleSwipeUp,
      mockedHandleSwipeDown
    );
    expect(mockedHandleSwipeUp).toBeCalledWith();
  });

  it('should execute on Swipe Down callback when a gesture is valid', () => {
    handlePanResponderEnd(
      { swipeUp: swipeDirections.swipeUp, swipeDown: swipeDirections.swipeDown, vy: 1, dx: 10, dy: 1 },
      mockedHandleSwipeUp,
      mockedHandleSwipeDown
    );
    expect(mockedHandleSwipeDown).toBeCalledWith();
  });
});
