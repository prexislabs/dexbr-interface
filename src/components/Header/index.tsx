import { ChainId, WETH } from 'dexbr-sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo-dexbr.svg'
import LogoDark from '../../assets/svg/logo-white-dexbr.svg'
import Wordmark from '../../assets/svg/wordmark.svg'
import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import VersionSwitch from './VersionSwitch'

import { useTranslation } from 'react-i18next'


const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  ${`
    img { 
      width: 11rem;
      margin-top: -65px;
      margin-left: 150px;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Nav = styled.div`
  margin-top: 10px;
  // margin-left: 8%;
  // @media screen and (max-height: 300px){
  //   margin-top:40px;
  // }
`

const NavA = styled.a`
  color: white;
  font-size: 16px;
  text-decoration: none;
  font-weight: bold;
  padding: 0px 30px 20px 0;
  position: relative;
  
  :after{
    content:"";
    position: absolute;
    background-color: #fff;
    height: 3px;
    width: 100%;
    left: 0; 
    bottom: -20px;
    visibility: hidden;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transition: all 0.3s ease-in-out 0s;
    transition: all 0.3s ease-in-out 0s;
  }

  :hover:after{
    visibility: visible;
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    
  }
`
const MobileMenu = styled.div`
display: none;
cursor: pointer;
width: 32px;
  height: 2px;
  background: #fff;
  margin: 8px;
  transition: 0.3s;

`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.GÖRLI]: 'Görli'
}


export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const userEthBalance = useTokenBalanceTreatingWETHasETH(account, WETH[chainId])
  const [isDark] = useDarkModeManager()

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            <UniIcon>
              <img src={ Logo} alt="logo" />
            </UniIcon>
          </Title>
        </HeaderElement>

  
    
        <HeaderControls>
        <Nav>
          <NavA href="https://www.mpjunior.com.br/labs/dexbr/"> {t('Home')}</NavA>
          <NavA href="https://www.mpjunior.com.br/labs/dexbr/sobre-nos/">{t('DexBR')}</NavA>
          <NavA href="https://www.mpjunior.com.br/labs/dexbr/sobre-nos/#">{t('Articles and News')}</NavA>
          <NavA href="https://www.mpjunior.com.br/labs/dexbr/sobre-nos/#">{t('FAQ')}</NavA>
          <NavA href="https://www.mpjunior.com.br/labs/dexbr/contato/">{t('Contact')}</NavA>
        </Nav>

          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            {/* <VersionSwitch /> */}
            <Settings />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
