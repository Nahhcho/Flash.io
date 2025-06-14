export function flashcardGenPrompt(content: string) {
    return (
        `
        You are generating flashcards from educational content. 

        Please strictly follow this format for each flashcard:
        Q: <question>
        A: <answer>

        Start your response with a set title in this format:
        title: <a short, relevant title for the entire set> (MAX 30 characters)

        Example:

        title: Biology Basics  
        Q: What is the basic unit of life?  
        A: The cell.  
        Q: What is DNA responsible for?  
        A: Carrying genetic information.  

        Requirements:
        - Keep the format exactly as shown: no extra formatting, headers, or markdown.
        - Each Q/A pair must follow the structure exactly, on its own line.
        - Keep questions factual and concise.
        - No duplicated or similar questions.
        - Limit to 30 flashcards maximum.

        Here is the content to generate flashcards from:
        """  
        ${content}  
        """
        `
    )
        ;
}

export function focusedFlashcardGenPrompt(content: string, weakPoints: string, dueDate: Date) {
  const currentDate = new Date();

  return (
    `
You are generating flashcards from educational content and the user's weak points from a previous flashcard set. Your goal is to create a new flashcard set that helps the user actively recall and reinforce concepts — especially the weak ones.

The user has an upcoming exam. At the end of your response, include:
**dateToComplete: <ISO string>**

### Rules for dateToComplete:
- Must be after currentDate (not the same day).
- Must NOT be after examDate.
- Can be the same day as examDate (for final review).
- Strongly bias the date closer to currentDate than to examDate (ideally within 1–3 days after today).
- Avoid long gaps between quizzes unless absolutely necessary.

### Flashcard format:
Start with a short set title:
**title: <max 30 characters>**

Then list Q/A pairs like this (no extra formatting or numbering):

Q: <question>
A: <answer>

End with:
**dateToComplete: <ISO string format>**

### Style guide:
- Do NOT use markdown.
- Do NOT include explanations or headings.
- Each Q/A must be on its own line.
- Questions should be concise, fact-based, and non-redundant.
- Cover key concepts from the content while prioritizing weak points.

---

Here is the input for generating flashcards:

content: ${content}
weak points: ${weakPoints}
exam date: ${dueDate.toISOString()}
currentDate: ${currentDate.toISOString()}
`
  );
}