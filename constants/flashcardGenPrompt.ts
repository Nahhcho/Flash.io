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
    return ( 
        `
        You are generating flashcards from educational content and weak points of the user from a previous flashcard set. Focus especially on the weak points.

        You will also be given the date of the user's upcoming exam. Include a date called "dateToComplete" that represents when the user should complete this new flashcard set — it must be before the exam date and after today. Choose a date that supports spaced repetition and active recall, and is also closer to today.

        The weak points will be provided in Q/A pairs.

        Please strictly follow this format for each flashcard:
        Q: <question>
        A: <answer>

        Start your response with a set title in this format:
        title: <a short, relevant title for the entire set> (MAX 30 characters)

        End your response with:
        dateToComplete: <ISO string format>

        Example:

        title: Biology Basics  
        Q: What is the basic unit of life?  
        A: The cell.  
        Q: What is DNA responsible for?  
        A: Carrying genetic information.  
        dateToComplete: 2025-06-10T23:04:32.481Z

        Rules:
        - DO NOT use markdown or extra formatting.
        - Each Q/A pair must be on its own line and follow the format exactly.
        - Keep questions concise and factual.
        - Do not repeat or slightly rephrase questions.
        - Generate enough flashcards to meaningfully cover all content provided.

        Here is the content and weak points to generate flashcards from:
        """
        content: ${content}
        weak points: ${weakPoints}
        exam date: ${dueDate.toISOString()}
        currentDate: ${new Date().toISOString()}
        """
        `
    )
}