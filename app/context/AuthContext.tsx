import { useSession } from 'next-auth/react';
import React, { createContext, useContext } from 'react'

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}: { children: React.ReactNode}) => {
    const {data: session} = useSession();

    return (
        <AuthContext.Provider value={{ session }}>
            {children}
        </AuthContext.Provider>
    )
}

