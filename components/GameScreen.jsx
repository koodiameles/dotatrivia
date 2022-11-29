import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, Pressable, ImageBackground  } from 'react-native';
import { Input, Button, Image } from'react-native-elements';
import {
  randomChoiceFromArray, 
  removeDuplicateObjectsFromArrayById,
  filterHeroList,
  generateThreeChoices,
  formatAnswerChoices,
  generateCorrectAnswer
} from './utilityCode';
import triviaQuestions from './triviaQuestions'
import bg_dota2 from '../images/bg_dota2.jpg'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebaseConfig';
import { getDatabase, push, ref } from'firebase/database';
import {useTranslation} from 'react-i18next';


function GameScreen({currentLanguage, changeLanguage}) {

  //<FIREBASE
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  //FIREBASE DATABASE FUNCIONS
  // add score to databse
  const addScoreToDatabase = (newScore, newName) => {
    push(ref(database, 'highscorelist/'),{'name': newName, 'score': newScore, });
  }
  //FIREBASE />

  const [answerOptions, setAnswerOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [correctAnswer, setCorrectAnswer] = useState([]); // NOTE! this is a list because a question MIGHT have multiple correct answers
  const [currentScore, setCurrentScore] = useState(0);
  const [gameState, setGameState] = useState("main screen") // main screen, start, running, next question, game over
  const [heroList, setHeroList] = useState([]); 
  const [playerName, setPlayerName] = useState("")
  const triviaQuestionsList = triviaQuestions.triviaQuestionsList

  const changeLangaugeHandler = () => {
    let language = currentLanguage
    if (language === "fi") {
      changeLanguage("en")
    } else if (language === "en") {
      changeLanguage("fi")
    }
  }

  const {t, i18n} = useTranslation();

  // console.log("currentQuestion", currentQuestion)
  // console.log("answerOptions", answerOptions)
  // console.log("correctAnswer", correctAnswer)
  // console.log("gameState", gameState)
  // console.log("heroList", heroList)

  const checkPlayersAnswer = (answerOption) => {
    let didPlayerAnswerCorrectly = false;
    correctAnswer.map((ca) => {
      if (ca.id === answerOption.id)
        didPlayerAnswerCorrectly = true;
    })

    if (didPlayerAnswerCorrectly) {
      console.log("correct!")
      let updateScore = 1 + currentScore;
      setCurrentScore(updateScore)
      setGameState("next question")
    } else {
      console.log("WRONG!")
      setGameState("game over")
    }
  }

  const submitScoreHandler = (command) => {
    if (command === "submit") {
      let newScore = currentScore;
      let newName = playerName;
      if (newName === "") {
        newName = "Anonymous"
      }
      addScoreToDatabase(newScore, newName);
      setCurrentScore(0);
      setGameState("main screen")
    } else if (command === "skip") {
      setCurrentScore(0);
      setGameState("main screen")
    }
  }

  useEffect(() => {
    const fetchHeroes = async () => {
      // fetch heroes from api
      const response = await fetch(`https://api.opendota.com/api/heroStats`)
      const heroes = await response.json();
      setHeroList(heroes)
    }
    fetchHeroes()
  }, [])

  useEffect(() => {
    const generateQuestionAndChoices = () => {
      // choose random question
      let question = randomChoiceFromArray(triviaQuestionsList); 

      // filter herolist with with the questions' filter data
      let filteredHeroList = filterHeroList(question, heroList);
      
      // generate 3 different options to choose from (from filtered herolist)
      let answerOptionList = generateThreeChoices(filteredHeroList);

      // format the 3 generated options
      let formattedAnswerOptionList = formatAnswerChoices(answerOptionList);

      // set the correct answer(s) using questions answerTag
      let correctAnswers = generateCorrectAnswer(question, formattedAnswerOptionList);

      // update states 
      setCurrentQuestion(question)
      setCorrectAnswer(correctAnswers)
      setAnswerOptions(formattedAnswerOptionList);
    }

    if ((gameState === "start") || (gameState === "next question")) {
      setGameState("running")
      // console.log("generate Question And Choices ... ")
      generateQuestionAndChoices()
    }

  },[gameState])

  const gameStateViews = () => {
    switch (gameState) {
      case "main screen":
        return(
          <>
          <Text style={styles.textBig}>{t('welcome')}</Text>
            <Button 
              title={t('start')}  
              titleStyle={{color: "white"}}
              buttonStyle={{backgroundColor: "#330000", borderTop:"1px solid black", borderBottom:"1px solid black", marginTop: 20, padding: 20}}
              // icon={<Icon name="head-question" size={20} color="white" type='material-community'/>}
              onPress={() => setGameState("start")}
            />
              <Button 
              title={t('change language')}  
              titleStyle={{color: "white"}}
              buttonStyle={{backgroundColor: "#331a00", borderTop:"1px solid black", borderBottom:"1px solid black", marginTop: 40, padding: 20}}
              // icon={<Icon name="head-question" size={20} color="white" type='material-community'/>}
              onPress={() => changeLangaugeHandler()}
            />
          </>
        )
      case "game over":
        return(
          <View>
            <Text style={styles.textBig}>{t('game over')}</Text>
            <Text style={styles.text}>{t('you scored')}: {currentScore} {t('points')}</Text>
            <Text style={styles.text}>{t('Input your name and submit score (if you wish)')}</Text>
            <Input 
              style={styles.input} onChangeText={setPlayerName} value={playerName}
              placeholder='Your nickname here' 
              // label='Player name'
              labelStyle={{color: "white"}}
              inputContainerStyle={{}}
            />
            <Button 
              title="Submit score"  
              titleStyle={{color: "white"}}
              buttonStyle={{backgroundColor: "#330000", borderTop:"1px solid black", borderBottom:"1px solid black", marginTop: 20, padding: 20}}
              onPress={() => submitScoreHandler("submit")}
            />
             <Button 
              title="Skip"
              titleStyle={{color: "white"}}
              buttonStyle={{backgroundColor: "#331a00", borderTop:"1px solid black", borderBottom:"1px solid black", marginTop: 20, padding: 20}}
              onPress={() => submitScoreHandler("skip")}
            />
          </View>
        )
      default: //= running, start, next question
        return(
          <View>
            <Text style={styles.textScore}>{t('current score')}: {currentScore}</Text>
            <Text style={styles.text}>{t('choose one')}!</Text>
            <Text style={styles.text}>{currentLanguage === "en" ? currentQuestion.questionEN : currentQuestion.questionFI}</Text>
            <View style={styles.imageOptions}>
            {answerOptions.length > 0 &&
              answerOptions.map((answerOption, idx) => {
                return(
                  <Pressable key={idx} 
                    onPress={() => {checkPlayersAnswer(answerOption)}}
                  >
                    <Image
                      source={{ uri: answerOptions[idx].imgUrl }}
                      style={{ width: 320, height: 180}}
                      PlaceholderContent={<ActivityIndicator />}
                      containerStyle={{backgroundColor: 'black', border: '5px solid black', borderBottom: 'none'}}
                    />
                  </Pressable>
                )
              })
            }
              <Image // this generates last images' bottom border
                style={{ width: 330, height: 0 }}
                containerStyle={{ borderTop: '5px solid black' }}
              />
            </View>
          </View>
        )
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={bg_dota2} resizeMode="cover" style={styles.bgImage}>
        {gameStateViews()}
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
  text: {
    color:"white",
    alignSelf: 'center',
    fontSize: 20,
  },
  textScore: {
    color:"white",
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 40,
  },
  textBig: {
    color:"white",
    alignSelf: 'center',
    fontSize: 26,
  },
  imageOptions: {
    alignItems: 'center',
  },
  input: {
    width:"93%", 
    height:"5%",
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 5,
    color:"white",
  },
});

export default GameScreen