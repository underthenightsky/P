/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PaperProvider } from 'react-native-paper';
import MyStore from './redux_toolkit/MyStore';
import {Provider} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {First} from './screens/first';
import Welcome from './screens/welcome';
import {NavigationContainer} from '@react-navigation/native';
import Second from './screens/second';

const Stack = createStackNavigator();
export default function Main() {
    return (
        <Provider store={MyStore}>
        <PaperProvider>
            <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name='Welcome' component={Welcome}/>
                <Stack.Screen name='Introduction' component={App}/>
                <Stack.Screen name ='First' component ={First}/>
                <Stack.Screen name ='Second' component ={Second}/>
            </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
        </Provider>
    );
    
}
AppRegistry.registerComponent(appName, () => Main);
