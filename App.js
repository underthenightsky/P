import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import  { Suspense,useEffect,useState,TextInput,Button  } from 'react'
import Avatar from './src/Avatar'
import {List,FAB } from 'react-native-paper';
import { Canvas } from '@react-three/fiber/native'
import { useDispatch,useSelector } from 'react-redux';
// import * as Speech from 'expo-speech';
import React from 'react';

const App = ({navigation}) => {
  const[name , setName ] = useState('');
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  const dispatch = useDispatch();
// The following function is used to set the script for the avatar

  const setScript =(item)=>{
    dispatch(setScript({script:item,playAudio:false}));
     currentScript =useSelector(state=>state.datas);
    console.log(currentScript);


  }; 
  // The following was initially designed to communicate to the Avatar.jsx file 
  const setPlayAudio =()=>{
    dispatch(setPlayAudio({script:'a_for_apple',playAudio:true}));

    console.log("Playing Audio");
  };


  // the function below is used to play the sound
const playSound = () => {
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
  }
   

  return (
    <View style ={{flex:1}}>
     <Canvas  Canvas
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

   
     <FAB label='Next' style={styles.fab}
     onPress={()=>
      navigation.navigate('First')
     } />
    </View>
  )
}
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    // margin: 16,
    right: 0,
    bottom: 60,
  },
})

export default App
