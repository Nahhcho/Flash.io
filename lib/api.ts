import { fetchHandler } from "./handlers/fetch";
import { SignInWithOAuthParams } from "@/types/global";
import { ROUTES } from "@/constants/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
    user: {
        getByEmail: (email: string) => fetchHandler(`${API_BASE_URL}/users/email`,
            {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            }
        ),
        getAllExamSets: (userId: string) => fetchHandler(`${API_BASE_URL}/users/${userId}/examSets`),
        getStudyPlans: (userId: string) => fetchHandler(`${API_BASE_URL}/users/${userId}/studyPlans`)
    },
    courses: {
        getAll: (userId: string) => fetchHandler(`${API_BASE_URL}/users/${userId}/courses`, {
            method: "GET"
        }),
        getById: (courseId: string) => fetchHandler(`${API_BASE_URL}/courses/${courseId}`),
        create: (formData: FormData, userId: string) => fetchHandler(`${API_BASE_URL}/users/${userId}/courses`, {
            method: "POST",
            body: formData
        }),
        getSets: (courseId: string) => fetchHandler(`${API_BASE_URL}/courses/${courseId}/sets`),
        getStudyPlans: (courseId: string) => fetchHandler(`${API_BASE_URL}/courses/${courseId}/studyPlans`),    },  
    auth: {
        oAuthSignIn: ({ user, provider, providerAccountId }: SignInWithOAuthParams) => fetchHandler(`${API_BASE_URL}/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
            method: "POST",
            body: JSON.stringify({
                user,
                provider,
                providerAccountId
            })
        })
    },
    accounts: {
        getByProviderId: (providerAccountId: string) => fetchHandler(`${API_BASE_URL}/accounts/provider`, {
            method: "POST",
            body: JSON.stringify({
                providerAccountId
            })
        })
    },
    FlashcardSets: {
        getSetAndFlashcards: (setId: string) => fetchHandler(`${API_BASE_URL}/sets/${setId}/flashcards`),
        createSet: (formData: FormData, courseId: string) => fetchHandler(`${API_BASE_URL}/courses/${courseId}/sets`,{
            method: "POST",
            body: formData,
        })

    },
    studyPlans: {
        get: (studyPlanId: string) => fetchHandler(`${API_BASE_URL}/studyPlans/${studyPlanId}`),
        getSets: (studyPlanId: string) => fetchHandler(`${API_BASE_URL}/studyPlans/${studyPlanId}/sets`),
    }
}