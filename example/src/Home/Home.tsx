import { Route } from '../types';
import { useEffect, useState } from 'react';
import { getDecodingCapabilitiesFor } from '@azzapp/react-native-skia-video';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Item } from './Item';

interface ItemDetails {
  title: string;
  emoji: string;
  description: string;
  route: Route;
  testId?: string;
}

const items: ItemDetails[] = [
  {
    title: 'Basic Video Player',
    emoji: '📺',
    description: 'A basic video player example',
    route: Route.BasicVideoPlayer,
  },
  {
    title: 'Basic Video Composition',
    emoji: '🎞',
    description: 'A basic video composition example',
    route: Route.BasicVideoComposition,
  },
];

export const Home = () => {
  const [supportedDecoder, setSupportedDecoder] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const decodingCapabilities = getDecodingCapabilitiesFor('video/avc');
      setSupportedDecoder(
        decodingCapabilities
          ? `Resolution:${decodingCapabilities.maxWidth}x${decodingCapabilities.maxHeight}` +
              `\nMaxPlayer : ${decodingCapabilities.maxInstances}`
          : 'No decoder found for video/avc'
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Encoder Details:</Text>
      {supportedDecoder && <Text>Supported Decoder: {supportedDecoder}</Text>}
      <Text style={styles.heading}>Examples:</Text>
      <ScrollView style={styles.scroll}>
        {items.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
    padding: 16,
  },
});
