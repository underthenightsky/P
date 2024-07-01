import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { FAB } from 'react-native-paper';
import Avatar from '../src/ThirdAvatar'; 
import { useSelector } from 'react-redux';

const Second = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0); // State to manage current index
  const [isPlaying, setIsPlaying] = useState(false); // State to manage playing state

  const audioFiles = [
    { file: 's2.mp3', json: require('../public/voice_recordings/s2.json') },
    { file: 's3.mp3', json: require('../public/voice_recordings/s3.json') },
    { file: 's4.mp3', json: require('../public/voice_recordings/s4.json') },
  ];

  // Function to handle "Next" button press
  const handleNext = () => {
    if (currentAudioIndex < audioFiles.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else {
      navigation.navigate('NextScreen');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        onCreated={(state) => {
          const _gl = state.gl.getContext();
          const pixelStorei = _gl.pixelStorei.bind(_gl);

          _gl.pixelStorei = function (...args) {
            const [parameter] = args;
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args);
              default:
            }
          };
        }}
      >
        <directionalLight position={[2, 1, 8]} />
        <Suspense fallback={null}>
          <Avatar
            loading={loading}
            setLoading={setLoading}
            currentAudioIndex={currentAudioIndex}
            isPlaying={isPlaying}
            audioFiles={audioFiles}
          />
        </Suspense>
      </Canvas>
      <FAB label="Next" style={styles.fab} onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 130,
    bottom: 60,
  },
});

export default Second;
