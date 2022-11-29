import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import GameScreen from './components/GameScreen';
import ScoreScreen from './components/ScoreScreen';
import Info from './components/InfoScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import './languageSettings/i18n';
import {useTranslation} from 'react-i18next';



const Tab = createMaterialBottomTabNavigator();

export default function App() {


  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('en');
  const changeLanguage = (lang) => {
    i18n
      .changeLanguage(lang)
      .then(() => setLanguage(lang))
      .catch(err => console.log(err));
  };
  

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="GameScreen"
          activeColor="white"
          inactiveColor="grey"
          barStyle={{ backgroundColor: '#330000'}}
          labelStyle={{fontSize: 30}}
        >
          <Tab.Screen name="GameScreen" /* component={GameScreen} */
            children={()=><GameScreen currentLanguage={currentLanguage} changeLanguage={changeLanguage}/>}
            options={{
              tabBarLabel: <Text style={{ fontSize: 17 }}>{t('game')}</Text>,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="arch" color={color} size={27}/>
              ),
            }}
          />
          <Tab.Screen name="ScoreScreen" component={ScoreScreen} 
            options={{
              tabBarLabel: <Text style={{ fontSize: 17 }}>{t('score')}</Text>,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="trophy" color={color} size={27} />
              ),
            }}
          />
          <Tab.Screen name="Info" component={Info} 
            options={{
              tabBarLabel: <Text style={{ fontSize: 17 }}>{t('info')}</Text>,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="alert-octagram" color={color} size={27} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
