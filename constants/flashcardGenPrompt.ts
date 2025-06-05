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