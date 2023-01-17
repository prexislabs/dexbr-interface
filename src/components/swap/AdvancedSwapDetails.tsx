import { Trade, TradeType } from 'dexbr-sdk'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import { useTranslation } from 'react-i18next'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  const { t } = useTranslation()

  return (
    <>
    
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.white}>
              {isExactIn ? t('Minimum received') : t('Maximum sold')}
            </TYPE.black>
            <QuestionHelper text={t('Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.')} />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.white} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.token.symbol}` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.token.symbol}` ?? '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.white}>
            {t('Price Impact')}
            </TYPE.black>
            <QuestionHelper text={t('The difference between the market price and estimated price due to trade size.')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.white}>
            {t('Liquidity Provider Fee')}
            </TYPE.black>
            <QuestionHelper text={t('"A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive.')} />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.white}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.token.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = trade?.route?.path?.length > 2
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      {trade && <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />}
      {showRoute && (
        <>
          <SectionBreak />
          <AutoColumn style={{ padding: '0 24px' }}>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={400} color={theme.white}>
                {t('Route')}
              </TYPE.black>
              <QuestionHelper text={t('Routing through these tokens resulted in the best price for your trade')} />
            </RowFixed>
            <SwapRoute trade={trade} />
          </AutoColumn>
        </>
      )}
    </AutoColumn>
  )
}
