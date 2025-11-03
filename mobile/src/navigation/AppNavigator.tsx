import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../services/AuthContext';
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import StartCardCounting from '../screens/StartCardCounting';
import BlackjackBasics from '../screens/BlackjackBasics';
import CardCountingBasics from '../screens/CardCountingBasics';
import SimulationPractice from '../screens/SimulationPractice';
import BankrollManagement from '../screens/BankrollManagement';
import AdvancedTechniques from '../screens/AdvancedTechniques';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import ProgressTracking from '../screens/ProgressTracking';
import BettingCalculator from '../screens/BettingCalculator';
import RiskCalculator from '../screens/RiskCalculator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Auth" component={Auth} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator
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
      <AppStack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Variance' }}
      />
      <AppStack.Screen
        name="StartCardCounting"
        component={StartCardCounting}
        options={{ title: 'Start Card Counting' }}
      />
      <AppStack.Screen
        name="BlackjackBasics"
        component={BlackjackBasics}
        options={{ title: 'Blackjack Basics' }}
      />
      <AppStack.Screen
        name="CardCounting"
        component={CardCountingBasics}
        options={{ title: 'Card Counting' }}
      />
      <AppStack.Screen
        name="Simulations"
        component={SimulationPractice}
        options={{ title: 'Simulations' }}
      />
      <AppStack.Screen
        name="BankrollManagement"
        component={BankrollManagement}
        options={{ title: 'Bankroll Management' }}
      />
      <AppStack.Screen
        name="AdvancedTechniques"
        component={AdvancedTechniques}
        options={{ title: 'Advanced Techniques' }}
      />
      <AppStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      <AppStack.Screen
        name="Settings"
        component={Settings}
        options={{ title: 'Settings' }}
      />
      <AppStack.Screen
        name="ProgressTracking"
        component={ProgressTracking}
        options={{ title: 'Progress Tracking' }}
      />
      <AppStack.Screen
        name="BettingCalculator"
        component={BettingCalculator}
        options={{ title: 'Betting Calculator' }}
      />
      <AppStack.Screen
        name="RiskCalculator"
        component={RiskCalculator}
        options={{ title: 'Risk Calculator' }}
      />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
