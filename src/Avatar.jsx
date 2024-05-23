import React, { useRef,useState,useEffect, useMemo } from 'react'
import { useGLTF,useAnimations,useFBX } from '@react-three/drei/native'
import Sound from 'react-native-sound';
import { useSelector } from 'react-redux';
import { useTimer } from 'use-timer';
import { StyleSheet,View } from 'react-native';
import { useFrame } from '@react-three/fiber/native';

export default function Avatar(props) {
  const { nodes, materials } = useGLTF(require('../public/avatar/avatar_morph_2.glb'));
  const {animations:idleAnimation} = useFBX(require('../public/avatar/Idle.fbx'));
  const {animations:angryAnimation} = useFBX(require('../public/avatar/Angry.fbx'));
  const {animations:greetAnimation} = useFBX(require('../public/avatar/Standing_Greeting.fbx'));
  const {animations:talking} = useFBX(require('../public/avatar/Talking.fbx'));
  const [animation,setAnimation] = useState("Talking");


 const lipsync =  require('../public/voice_recordings/fin_introduction.json');
 // json mouth cues for the sound

  
  // console.log(lipsync.mouthCues[lipsync.mouthCues.length-1].end); value for last mouth cue from 
  // the json file  for the sound 

  // The following array is used to convert the moth cue 
  //  values from the json file to the corresponding viseme values
const corresponding ={
  A:"viseme_PP",
  B:"viseme_kk",
  C:"viseme_I",
  D:"viseme_AA",
  E:"viseme_O",
  F:"viseme_U",
  G:"viseme_FF",
  H:"viseme_TH",
  I:"viseme_PP",
};
// An array of all the viseme value availabel to us
const corresponding_arr =["viseme_PP","viseme_kk","viseme_I","viseme_AA","viseme_O","viseme_U",
"viseme_FF","viseme_TH","viseme_PP"];  


  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetAnimation[0].name = "Greet";
  talking[0].name = "Talking";
// Animations available for the avatar  


  // console.log(script);
  const group = useRef();
  const {actions}=useAnimations([idleAnimation[0],angryAnimation[0],greetAnimation[0],talking[0]],group);

  var currentTime = Date.now() ;

  

//   useEffect(()=>{ 
//     const currentTime = Date.now() ;
//   while((Date.now()-currentTime)/1000<lipsync.mouthCues[lipsync.mouthCues.length-1].end ){
//    const mouthCue = lipsync.mouthCues.filter((mouthCue) => mouthCue.start <= (Date.now()-currentTime)/1000 && mouthCue.end >= (Date.now()-currentTime)/1000);
//      console.log(mouthCue[0].value,Date.now()-currentTime);
  //   }
// },[]);// 
// The above piece of code is used to to print the sound cues from the json file for the sound


// Use Frame re-rennders the model each frame
// This function randomly selects a viseme value from the array of viseme values
// using a setTimeout caused the mothciues to not change
useFrame ((state,delta =1)=>{
  Object.values(corresponding).forEach((value)=>{
    nodes.Wolf3D_Head.morphTargetInfluences[
      nodes.Wolf3D_Head.morphTargetDictionary[value]
    ]=0;
    nodes.Wolf3D_Teeth.morphTargetInfluences[
      nodes.Wolf3D_Teeth.morphTargetDictionary[value]
    ]=0;
  });
 const chosenViseme = corresponding_arr[Math.floor(Math.random()*corresponding_arr.length)];
    nodes.Wolf3D_Head.morphTargetInfluences[
      nodes.Wolf3D_Head.morphTargetDictionary[chosenViseme]
     ]=1;
     nodes.Wolf3D_Teeth.morphTargetInfluences[
      nodes.Wolf3D_Teeth.morphTargetDictionary[chosenViseme]
     ]=1
      });


  // The following piece of code is used to change the mouth cues based on the json file for the sound
  // but it causes the model to load after the sound has been played 

  //     useFrame ((state, delta, xrFrame)=>{
  // while ((Date.now()-currentTime)/1000<lipsync.mouthCues[lipsync.mouthCues.length-1].end){
   
  // Object.values(corresponding).forEach((value)=>{
  //   nodes.Wolf3D_Head.morphTargetInfluences[
  //     nodes.Wolf3D_Head.morphTargetDictionary[value]
  //   ]=0;
  //   nodes.Wolf3D_Teeth.morphTargetInfluences[
  //     nodes.Wolf3D_Teeth.morphTargetDictionary[value]
  //   ]=0;
  // });

 
  //       //  nodes.Wolf3D_Head.morphTargetInfluences[
  //       //   nodes.Wolf3D_Head.morphTargetDictionary[corresponding_arr[Math.floor(Math.random()*corresponding_arr.length)]]
  //       //  ]=1;
  //        var currentMouthCue=lipsync.mouthCues.filter((mouthCue) => mouthCue.start <= (Date.now()-currentTime)/1000 && mouthCue.end >= (Date.now()-currentTime)/1000)
  //       //  console.log(currentMouthCue,corresponding[currentMouthCue[0].value]);
  //        var visemeMouthCue = corresponding[currentMouthCue[0].value];
  //        if (typeof visemeMouthCue === undefined){
  //         visemeMouthCue = "viseme_PP";
  //        }
  //        nodes.Wolf3D_Head.morphTargetInfluences[
  //         nodes.Wolf3D_Head.morphTargetDictionary[corresponding[visemeMouthCue]]
  //        ]=1;
  //        nodes.Wolf3D_Teeth.morphTargetInfluences[
  //         nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[visemeMouthCue]]
  //        ]=1;
  //       }   
  //       if ((Date.now()-currentTime)/1000>=lipsync.mouthCues[lipsync.mouthCues.length-1].end){
  //         currentTime=Date.now();
  //       }
  //     });




useEffect(()=>{
  actions[animation].reset().play();
  
  return () => actions[animation].fadeOut();
},[animation]); 



useEffect(()=>{
  console.log(nodes.Wolf3D_Head.morphTargetDictionary);
  nodes.Wolf3D_Head.morphTargetInfluences[
    nodes.Wolf3D_Head.morphTargetDictionary["mouthSmile"]
  ]=1;
  var whoosh = new Sound('fin_introduction.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
  
    // Play the sound with an onEnd callback
    whoosh.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  });
setAnimation['Idle'];
// Changing the animation to idle after the sound has been played
},[])
 

  return (
    
    <group {...props} dispose={null}  ref={group}    >
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
   
  )
};


useGLTF.preload('../public/avatar/avatar_morph_2.glb')

