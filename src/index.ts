import { renderButton } from './layouts/button'
import { getRandomInt, shuffle } from './functions'
import { words } from './data'
import './styles/index.css'
import { renderGameIsOver } from './layouts/gameIsOver'

class App {
  questionNumber: number = 0
  doneWords: string[] = []
  currentWordFoundLetters: string[] = []
  currentWord: string = null

  init() {
    this.setRandomWord()
    this.renderButtons()
    this.addListenersToButtons()
  }

  renderQuestionNumber() {
    this.questionNumber++
    const elQuestionNumber = document.getElementById('questionNumber')
    elQuestionNumber.innerHTML = String(this.questionNumber)
  }

  setRandomWord() {
    const randomNum = getRandomInt(0, words.length - 1)
    const newRandomWord = words[randomNum]

    if (this.doneWords.length === words.length) {
      this.renderGameIsOver()
      this.clearButtons()
      return
    }

    if (this.doneWords.includes(newRandomWord)) {
      this.setRandomWord()
    } else {
      this.currentWord = newRandomWord
      this.clearButtons()
      this.currentWordFoundLetters = []
      this.renderButtons()
      this.addListenersToButtons()
      this.renderQuestionNumber()
    }
  }

  renderButtons() {
    const letters = this.currentWord.split('')
    const randomizedLetters = shuffle(letters)
    const buttonArrayHtml = randomizedLetters.map((el, idx) =>
      renderButton(el, idx)
    )
    const elButtons = document.getElementById('buttons')
    elButtons.innerHTML = buttonArrayHtml.join('')
  }

  addListenersToButtons() {
    const buttons = document.querySelectorAll('.buttons__item')
    buttons.forEach((el: HTMLDivElement, idx: number) => {
      el.addEventListener(
        'click',
        () => this.selectLetter(el.outerText, idx),
        false
      )
    })
  }

  selectLetter(letter: string, idx: number) {
    const guessLetterIndex = this.currentWordFoundLetters.length

    if (this.currentWord[guessLetterIndex] === letter) {
      this.currentWordFoundLetters.push(letter)
      this.removeLetterFromList(letter, idx)
      this.addLetterToResult(letter)

      const isWordCompleted = guessLetterIndex === this.currentWord.length - 1

      if (isWordCompleted) {
        this.doneWords.push(this.currentWord)
        this.setRandomWord()
      }
    } else {
      this.showError(letter, idx)
    }
  }

  addLetterToResult(letter: string) {
    const elResult = document.getElementById('result')
    elResult.innerHTML = elResult.innerHTML + renderButton(letter)
  }

  removeLetterFromList(letter: string, idx: number) {
    const el = document.getElementById(`letter-${letter}-${idx}`)
    el.remove()
  }

  showError(letter: string, idx: number) {
    const el = document.getElementById(`letter-${letter}-${idx}`)
    el?.classList.add('buttons__item_err')
  }

  clearButtons() {
    const buttons = document.querySelectorAll('.buttons__item')
    buttons.forEach((el: HTMLDivElement) => el.remove())
  }

  renderGameIsOver() {
    const el = document.getElementById('gameIsOver')
    el.innerHTML = renderGameIsOver()
  }
}

const app = new App()
app.init()
