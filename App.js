import { View, Text,StyleSheet } from 'react-native'
import  { Suspense,useEffect,useState,TextInput,Button  } from 'react'
import Avatar from './src/Avatar'
import {List,FAB } from 'react-native-paper';
import { Canvas } from '@react-three/fiber/native'
import { useDispatch,useSelector } from 'react-redux';
// import * as Speech from 'expo-speech';
import React from 'react';

const App = () => {
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

   
     <List.Section title="Audio">
      
    {/* // Placing the FAB outside the List.Section causes it to be visible all the time */}
    {/* // but still it's not visoble above the accordion  */}
      <List.Accordion
        title="Choose Script"
        expanded={expanded}
        onPress={handlePress}>
          {/* // Placing FAb inside List.Accordion causes it to be visible only when the Accordion is expanded   */}
        <List.Item title="A"  onPress={()=>{setScript('a_for_apple')}}/>
        <List.Item title="B" onPress={()=>{setScript('b_for_banana')}}/>
        {/* The buttons were added to choose the required script from the available options but there are some issues in the redux toolkit which cause an error */}

      </List.Accordion>
      <FAB
     label='Play'
    style={styles.fab}
    onPress={() => playSound()} // This function is used to play the sound
  />
     
  {/* // Ideal placement of FAB is inside the List.Section */}
    </List.Section>
    </View>
  )
}
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    // margin: 16,
    right: 0,
    bottom: 45,
  },
})

export default App
