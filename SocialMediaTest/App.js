import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import MainScreen from './Views/MainScreen';
import LogInScreen from './Views/LogInScreen';
import SignUpScreen from './Views/SignUpScreen';
import HomeTabs from './Views/HomeTabs'; // <-- use tabs, not single screen
import CreatePostScreen from './Views/CreatePostScreen'; // <-- create this next

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Altone-Bold': require('./assets/Altone Trial-Bold.ttf'),
    'Altone-BoldOblique': require('./assets/Altone Trial-BoldOblique.ttf'),
    'Altone-Oblique': require('./assets/Altone Trial-Oblique.ttf'),
    'Altone-Regular': require('./assets/Altone Trial-Regular.ttf'),
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeTabs} /> 
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
