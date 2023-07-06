export function renderButton(letter: string, idx?: number, renderAsError?: boolean): string {
  const styles = renderAsError ? 'buttons__item buttons__item_err' : 'buttons__item'
  return `
    <div id="letter-${letter}-${idx}" class="${styles}">
      ${letter}
    </div>
  `
}
