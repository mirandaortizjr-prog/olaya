import { QuizResult } from './types';
import { languageLabels } from './quizData';

export function scoreQuiz(
  answers: number[], 
  type: 'lust' | 'sex',
  language: 'en' | 'es'
): QuizResult {
  const languageMap = languageLabels[type][language];
  const counts = new Array(languageMap.length).fill(0);
  
  answers.forEach((index) => counts[index]++);

  const max = Math.max(...counts);
  const primaryIndex = counts.indexOf(max);
  const primary = languageMap[primaryIndex];

  const secondary = languageMap.filter((_, i) => 
    counts[i] >= max - 2 && counts[i] < max
  );

  return {
    primary,
    secondary,
    raw: counts,
  };
}
