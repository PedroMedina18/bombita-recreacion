import { useEffect, useContext, useState, createContext } from 'react'

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  return (

    <AuthContext.Provider value={
      {

      }
    }>

      {children}

    </AuthContext.Provider>

  )
}

export const useAuth = () => useContext(AuthContext);