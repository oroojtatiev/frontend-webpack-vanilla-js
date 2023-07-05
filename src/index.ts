import { renderButton } from './layouts/button'
import { getRandomInt, shuffle } from './functions'
import { words } from './data'
import './styles/index.css'
import { renderGameIsOver } from './layouts/gameIsOver'

class App {
  questionNumber: number = 0
  currentWord: string = null
  doneWords: string[] = []
  foundLetters: string[] = []
  randomizedLetters: string[] = []
  gameLimit: number = 6
  mistakeLimit: number = 3
  mistakeCount: number = 0

  init() {
    this.setRandomWord()
    const randomizedLetters = this.getRandomLetters()
    this.randomizedLetters = randomizedLetters
    this.renderButtons(randomizedLetters)
    this.addEventListeners()
    this.renderQuestionNumber()
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
    return shuffle(letters)
  }

  renderButtons(letters: string[], renderAsError?: boolean) {
    this.mistakeCount = 0

    let buttonArrayHtml = letters.map((el, idx) =>
      renderButton(el, idx, renderAsError)
    )
    const elButtons = document.getElementById('buttons')
    elButtons.innerHTML = buttonArrayHtml.join('')
  }

  addEventListeners() {
    const buttons = document.querySelectorAll('.buttons__item')
    buttons.forEach((el: HTMLDivElement, idx: number) => {
      el.addEventListener(
        'click',
        () => this.selectLetter(el.outerText, idx),
        false
      )
    })

    document.addEventListener(
      'keydown',
      (event) => {
        const name = event.key
        this.selectLetter(name)
      },
      false
    )
  }

  selectLetter(letter: string, idx?: number) {
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

        const randomizedLetters = this.getRandomLetters()
        this.randomizedLetters = randomizedLetters
        this.renderButtons(randomizedLetters)
        this.addEventListeners()
        this.foundLetters = []
      }

      this.mistakeCount = 0
    } else {
      this.showError(letter, index)
      this.mistakeCount++
      if (this.mistakeCount === this.mistakeLimit) {
        const lettersArray = this.currentWord.split('')
        this.renderButtons(lettersArray, true)
        this.addEventListeners()

        const buttons = document.querySelectorAll('.buttons__item')

        setTimeout(() => {
          buttons.forEach(el => el.classList.remove('buttons__item_err'))
        }, 3000)
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
    return this.randomizedLetters.indexOf(letter)
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
