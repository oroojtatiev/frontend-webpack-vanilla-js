export interface MostMistakeWord {
  name: string | null
  mistakeCount: number
}

export interface RenderStatisticsData {
  statisticsWordCountWithoutMistake: number
  statisticsMostMistakeWord: MostMistakeWord
  statisticsMistakeCount: number
}
