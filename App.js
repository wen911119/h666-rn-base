import 'react-native-gesture-handler';
import * as React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

// const HOST = 'http://192.168.1.8:3000';
// const HOST = 'https://qc-live-conference-dev.quancheng-ec.com';
const HOST = 'https://h666-demo.ruiyun2015.com';
import WebContainer from './container';

function HomeScreen({navigation, route}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen{route.params ? route.params.age : 9}</Text>
      <Button
        title="Go to H666"
        onPress={() =>
          navigation.push('WebContainer', {
            url: `${HOST}?_c=rn`,
          })
        }
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '主页'}}
        /> */}
        <Stack.Screen
          name="h666Container"
          component={WebContainer}
          initialParams={{
            host: HOST,
            page: 'index',
            headerConfig: {
              title: 'h666演示',
              bgColor: '#f8584f',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
