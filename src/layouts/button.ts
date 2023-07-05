export function renderButton(letter: string, idx?: number) {
  return `
    <div id="letter-${letter}-${idx}" class="buttons__item">
      ${letter}
    </div>
  `
}
