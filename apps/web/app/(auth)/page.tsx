import React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config/configClient'
import Connect from 'components/features/wallet/ConnectButton'

export const metadata: Metadata = {
  title: `Sign In - ${config.name}`,
  description: 'Insomnia Wallet Portofolio App',
}

const ConnectPage: React.FC = () => {
  return <Connect />
}

export default ConnectPage
