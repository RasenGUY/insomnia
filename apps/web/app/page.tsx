import React from 'react'
import { ConnectWalletSection } from 'components/features/home/ConnectWalletSection'
export default function AppPage() {
    // this render by default the connect wallet page
    // if the wallet is connect then check if the there is a valid session with siwe present
        // if the siwe is present verify that the wallet address is the same as the one in the session 
        // if the wallet address is the same as the one in the session then render the dashboard page  
            // check if the session is not expired
            // if is session not expired then 
                // verify the wallet address in the session with the one in the wallet
                    // if the wallet address in the session is not the same as the one in the wallet
                        // render the dialog to show verify account modal
                            // when the user click on the verify button then make a call to the backend /nonce endpoint to get the nonce
                            // render the verify account modal (which will trigger the siwe process) when the user click on the verify button
                    // if the wallet address is the same then thea session is valid so render the dashboard page
    return (
        <section className="w-full flex justify-center items-center">
            <ConnectWalletSection />
        </section>
    )
}
