/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PaperProvider } from 'react-native-paper';
import MyStore from './redux_toolkit/MyStore';
import {Provider} from 'react-redux';

export default function Main() {
    return (
        <Provider store={MyStore}>
        <PaperProvider>
        <App />
        </PaperProvider>
        </Provider>
    );
    
}
AppRegistry.registerComponent(appName, () => Main);
