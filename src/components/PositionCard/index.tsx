import React, { useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Link } from 'react-router-dom'
import { Percent, Pair, JSBI } from 'dexbr-sdk'
import { useActiveWeb3React } from '../../hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import { currencyId } from '../../pages/AddLiquidity/currencyId'
import { useTokenBalance } from '../../state/wallet/hooks'
import Card, { GreyCard } from '../Card'
import TokenLogo from '../TokenLogo'
import DoubleLogo from '../DoubleLogo'
import { Text } from 'rebass'
import { ExternalLink } from '../../theme'
import { AutoColumn } from '../Column'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ButtonSecondary } from '../Button'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { useTranslation } from 'react-i18next'


export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`

interface PositionCardProps {
  pair: Pair | undefined | null
  border?: string
}

export function MinimalPositionCard({ pair, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()


  const token0 = pair?.token0
  const token1 = pair?.token1

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account, pair?.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text color="#fff" fontWeight={500} fontSize={16}>
                  {t('Your position')}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleLogo a0={token0?.address || ''} a1={token1?.address || ''} margin={true} size={20} />
                <Text color="#fff" fontWeight={500} fontSize={20}>
                  {token0?.symbol}/{token1?.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text color="#fff" fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="#fff" fontSize={16} fontWeight={500}>
                  {token0?.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text color="#ffff" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#fff" fontSize={16} fontWeight={500}>
                  {token1?.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text color="#fff" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const token0 = pair?.token0
  const token1 = pair?.token1
  const { t } = useTranslation()


  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account, pair?.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed>
            <DoubleLogo a0={token0?.address || ''} a1={token1?.address || ''} margin={true} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!token0 || !token1 ? <Dots>{t('Loading')}</Dots> : `${token0.symbol}/${token1.symbol}`}
            </Text>
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                {t('Pooled')} {token0?.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <TokenLogo size="20px" style={{ marginLeft: '8px' }} address={token0?.address} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                {t('Pooled')} {token1?.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <TokenLogo size="20px" style={{ marginLeft: '8px' }} address={token1?.address} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
              {t('Your pool tokens:')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
              {t('Your pool share:')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
              </Text>
            </FixedHeightRow>

            {/* <AutoRow justify="center" marginTop={'10px'}>
              <ExternalLink href={`https://uniswap.info/pair/${pair?.liquidityToken.address}`}>
              {t('View pool information')} ↗
              </ExternalLink>
            </AutoRow> */}
            <RowBetween marginTop="10px">
              <ButtonSecondary as={Link} to={`/add/${currencyId(token0)}/${currencyId(token1)}`} width="48%">
              {t('Add')}
              </ButtonSecondary>
              <ButtonSecondary as={Link} width="48%" to={`/remove/${token0?.address}-${token1?.address}`}>
                {t('Remove')}
              </ButtonSecondary>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
