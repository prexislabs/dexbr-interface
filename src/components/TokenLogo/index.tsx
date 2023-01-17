import React, { useState } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { WETH } from 'dexbr-sdk'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import DefaultTokenIcon from '../../assets/images/tokens/default-token-icon.png'
import USDCLogo from '../../assets/images/tokens/usdc-icon.png'
import DextLogo from '../../assets/images/tokens/dexbr-icon.svg'

const getTokenLogoURL = address => {
  // Return token logo by address.
  switch(address){
    case "0x50a6505C9B5F6837CA69724F204Ffe21B2ca7806": 
      return USDCLogo
    case "0xcbB27cE87aBef0Fda2049148Aa4B4820E6db40fc":
      return DextLogo
  }

  // WETH icon return.
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}
const NO_LOGO_ADDRESSES: { [tokenAddress: string]: true } = {
  ["0x50a6505C9B5F6837CA69724F204Ffe21B2ca7806"]: true,
  ["0xcbB27cE87aBef0Fda2049148Aa4B4820E6db40fc"]: true
}

const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const Emoji = styled.span<{ size?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-bottom: -4px;
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function TokenLogo({
  address,
  size = '24px',
  ...rest
}: {
  address?: string
  size?: string
  style?: React.CSSProperties
}) {
  const [, refresh] = useState<number>(0)
  const { chainId } = useActiveWeb3React()

  let path = ''
  const validated = isAddress(address)
  // hard code to show ETH instead of WETH in UI
  if (validated === WETH[chainId].address) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} {...rest} />
  } else if (NO_LOGO_ADDRESSES[address] && validated) {
    path = getTokenLogoURL(validated)
  } else {
    return (
      <Image src={DefaultTokenIcon} {...rest} size={size} />
    )
  }

  return (
    <Image
      {...rest}
      // alt={address}
      src={path}
      size={size}
      onError={() => {
        NO_LOGO_ADDRESSES[address] = true
        refresh(i => i + 1)
      }}
    />
  )
}
