import React, { useRef,useState,useEffect, useMemo } from 'react'
import { useGLTF,useAnimations,useFBX } from '@react-three/drei/native'
import Sound from 'react-native-sound';
import { useSelector } from 'react-redux';
import { useTimer } from 'use-timer';
import { StyleSheet,View } from 'react-native';
import { current } from '@reduxjs/toolkit';

export default function Avatar(props) {
  const { nodes, materials } = useGLTF(require('./avatar.glb'));
  const {animations:idleAnimation} = useFBX(require('../public/avatar/Idle.fbx'));
  const {animations:angryAnimation} = useFBX(require('../public/avatar/Angry.fbx'));
  const {animations:greetAnimation} = useFBX(require('../public/avatar/Standing_Greeting.fbx'));
  const [animation,setAnimation] = useState("Idle");


 const lipsync =  require('../public/voice_recordings/a_for_apple.json');
 // json mouth cues for the sound

  
  // console.log(lipsync.mouthCues[lipsync.mouthCues.length-1].end); value for last mouth cue from 
  // the json file  for the sound 
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

  
  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetAnimation[0].name = "Greet";
// Animations available for the avatar  

  const[playAudio,setPlayAudio] = useState(false);
  const script =useSelector(state=>state);
  // console.log(script);
  const group = useRef();
  const {actions}=useAnimations([idleAnimation[0],angryAnimation[0],greetAnimation[0]],group);

//   useEffect(()=>{ 
//     const currentTime = Date.now() ;
//   while((Date.now()-currentTime)/1000<lipsync.mouthCues[lipsync.mouthCues.length-1].end ){
//    const mouthCue = lipsync.mouthCues.filter((mouthCue) => mouthCue.start <= (Date.now()-currentTime)/1000 && mouthCue.end >= (Date.now()-currentTime)/1000);
//      console.log(mouthCue[0].value,Date.now()-currentTime);
  //   }
// },[]);// 
// The above piece of code is used to to print the sound cues from the json file for the sound


// const {time, start,pause,reset,status} =useTimer();
// The above piece of code has been created to stop the useFrame function from running beyond the required time limit

const currentTime = Date.now() ;

// useFrame (()=>{
//   Object.values(corresponding).forEach((value)=>{
//     nodes.Wolf3D_Head.morphTargetInfluences[
//       nodes.Wolf3D_Head.morphTargetDictionary[value]
//     ]=0;
//     nodes.Wolf3D_Teeth.morphTargetInfluences[
//       nodes.Wolf3D_Teeth.morphTargetDictionary[value]
//     ]=0;
//   });

//   // nodes.Wolf3D_Head.morphTargetInfluences[
//   //   nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
//   //  ]=0;
//   //   nodes.Wolf3D_Teeth.morphTargetInfluences[
//   //     nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
//   //   ]=0;

//        const mouthCue = lipsync.mouthCues.filter((mouthCue) => mouthCue.start <= (Date.now()-currentTime)/5000 && mouthCue.end >= (Date.now()-currentTime)/5000);
//        if(mouthCue=== null){
//     console.log(mouthCue,Date.now()-currentTime);
//          nodes.Wolf3D_Head.morphTargetInfluences[
//           nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
//          ]=1;
//           nodes.Wolf3D_Teeth.morphTargetInfluences[
//             nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
//           ]=1;
//           currentMouthCue = mouthCue[0].value;
       
    
//         }
//       });
// });


useEffect(()=>{
  actions[animation].reset().fadeIn(0.5).play();
  return () => actions[animation].fadeOut(0.5);
},[]); // To load the animation for the avatar, it originally loads the idle animation and changed based on the 
        // the animation variable 


// changeAnimation function , I had hoped it would be helpful to change the animation based on the sound cues
function changeAnimation(){
  const mouthCue = lipsync.mouthCues.filter((mouthCue) => mouthCue.start <= (Date.now()-currentTime)/5000 && mouthCue.end >= (Date.now()-currentTime)/5000);
  if(mouthCue=== null){
console.log(mouthCue,Date.now()-currentTime);
    nodes.Wolf3D_Head.morphTargetInfluences[
     nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
    ]=1;
     nodes.Wolf3D_Teeth.morphTargetInfluences[
       nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
     ]=1;
     currentMouthCue = mouthCue[0].value;
  

   }
 };


 // The following useEffect function was  designed  to change the animation based on the sound cues
 // It was not successful in changing the animation based on the sound cues and does nothing except load the idle animation with smile

useEffect(()=>{
  console.log(nodes.Wolf3D_Head.morphTargetDictionary);
  nodes.Wolf3D_Head.morphTargetInfluences[
    nodes.Wolf3D_Head.morphTargetDictionary["mouthSmile"]
  ]=1;
  Object.values(corresponding).forEach((value)=>{
    nodes.Wolf3D_Head.morphTargetInfluences[
      nodes.Wolf3D_Head.morphTargetDictionary[value]
    ]=0;
    nodes.Wolf3D_Teeth.morphTargetInfluences[
      nodes.Wolf3D_Teeth.morphTargetDictionary[value]
    ]=0;
  });

 

       const mouthCue = lipsync.mouthCues.filter((mouthCue) => mouthCue.start <= (Date.now()-currentTime)/5000 && mouthCue.end >= (Date.now()-currentTime)/5000);
       if(mouthCue=== null){
    console.log(mouthCue,Date.now()-currentTime);
         nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
         ]=1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
          ]=1;
          currentMouthCue = mouthCue[0].value;     
    
        }

},[lipsync.mouthCues[lipsync.mouthCues.length-1].end*100>Date.now()-currentTime?Date.now()-currentTime:null])



 

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
   
  )
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 45,
  },
})
useGLTF.preload('../public/avatar/avatar_morph_2.glb')

