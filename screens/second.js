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
    {
      files: 'jithu_intro.mp3',
      require: '../public/voice_recordings/jithu_intro.json',
    },
    {
      files: 'letter_s.mp3',
      require: '../public/voice_recordings/letter_s.json',
    },
    {file: 's2.mp3', json: require('../public/voice_recordings/s2.json')},
    {file: 's3.mp3', json: require('../public/voice_recordings/s3.json')},
    {file: 's4.mp3', json: require('../public/voice_recordings/s4.json')},
    {file: 's5.mp3', json: require('../public/voice_recordings/s5.json')},
    {file: 's6.mp3', json: require('../public/voice_recordings/s6.json')},
    {file: 's7.mp3', json: require('../public/voice_recordings/s7.json')},
    {file: 's8.mp3', json: require('../public/voice_recordings/s8.json')},
    {file: 's9.mp3', json: require('../public/voice_recordings/s9.json')},
    {file: 's10.mp3', json: require('../public/voice_recordings/s10.json')},
    {file: 's11.mp3', json: require('../public/voice_recordings/s11.json')},
    {file: 's12.mp3', json: require('../public/voice_recordings/s12.json')},
    {file: 's13.mp3', json: require('../public/voice_recordings/s13.json')},
    {file: 's14.mp3', json: require('../public/voice_recordings/s14.json')},
    {file: 's15.mp3', json: require('../public/voice_recordings/s15.json')},
    {file: 's16.mp3', json: require('../public/voice_recordings/s16.json')},
    {file: 's17.mp3', json: require('../public/voice_recordings/s17.json')},
    {file: 's18.mp3', json: require('../public/voice_recordings/s18.json')},
    {file: 's19.mp3', json: require('../public/voice_recordings/s19.json')},
    {file: 's20.mp3', json: require('../public/voice_recordings/s20.json')},
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
