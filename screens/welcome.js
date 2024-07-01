import React from 'react';
import { View, Button, StyleSheet,Text } from 'react-native';

const Welcome = ({ navigation }) => {
  const navigateToIntroScreen = () => {
    navigation.navigate('Introduction');
  };

  return (
    <View style={styles.container}>
        <Text>
            Welcome to our App
        </Text>
      <Button title="Next" onPress={navigateToIntroScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Welcome;