import { useCallback, useMemo, useState } from 'react';
import { createFrameDrawer, createVideoComposition } from '../helpers';
import {
  SAMPLE_VIDEO_HEIGHT,
  SAMPLE_VIDEO_URL,
  SAMPLE_VIDEO_WIDTH,
} from '../constants';
import { Alert, Button, Platform, Text } from 'react-native';
import {
  exportVideoComposition,
  getValidEncoderConfigurations,
} from '@azzapp/react-native-skia-video';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Video from 'react-native-video';

const frameDrawer = createFrameDrawer();
const outPath =
  ReactNativeBlobUtil.fs.dirs.CacheDir + '/' + Date.now() + '.mp4';

export const BasicVideoComposition = () => {
  const [isRendering, setIsRendering] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const videoComposition = useMemo(() => {
    const composition = createVideoComposition(SAMPLE_VIDEO_URL, 10);
    return composition;
  }, []);

  const render = useCallback(() => {
    const requestedConfig = {
      bitRate: 5_000_000,
      frameRate: 30,
      height: SAMPLE_VIDEO_HEIGHT,
      width: SAMPLE_VIDEO_WIDTH,
    };
    const validConfigs =
      Platform.OS === 'android'
        ? getValidEncoderConfigurations(
            requestedConfig.width,
            requestedConfig.height,
            requestedConfig.frameRate,
            requestedConfig.bitRate
          )
        : [requestedConfig];
    if (!validConfigs || validConfigs.length === 0) {
      return Alert.alert("Couldn't find a valid encoder configuration");
    }
    const encoderConfig = validConfigs[0];
    setIsRendering(true);
    exportVideoComposition(
      videoComposition,
      {
        width: SAMPLE_VIDEO_WIDTH,
        height: SAMPLE_VIDEO_HEIGHT,
        frameRate: 30,
        bitRate: 5_000_000,
        outPath,
        ...encoderConfig,
      },
      frameDrawer
    ).then(() => {
      setIsRendering(false);
      setIsFinished(true);
    });
  }, [videoComposition]);

  if (!isRendering && !isFinished) {
    return <Button title="Render" onPress={render} />;
  }

  if (isRendering) {
    return <Text>Rendering...</Text>;
  }

  return (
    <Video
      source={{ uri: outPath }}
      style={{ width: '100%', aspectRatio: 16 / 9 }}
      paused={false}
      repeat={true}
    />
  );
};
