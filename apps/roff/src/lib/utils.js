import { twMerge } from 'tailwind-merge';
import { defineConfig } from 'cva'

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});

// for sorting questions & options
export function sortByPrev(questions) {
  const ids = Object.keys(questions)

  if (ids.length === 0) return Object.keys(questions).map((id) => questions[id])

  const sorted = [];

  let curId = ids.filter((id) => questions[id].prev === null)[0]
  sorted.push(questions[curId])

  while (sorted.length !== ids.length) {
    curId = ids.filter((id) => questions[id].prev === curId)[0]
    sorted.push(questions[curId])
  }

  return sorted;
}

