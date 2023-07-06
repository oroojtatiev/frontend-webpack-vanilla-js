import {RenderStatisticsData} from '../types'

export function renderStatistics(data: RenderStatisticsData): string {
  return `
    <ul>
      <li><span>Число собранных слов без ошибок: </span>${data.statisticsWordCountWithoutMistake}</li>
      <li><span>Число ошибок: </span>${data.statisticsMistakeCount}</li>
      <li><span>Слово с самым большим числом ошибок: </span>${data.statisticsMostMistakeWord.name}</li>
    </ul>
  `
}
