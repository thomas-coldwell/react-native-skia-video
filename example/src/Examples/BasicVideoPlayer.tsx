import { useCallback, useEffect, useMemo, useState } from 'react';
import { createFrameDrawer, createVideoComposition } from '../helpers';
import { useVideoCompositionPlayer } from '@azzapp/react-native-skia-video';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { Canvas, Picture } from '@shopify/react-native-skia';
import ReactNativeBlobUtil, {
  type FetchBlobResponse,
} from 'react-native-blob-util';
import {
  SAMPLE_VIDEO_HEIGHT,
  SAMPLE_VIDEO_URL,
  SAMPLE_VIDEO_WIDTH,
} from '../constants';

interface CompositionPlayerProps {
  width: number;
  height: number;
  uri: string;
  frameWidth: number;
  frameHeight: number;
  duration: number;
  isPlaying: boolean;
}

const CompositionPlayer = (props: CompositionPlayerProps) => {
  const { width, height, uri, frameWidth, frameHeight, duration, isPlaying } =
    props;

  const [isReady, setIsReady] = useState(false);

  const aspectRatio = frameWidth / frameHeight;

  const outputSize = useMemo(() => {
    return {
      width: frameHeight * aspectRatio,
      height: frameHeight,
    };
  }, [frameHeight, aspectRatio]);

  const videoComposition = useMemo(() => {
    const videoComposition = createVideoComposition(uri, duration);
    console.log('Created video composition', videoComposition.duration);
    return videoComposition;
  }, [uri, duration]);

  const frameDrawer = useMemo(() => {
    return createFrameDrawer();
  }, []);

  const compositionPlayer = useVideoCompositionPlayer({
    composition: videoComposition,
    drawFrame: frameDrawer,
    width: outputSize.width,
    height: outputSize.height,
    autoPlay: false,
    isLooping: true,
    onReadyToPlay() {
      setIsReady(true);
    },
  });

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (isPlaying) {
      compositionPlayer.player?.play();
    } else {
      compositionPlayer.player?.pause();
    }
  }, [isReady, isPlaying, compositionPlayer]);

  // Canvas need to be in pixel units so we have a container to scale it to
  // the actual size of the preview window
  const containerStyle = useMemo<ViewStyle>(
    () => ({
      width,
      height,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [
        {
          scale: height / frameHeight,
        },
      ],
    }),
    [width, height, frameHeight]
  );
  const canvasStyle = useMemo<ViewStyle>(
    () => ({
      position: 'absolute',
      ...outputSize,
    }),
    [outputSize]
  );

  if (!isReady) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <Canvas style={canvasStyle}>
        <Picture picture={compositionPlayer.currentFrame} />
      </Canvas>
    </View>
  );
};

export const BasicVideoPlayer = () => {
  const [localFile, setLocalFile] = useState<string>();
  const [previewWidth, setPreviewWidth] = useState<number>();
  const [previewHeight, setPreviewHeight] = useState<number>();

  const onPreviewLayout = useCallback((event: LayoutChangeEvent) => {
    setPreviewWidth(Math.round(event.nativeEvent.layout.width));
    setPreviewHeight(Math.round(event.nativeEvent.layout.height));
  }, []);

  useEffect(() => {
    console.log('Fetching video...');
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: SAMPLE_VIDEO_URL.split('.').pop() ?? 'mp4',
    })
      .fetch('GET', SAMPLE_VIDEO_URL)
      .then((response: FetchBlobResponse) => {
        const path = response.path();
        console.log('Fetched video', path);
        setLocalFile(path);
      })
      .catch((error) => {
        console.error('Failed to fetch video', error);
      });
  }, []);

  const aspectRatio = SAMPLE_VIDEO_WIDTH / SAMPLE_VIDEO_HEIGHT;

  if (localFile == null) {
    return null;
  }

  return (
    <View style={styles.content}>
      <View style={[styles.video, { aspectRatio }]} onLayout={onPreviewLayout}>
        {previewWidth != null && previewHeight != null && (
          <CompositionPlayer
            width={previewWidth}
            height={previewHeight}
            uri={localFile}
            frameWidth={SAMPLE_VIDEO_WIDTH}
            frameHeight={SAMPLE_VIDEO_HEIGHT}
            duration={10.0}
            isPlaying={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
  },
  video: {
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
