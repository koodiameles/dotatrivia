import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ImageBackground, ScrollView   } from 'react-native';
import { ListItem } from'react-native-elements';
import bg_dota2 from '../images/bg_dota2.jpg'
import { getDatabase, ref, onValue } from'firebase/database';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebaseConfig';
import { useTranslation } from 'react-i18next';


function ScoreScreen() {

  const {t, i18n} = useTranslation();
  const [scoreList, setScoreList] = useState([])

  // <FIREBASE
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  
  // FIREBASE DATABASE FUNCIONS
  // update view
  useEffect(() => {
    const scoresRef = ref(database, 'highscorelist/');  
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      const scores = data ? Object.keys(data).map(key=> ({key, ...data[key]})) : []; 
      let highestToLowerstScores = scores.sort((a, b) => {return b.score - a.score;});
      let top15 = highestToLowerstScores.slice(0,15)
      setScoreList(top15)
    })
  }, []);
  // FIREBASE />

  const mapThroughScores = (scoreList) => {
    return(
      scoreList.map((player, i) => (
        <ListItem 
          key={player.key}
          bottomDivider
          containerStyle={{backgroundColor: 'transparent', flexDirection: "row", justifyContent: 'space-between'}}
        >
          <ListItem.Title style={{ color: '#ffff00', fontSize: 24 }}>
          {i+1}. {player.name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: '#ffff00', fontSize: 26}}>
          {player.score}
          </ListItem.Subtitle>
        </ListItem>
      ))
    )
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={bg_dota2} resizeMode="cover" style={styles.bgImage}>
        <View style={styles.container2}>
          <Text style={{color:"white", fontSize:30, fontWeight: "bold", alignSelf: "center", marginTop: 30}}>{t('scorescreen')}</Text>
          <Text style={{color:"white", fontSize:16, alignSelf: "center" }}>Top 15</Text>
          <ListItem 
            containerStyle={{backgroundColor: 'transparent', flexDirection: "row", justifyContent: 'space-between'}}
            bottomDivider
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22}}>
            {t('player name')}
            </Text>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24}}>
            {t('score_capital')}
            </Text>
          </ListItem>
          <ScrollView >
           {mapThroughScores(scoreList)}
          </ScrollView>
        </View>
      </ImageBackground>
  </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center"
  },
  container2: {
    flex: 1,
  },
});

export default ScoreScreen