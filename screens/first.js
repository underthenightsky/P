import {View } from 'react-native'
import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei/native';
import Sound from 'react-native-sound';
import { useFrame } from '@react-three/fiber/native';
import Avatar from '../src/NormalAvatar'
export function First ({navigation}){
    const { nodes, materials } = useGLTF(require('../public/avatar/avatar_morph_2.glb'));
    const { animations: idleAnimation } = useFBX(require('../public/avatar/Idle.fbx'));
    const { animations: angryAnimation } = useFBX(require('../public/avatar/Angry.fbx'));
    const { animations: greetAnimation } = useFBX(require('../public/avatar/Standing_Greeting.fbx'));
    const { animations: talking } = useFBX(require('../public/avatar/Talking.fbx'));
    const [animation, setAnimation] = useState('Talking');

    const corresponding = {
        A: 'viseme_PP',
        B: 'viseme_kk',
        C: 'viseme_I',
        D: 'viseme_AA',
        E: 'viseme_O',
        F: 'viseme_U',
        G: 'viseme_FF',
        H: 'viseme_TH',
        I: 'viseme_PP',
      };
    
      idleAnimation[0].name = 'Idle';
      angryAnimation[0].name = 'Angry';
      greetAnimation[0].name = 'Greet';
      talking[0].name = 'Talking';
    
      const group = useRef();
      const { actions } = useAnimations([idleAnimation[0], angryAnimation[0], greetAnimation[0], talking[0]], group);
    
      const sound = useRef(null);
      const startTime = useRef(null);
    
    
    //   useEffect(() => {
    //     actions[animation].reset().play();
    //     return () => actions[animation].fadeOut();
    //   }, [animation]);

    return (
        <View>
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
      
  <directionalLight position={[2,1,8]}/>
        <Suspense fallback={null}>
        <Avatar position={[0,-3,5]} scale ={2}/>
        </Suspense>
     </Canvas>

        </View>
    )
}