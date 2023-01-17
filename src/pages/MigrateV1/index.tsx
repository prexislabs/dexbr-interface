import { JSBI, Token } from 'dexbr-sdk'
import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { SearchInput } from '../../components/SearchModal/styleds'
import { useAllTokenV1Exchanges } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useToken, useAllTokens } from '../../hooks/Tokens'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { BackArrow, TYPE } from '../../theme'
import { LightCard } from '../../components/Card'
import { BodyWrapper } from '../AppBody'
import { EmptyState } from './EmptyState'
import V1PositionCard from '../../components/PositionCard/V1'
import QuestionHelper from '../../components/QuestionHelper'
import { Dots } from '../../components/swap/styleds'
import { useAddUserToken } from '../../state/user/hooks'
import { isDefaultToken, isCustomAddedToken } from '../../utils'
import { useTranslation } from 'react-i18next'


export default function MigrateV1() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()


  const [tokenSearch, setTokenSearch] = useState<string>('')
  const handleTokenSearchChange = useCallback(e => setTokenSearch(e.target.value), [setTokenSearch])

  // automatically add the search token
  const token = useToken(tokenSearch)
  const isDefault = isDefaultToken(token)
  const allTokens = useAllTokens()
  const isCustomAdded = isCustomAddedToken(allTokens, token)
  const addToken = useAddUserToken()
  useEffect(() => {
    if (token && !isDefault && !isCustomAdded) {
      addToken(token)
    }
  }, [token, isDefault, isCustomAdded, addToken])

  // get V1 LP balances
  const V1Exchanges = useAllTokenV1Exchanges()
  const V1LiquidityTokens: Token[] = useMemo(() => {
    return Object.keys(V1Exchanges).map(
      exchangeAddress => new Token(chainId, exchangeAddress, 18, 'UNI-V1', 'Uniswap V1')
    )
  }, [chainId, V1Exchanges])
  const [V1LiquidityBalances, V1LiquidityBalancesLoading] = useTokenBalancesWithLoadingIndicator(
    account,
    V1LiquidityTokens
  )
  const allV1PairsWithLiquidity = V1LiquidityTokens.filter(V1LiquidityToken => {
    return (
      V1LiquidityBalances?.[V1LiquidityToken.address] &&
      JSBI.greaterThan(V1LiquidityBalances[V1LiquidityToken.address].raw, JSBI.BigInt(0))
    )
  }).map(V1LiquidityToken => {
    return (
      <V1PositionCard
        key={V1LiquidityToken.address}
        token={V1Exchanges[V1LiquidityToken.address]}
        V1LiquidityBalance={V1LiquidityBalances[V1LiquidityToken.address]}
      />
    )
  })

  // should never always be false, because a V1 exhchange exists for WETH on all testnets
  const isLoading = Object.keys(V1Exchanges)?.length === 0 || V1LiquidityBalancesLoading

  return (
    <BodyWrapper style={{ padding: 24 }}>
      <AutoColumn gap="16px">
        <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
          <BackArrow to="/pool" />
          <TYPE.mediumHeader>{t('Migrate V1 Liquidity')}</TYPE.mediumHeader>
          <div>
            <QuestionHelper text={t('Migrate your liquidity tokens from Uniswap V1 to Uniswap V2.')} />
          </div>
        </AutoRow>

        <TYPE.body style={{ marginBottom: 8, fontWeight: 400 }}>
        {t('For each pool shown below, click migrate to remove your liquidity from Uniswap V1 and deposit it into Uniswap V2.')}
        </TYPE.body>

        {!account ? (
          <LightCard padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
            {t('Connect to a wallet to view your V1 liquidity.')}
            </TYPE.body>
          </LightCard>
        ) : isLoading ? (
          <LightCard padding="40px">
            <TYPE.body color={theme.text3} textAlign="center">
              <Dots>{t('Loading')}</Dots>
            </TYPE.body>
          </LightCard>
        ) : (
          <>
            <AutoRow>
              <SearchInput
                value={tokenSearch}
                onChange={handleTokenSearchChange}
                placeholder={t('Enter a token address to find liquidity')}
              />
            </AutoRow>
            {allV1PairsWithLiquidity?.length > 0 ? (
              <>{allV1PairsWithLiquidity}</>
            ) : (
              <EmptyState message={t('No V1 Liquidity found.')} />
            )}
          </>
        )}
      </AutoColumn>
    </BodyWrapper>
  )
}
