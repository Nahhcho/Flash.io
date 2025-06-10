
export const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    SIGN_IN_WITH_OAUTH: "auth/signin-with-oauth",
    SET_QUIZ: (setId: string) => `/quiz/${setId}`,
    SET_EDIT: (setId: string, courseId: string) => `/courseDetails/${courseId}/sets/${setId}/edit`
}