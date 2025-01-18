export const formatStringRatio = (ratio: number) => `${ratio * 100} %`

export const numbericFormat = (number?: number) => number && new Intl.NumberFormat().format(number)