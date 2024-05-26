'use client'
import React from 'react'
import {SessionProvider} from 'next-auth/react'


function SessionAuthProvider({children}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider> 
  )
}

export default SessionAuthProvider