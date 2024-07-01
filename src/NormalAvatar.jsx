import React, {useRef, useState, useEffect} from 'react';
import {useGLTF, useAnimations, useFBX} from '@react-three/drei/native';
import Sound from 'react-native-sound';
import {useFrame} from '@react-three/fiber/native';
import {useDispatch} from 'react-redux';
import {setScript as setReduxScript} from '../redux_toolkit/scriptSlice';
import Voice from '@react-native-community/voice';
import Toast from 'react-native-toast-message';

export default function Avatar(props) {
  const dispatch = useDispatch();
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const text = 'S for Sun';
  const [shouldRestartRecording, setShouldRestartRecording] = useState(false);
  const [lipsync, setLipsync] = useState(null);

  const speechStartHandler = () => {
    console.log('Speech started');
  };

  const speechEndHandler = () => {
    setRecording(false);
    console.log('Speech ended');
  };

  const speechResultsHandler = e => {
    console.log('voice event', e);
    const originalMsg = e.value;
    setOriginalMessage(originalMsg);
    setMessage(originalMsg);
  };

  const speechErrorHandler = e => {
    setRecording(false);
    console.log('Speech error', e.error);
  };

  const startRecording = async () => {
    setOriginalMessage('');
    setMessage('');
    setRecording(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const {nodes, materials} = useGLTF(
    require('../public/avatar/avatar_morph_2.glb'),
  );
  const {animations: idleAnimation} = useFBX(
    require('../public/avatar/Idle.fbx'),
  );
  const {animations: angryAnimation} = useFBX(
    require('../public/avatar/Angry.fbx'),
  );
  const {animations: greetAnimation} = useFBX(
    require('../public/avatar/Standing_Greeting.fbx'),
  );
  const {animations: talking} = useFBX(require('../public/avatar/Talking.fbx'));
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
  const {actions} = useAnimations(
    [idleAnimation[0], angryAnimation[0], greetAnimation[0], talking[0]],
    group,
  );

  const sound = useRef(null);
  const startTime = useRef(null);
  const [script, setScript] = useState('letter_s');

  useEffect(() => {
    const loadLipsync = async () => {
      const present_script = `${script}.mp3`;
      sound.current = new Sound(present_script, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        console.log(
          'duration in seconds: ' +
            sound.current.getDuration() +
            'number of channels: ' +
            sound.current.getNumberOfChannels(),
        );

        sound.current.play(success => {
          if (success) {
            console.log('successfully finished playing');
            setAnimation('Idle');
            if (script === 'letter_s' || script === 'try_again') {
              startRecording();
              console.log('mic on after script');
            }
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });

        startTime.current = Date.now();
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;
      });

      if (script === 'letter_s') {
        const lipsyncData = await import(`../public/voice_recordings/letter_s.json`);
        setLipsync(lipsyncData);
      } else if(script === 'try_again') {
        const lipsyncData = await import(`../public/voice_recordings/try_again.json`);  
        setLipsync(lipsyncData);
      } else if(script === 'fantastic') {
        const lipsyncData = await import(`../public/voice_recordings/fantastic.json`);  
        setLipsync(lipsyncData);
      } else {  
        console.error('Failed to load lipsync data:', error);
      }
      
    };

    loadLipsync();

    return () => {
      if (sound.current) {
        sound.current.release();
      }
    };
  }, [script]);

  useEffect(() => {
    if (message) {
      if (compareText()) {
        console.log('correct');
        Toast.show({
          type: 'success',
          text1: 'The sentence is correct',
          visibilityTime: 2000,
        });
        setScript('fantastic');
      } else {
        console.log('incorrect');
        Toast.show({
          type: 'error',
          text1: 'The sentence is incorrect',
          visibilityTime: 2000,
        });

        setScript('try_again');
        setShouldRestartRecording(true);
      }
    }
  }, [message]);

  useEffect(() => {
    if (shouldRestartRecording) {
      setShouldRestartRecording(false);
      stopRecording().then(() => {
        const tryAgainScript = 'try_again.mp3';
        sound.current = new Sound(tryAgainScript, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          sound.current.play(success => {
            if (success) {
              console.log('successfully finished playing');
              startRecording();
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });

          import(`../public/voice_recordings/try_again.json`)
            .then(lipsyncData => {
              setLipsync(lipsyncData);
              startTime.current = Date.now();
            })
            .catch(error => {
              console.error('Failed to load lipsync data:', error);
            });
        });
      });
    }
  }, [shouldRestartRecording]);

  const compareText = () => {
    const trimmedText = text.replace(/\s+/g, '').toLowerCase();
    console.log('trimmed text', trimmedText);
    console.log('message', message);
    for (let i = 0; i < message.length; i++) {
      message[i] = message[i].replace(/\s+/g, '').toLowerCase();
      if (message[i].localeCompare(trimmedText) === 0) {
        return true;
      }
    }
    return false;
  };

  useFrame(() => {
    if (!startTime.current || !lipsync) return;
    const elapsedTime = (Date.now() - startTime.current) / 1000;

    // Reset all visemes
    Object.values(corresponding).forEach(value => {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = 0;
    });

    const currentCue = lipsync.mouthCues.find(
      cue => elapsedTime >= cue.start && elapsedTime <= cue.end,
    );
    if (currentCue) {
      const viseme = corresponding[currentCue.value];
      if (viseme) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[viseme]
        ] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
        ] = 1;
      }
    }
  });

  useEffect(() => {
    actions[animation].reset().play();
    return () => actions[animation].fadeOut();
  }, [animation]);

  function sounds() {
    setScript('fantastic');
  }

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
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}