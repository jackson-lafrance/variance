import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import StartCardCounting from '../screens/StartCardCounting';
import BlackjackBasics from '../screens/BlackjackBasics';
import CardCountingBasics from '../screens/CardCountingBasics';
import SimulationPractice from '../screens/SimulationPractice';
import BankrollManagement from '../screens/BankrollManagement';
import AdvancedTechniques from '../screens/AdvancedTechniques';
import Dashboard from '../screens/Dashboard';

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
          component={CardCountingBasics}
          options={{ title: 'Card Counting' }}
        />
        <Stack.Screen
          name="Simulations"
          component={SimulationPractice}
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
