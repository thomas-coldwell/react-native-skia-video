import type {
  FrameDrawer,
  VideoComposition,
} from '@azzapp/react-native-skia-video';
import { rect, Skia } from '@shopify/react-native-skia';

export const createVideoComposition = (
  uri: string,
  duration: number
): VideoComposition => {
  return {
    duration: Math.floor(duration),
    items: [
      {
        id: 'source',
        path: uri.startsWith('file://') ? uri.split('file://')[1]! : uri,
        compositionStartTime: 0,
        startTime: 0,
        duration: Math.floor(duration),
      },
    ],
  };
};

/**
 * Always use a builder function so additional context can be passed to the
 * worklet.
 */
export const createFrameDrawer = () => {
  const drawFrame: FrameDrawer = ({ canvas, frames, height, width }) => {
    'worklet';
    const frame = frames.source;

    if (frame == null) return;

    const image = Skia.Image.MakeImageFromNativeBuffer(frame.buffer);
    canvas.drawImageRect(
      image,
      rect(0, 0, frame.width, frame.height),
      rect(0, 0, width, height),
      Skia.Paint()
    );
  };

  return drawFrame;
};
