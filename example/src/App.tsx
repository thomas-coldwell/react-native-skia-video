import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Home/Home';
import { Route } from './types';
import { BasicVideoPlayer } from './Examples/BasicVideoPlayer';
import { BasicVideoComposition } from './Examples/BasicVideoComposition';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={Route.Home}
          options={{ title: 'Home' }}
          component={Home}
        />
        <Stack.Screen
          name={Route.BasicVideoPlayer}
          options={{ title: 'Video Player Example' }}
          component={BasicVideoPlayer}
        />
        <Stack.Screen
          name={Route.BasicVideoComposition}
          options={{ title: 'Video Composition Example' }}
          component={BasicVideoComposition}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
