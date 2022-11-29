//-- general functions that can be used in many places --//
export function randomChoiceFromArray (array) {
  let randomChoice = array[Math.floor(Math.random() * array.length)];
  return randomChoice;
}

export function removeDuplicateObjectsFromArrayById (array) {
  let uniqueIdList = [];

  const newList = array.filter(element => {
    const isDuplicate = uniqueIdList.includes(element.id);
    if (!isDuplicate) {
      uniqueIdList.push(element.id);
      return true;
    }
    return false;
  })

  return newList;
}

//-- GAME general functions that don't chance state --//

// filters herolist down to heroes that the question concerns. Returns the the filtered list
export const filterHeroList = (question, heroList) => {
  let filteredList = heroList;
  if (question.filter !== null) {
    switch (question.filter.type) {
      case "attack_type":
        filteredList = heroList.filter(filteredHero => filteredHero.attack_type === question.filter.value);
        break;
      case "primary_attr":
        filteredList = heroList.filter(filteredHero => filteredHero.primary_attr === question.filter.value);
        break;
      default:
        break;
    }
  }
  return filteredList;
}

// randomly choose 3 heroes as answer options. Returns a list with 3 heroes
export const generateThreeChoices = (heroList) => {
  let choices = [];
  let randomChoice;
  while (choices.length < 3) {
    randomChoice = randomChoiceFromArray(heroList); // choose random hero from heroList
    choices.push(randomChoice);
    let uniqueList = removeDuplicateObjectsFromArrayById(choices) // remove possible duplicate heroes if by chance a hero got randomed twice
    choices = uniqueList;
  }
  return choices;
}

// format answer options to contain only necessary data. Returns a list formatted answer options
export const formatAnswerChoices = (answerOptionList) => {
  let formattedList = [];
  answerOptionList.map((answerOption) => {
    let obj = {};
    obj.id = answerOption.id;
    obj.name = answerOption.localized_name;
    obj.imgUrl = `https://api.opendota.com${answerOption.img}`;
    obj.attackRange = answerOption.attack_range;
    obj.moveSpeed = answerOption.move_speed;
    obj.pickBanRate = answerOption.pro_ban + answerOption.pro_pick;
    formattedList.push(obj);
  })
  return formattedList;
}

// form the correct answer. Returns a list of correct answers
export const generateCorrectAnswer = (question, formattedAnswerOptionList) => {
  // console.log(formattedAnswerOptionList)
  let correctAnswers;
  switch (question.answerTag) {
    case "highestAttackRange":
      let highestAttackRange = Math.max(...formattedAnswerOptionList.map(hero => hero.attackRange))
      correctAnswers = formattedAnswerOptionList.filter(hero => hero.attackRange >= highestAttackRange)
      break;
    case "highestMoveSpeed":
      let highestMoveSpeed = Math.max(...formattedAnswerOptionList.map(hero => hero.moveSpeed))
      correctAnswers = formattedAnswerOptionList.filter(hero => hero.moveSpeed >= highestMoveSpeed)
      break;
    case "mostPickedAndBanned":
      let mostPickedAndBanned = Math.max(...formattedAnswerOptionList.map(hero => hero.pickBanRate))
      correctAnswers = formattedAnswerOptionList.filter(hero => hero.pickBanRate >= mostPickedAndBanned)
      break;
    case "xx":
      break;
    default:
      break;
  }
  // console.log(correctAnswers)
  return correctAnswers;

  // ↓ Example case "highestAttackRange" with returning one hero object (not sufficient if there are multiple correct answers). Possible future use though.
  // let correct = formattedAnswerOptionList.reduce((highest, current) => highest.attackRange > current.attackRange ? highest : current); 
}