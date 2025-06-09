function shuffleArray(array: number[]) {
    const arr = [...array]; 
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }
    return arr;
  }
  

export function getRandomUniqueNumbers(count: number, min: number, max: number, initial: number) {
    const numbers: number[] = [initial];

    while (numbers.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return shuffleArray(numbers); 
  }
  