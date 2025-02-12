'use client'
import React from 'react'

import { ConnectWalletSection } from 'components/features/home/ConnectWalletSection'
import { RegisterModal } from 'components/features/auth/RegisterModal'
import { VerifyAccountModal } from 'components/features/auth/VerifyAccountModal'
import { validateSession } from '@/utils/auth'
import { useSessionStore } from '@/components/features/auth/store'
import { useAccount } from 'wagmi'

export default function AppPage() {
  
    const {  isConnected } = useAccount()
    const store = useSessionStore()
    
    if (!isConnected) {
        return (
        <section className="w-full flex justify-center items-center min-h-screen">
            <ConnectWalletSection />
        </section>
        )
    }
    
    return <></> 
    
    (
        <>
            {/* <VerifyAccountModal
                isOpen={!validateSession(store.getState())}
                onVerify={verify}
                isVerifying={isVerifying}
            />
         */}
            {/* <RegisterModal
                isOpen={needsRegistration}
                onRegister={register}
                isRegistering={isRegistering}
                error={registerError?.message}
            />
         */}
            {/* {isAuthenticated && <Dashboard />} */}
        </>
    )
}


    // this render by default the connect wallet page
    // if the wallet is connect then check if the there is a valid session with siwe present
    //     if the siwe is present verify that the wallet address is the same as the one in the session 
    //     if the wallet address is the same as the one in the session then render the dashboard page  
    //         check if the session is not expired
    //         if is session not expired then 
    //             verify the wallet address in the session with the one in the wallet
    //                 if the wallet address in the session is not the same as the one in the wallet
    //                     render the dialog to show verify account modal
    //                         when the user click on the verify button then make a call to the backend /nonce endpoint to get the nonce
    //                         render the verify account modal (which will trigger the siwe process) when the user click on the verify button
    //                 if the wallet address is the same then thea session is valid so render the dashboard page
