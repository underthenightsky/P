import {View, Text, StyleSheet} from 'react-native';
import {Suspense, useEffect, useState, TextInput, Button} from 'react';
import Avatar from '../src/NormalAvatar';
import {List, FAB} from 'react-native-paper';
import {Canvas} from '@react-three/fiber/native';
import {useDispatch, useSelector} from 'react-redux';

export function First({navigation}) {
  
  return (
    <View style={{flex: 1}}>
      <Canvas
        Canvas
        onCreated={state => {
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
        }}>
        <directionalLight position={[2, 1, 8]} />
        <Suspense fallback={null}>
          <Avatar position={[0, -3, 5]} scale={2} />
        </Suspense>
      </Canvas>
      <FAB label="S for Sun" style={styles.fab} />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    // margin: 16,
    right: 130,
    bottom: 60,
  },
});
