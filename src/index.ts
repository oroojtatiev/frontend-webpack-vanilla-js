import {renderButton} from './layouts/button'
import {getRandomInt, shuffle} from './functions'
import {words} from './data'
import './styles/index.css'
import {renderGameIsOver} from './layouts/gameIsOver'

class App {
  questionNumber: number = 0
  currentWord: string = null
  doneWords: string[] = []
  foundLetters: string[] = []
  randomLetters: string[] = []
  gameLimit: number = 6
  mistakeLimit: number = 3
  mistakeCount: number = 0

  init() {
    this.setRandomWord()
    const randomLetters = this.getRandomLetters()
    this.renderButtons(randomLetters)
    this.renderQuestionNumber()
    this.addEventListeners()
  }

  renderQuestionNumber() {
    this.questionNumber++
    const elQuestionNumber = document.getElementById('questionNumber')
    elQuestionNumber.innerHTML = String(this.questionNumber)
  }

  setRandomWord() {
    const randomNum = getRandomInt(0, words.length - 1)
    const newRandomWord = words[randomNum]

    if (this.doneWords.length === this.gameLimit) {
      this.renderGameIsOver()
      this.clearButtons()
      return
    }

    if (this.doneWords.includes(newRandomWord)) {
      this.setRandomWord()
    } else {
      this.currentWord = newRandomWord
    }
  }

  getRandomLetters() {
    const letters = this.currentWord.split('')
    const randomLetters = shuffle(letters)
    this.randomLetters = randomLetters
    return randomLetters
  }

  renderButtons(letters: string[], renderAsError?: boolean) {
    this.mistakeCount = 0

    const buttonArrayHtml = letters.map((el, idx) => {
      return renderButton(el, idx, renderAsError)
    })
    const elButtonContainer = document.getElementById('buttons')
    elButtonContainer.innerHTML = buttonArrayHtml.join('')
  }

  addEventListeners() {
    const buttons = document.querySelectorAll('.buttons__item')
    buttons.forEach((el: HTMLDivElement, idx: number) => {
      el.addEventListener('click', () => this.selectLetter(el.outerText, idx), false)
    })

    document.addEventListener('keydown', (event) => this.selectLetter(event.key), false)
  }

  selectLetter(letter: string, idx?: number) {
    if (letter.length > 1) {
      return
    }

    const guessLetterIndex = this.foundLetters.length

    const index = idx ? idx : this.findFirstIndex(letter)

    const isLetterCorrect = this.currentWord[guessLetterIndex] === letter
    const isWordCompleted = guessLetterIndex === this.currentWord.length - 1

    if (isLetterCorrect) {
      this.foundLetters.push(letter)
      this.removeLetterFromList(letter, index)
      this.addLetterToResult(letter)

      if (isWordCompleted) {
        this.doneWords.push(this.currentWord)
        this.setRandomWord()
        this.clearButtons()

        const randomLetters = this.getRandomLetters()
        this.renderButtons(randomLetters)
        this.addEventListeners()
        this.foundLetters = []
        this.renderQuestionNumber()
      }
    } else {
      this.mistakeCount++
      if (this.mistakeCount === this.mistakeLimit) {
        const originalLetters = this.currentWord.split('')
        this.randomLetters = originalLetters

        this.clearButtons()
        this.renderButtons(originalLetters, true)
        this.addEventListeners()

        const buttons = document.querySelectorAll('.buttons__item')

        setTimeout(() => {
          buttons.forEach((el) => el.classList.remove('buttons__item_err'))
        }, 3000)

        this.mistakeCount = 0
      } else {
        this.showError(letter, index)
      }
    }
  }

  addLetterToResult(letter: string) {
    const elResult = document.getElementById('result')
    elResult.innerHTML = elResult.innerHTML + renderButton(letter)
  }

  removeLetterFromList(letter: string, idx: number) {
    const el = document.getElementById(`letter-${letter}-${idx}`)
    el?.remove()
  }

  findFirstIndex(letter: string) {
    return this.randomLetters.indexOf(letter)
  }

  showError(letter: string, idx: number) {
    const el = document.getElementById(`letter-${letter}-${idx}`)

    if (el) {
      el.classList.add('buttons__item_err')
      setTimeout(() => {
        el.classList.remove('buttons__item_err')
      }, 3000)
    }
  }

  clearButtons() {
    this.foundLetters = []

    const buttons = document.querySelectorAll('.buttons__item')
    buttons.forEach((el: HTMLDivElement, idx: number) => {
      el.removeEventListener('click', () => this.selectLetter(el.outerText, idx), false)
    })

    document.removeEventListener('keydown', (event) => this.selectLetter(event.key), false)

    buttons.forEach((el: HTMLDivElement) => el.remove())
  }

  renderGameIsOver() {
    const el = document.getElementById('gameIsOver')
    el.innerHTML = renderGameIsOver()
  }
}

const app = new App()
app.init()
