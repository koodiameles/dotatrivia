import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ImageBackground  } from 'react-native';
import bg_dota2 from '../images/bg_dota2.jpg'
import {useTranslation} from 'react-i18next';


function InfoScreen() {

  const {t, i18n} = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={bg_dota2} resizeMode="cover" style={styles.bgImage}>
        <View style={styles.container}>
          <Text style={{color:"white", fontSize:25, fontWeight: "bold", marginTop: 35}}>DotaTrivia</Text>
          <Text style={{color:"white", fontSize:12, fontWeight: "bold", marginBottom: 15 }}>Made by Jussi Junnila</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTextHeader}>{t('game info')}</Text>
            <Text style={styles.infoText}>{t('info bullet point 1')}</Text>
            <Text style={styles.infoText}>{t('info bullet point 2')}</Text>
            <Text style={styles.infoText}>{t('info bullet point 3')}</Text>
            <Text style={styles.infoText}>{t('info bullet point 4')}</Text>

            <Text style={styles.infoTextHeader}>{t('made possible by')}</Text>
            <Text style={styles.infoText}>⁍ OpenDota API  --  https://docs.opendota.com/</Text>

            <Text style={styles.infoTextHeader}>{t('art by')}</Text>
            <Text style={styles.infoText}>⁍ Background Image from wallpapercave.com. Original creator Uknown.</Text>
          </View>
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
  infoText: {
    color:"white", 
    fontSize: 16, 
    margin: 1,
  },
  infoTextHeader: {
    color:"white", 
    fontSize: 23, 
    alignSelf: "center", 
    marginTop: 25,
    marginBottom: 10
  },
  infoTextContainer: {
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default InfoScreen