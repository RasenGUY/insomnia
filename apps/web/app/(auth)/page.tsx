import React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config/configClient'

export const metadata: Metadata = {
  title: `Sign In - ${config.name}`,
  description: 'Insomnia Wallet Portofolio App',
}

const ConnectPage: React.FC = () => {
  return <></>
}

export default ConnectPage
