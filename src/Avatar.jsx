import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei/native';
import Sound from 'react-native-sound';
import { useFrame } from '@react-three/fiber/native';

export default function Avatar(props) {
  const { nodes, materials } = useGLTF(require('../public/avatar/avatar_morph_2.glb'));
  const { animations: idleAnimation } = useFBX(require('../public/avatar/Idle.fbx'));
  const { animations: angryAnimation } = useFBX(require('../public/avatar/Angry.fbx'));
  const { animations: greetAnimation } = useFBX(require('../public/avatar/Standing_Greeting.fbx'));
  const { animations: talking } = useFBX(require('../public/avatar/Talking.fbx'));
  const [animation, setAnimation] = useState('Talking');

  const lipsync = require('../public/voice_recordings/fin_introduction.json');

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


 
  
  useEffect(() => {
    sound.current = new Sound('fin_introduction.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log('duration in seconds: ' + sound.current.getDuration() + 'number of channels: ' + sound.current.getNumberOfChannels());

      sound.current.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          setAnimation('Idle');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });

      startTime.current = Date.now();
    });

    return () => {
      if (sound.current) {
        sound.current.release();
      }
    };
  }, []);

  useEffect(() => {
    actions[animation].reset().play();
    return () => actions[animation].fadeOut();
  }, [animation]);

  useFrame(() => {
    if (!startTime.current) return;
    const elapsedTime = (Date.now() - startTime.current) / 1000;

    // Reset all visemes
    Object.values(corresponding).forEach((value) => {
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
    });

    // Find the current mouth cue based on elapsed time
    const currentCue = lipsync.mouthCues.find((cue) => elapsedTime >= cue.start && elapsedTime <= cue.end);
    if (currentCue) {
      const viseme = corresponding[currentCue.value];
      if (viseme) {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[viseme]] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]] = 1;
      }
    }
  });



return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}
