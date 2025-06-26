import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

interface BackgroundImageProps {
  children: React.ReactNode;
  style?: any;
}

export default function BackgroundImage({ children, style }: BackgroundImageProps) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/EDA46302-6084-4905-B7E9-D70A00AC3410.jpg' }}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});