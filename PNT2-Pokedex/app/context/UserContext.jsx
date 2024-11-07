import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function useUser() {
    return useContext(UserContext)
}

export const UserProvider = ({ children }) => {

    const [userNameContext, setUserNameContext] = useState('')

    return (
        <UserContext.Provider value={{ userNameContext, setUserNameContext }}>
            {children}
        </UserContext.Provider>
    )
}
