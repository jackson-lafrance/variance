import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import StartCardCounting from '../screens/StartCardCounting';

// Placeholder screens - to be implemented
const BlackjackBasics = () => null;
const CardCounting = () => null;
const Simulations = () => null;
const BankrollManagement = () => null;
const AdvancedTechniques = () => null;
const Dashboard = () => null;

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Variance' }}
        />
        <Stack.Screen
          name="StartCardCounting"
          component={StartCardCounting}
          options={{ title: 'Start Card Counting' }}
        />
        <Stack.Screen
          name="BlackjackBasics"
          component={BlackjackBasics}
          options={{ title: 'Blackjack Basics' }}
        />
        <Stack.Screen
          name="CardCounting"
          component={CardCounting}
          options={{ title: 'Card Counting' }}
        />
        <Stack.Screen
          name="Simulations"
          component={Simulations}
          options={{ title: 'Simulations' }}
        />
        <Stack.Screen
          name="BankrollManagement"
          component={BankrollManagement}
          options={{ title: 'Bankroll Management' }}
        />
        <Stack.Screen
          name="AdvancedTechniques"
          component={AdvancedTechniques}
          options={{ title: 'Advanced Techniques' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: 'Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

