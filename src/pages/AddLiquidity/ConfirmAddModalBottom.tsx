import { Fraction, Percent, Token, TokenAmount } from 'dexbr-sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import TokenLogo from '../../components/TokenLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'


export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  tokens,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  tokens: { [field in Field]?: Token }
  parsedAmounts: { [field in Field]?: TokenAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}){  const { t } = useTranslation()

  return (
    <>
      <RowBetween>
        <TYPE.body>{tokens[Field.TOKEN_A]?.symbol} {t('Deposited')}</TYPE.body>
        <RowFixed>
          <TokenLogo address={tokens[Field.TOKEN_A]?.address} style={{ marginRight: '8px' }} />
          <TYPE.body>{parsedAmounts[Field.TOKEN_A]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{tokens[Field.TOKEN_B]?.symbol} {t('Deposited')}</TYPE.body>
        <RowFixed>
          <TokenLogo address={tokens[Field.TOKEN_B]?.address} style={{ marginRight: '8px' }} />
          <TYPE.body>{parsedAmounts[Field.TOKEN_B]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{t('Rates')}</TYPE.body>
        <TYPE.body>
          {`1 ${tokens[Field.TOKEN_A]?.symbol} = ${price?.toSignificant(4)} ${tokens[Field.TOKEN_B]?.symbol}`}
        </TYPE.body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TYPE.body>
          {`1 ${tokens[Field.TOKEN_B]?.symbol} = ${price?.invert().toSignificant(4)} ${tokens[Field.TOKEN_A]?.symbol}`}
        </TYPE.body>
      </RowBetween>
      <RowBetween>
        <TYPE.body>{t('Share of Pool')}:</TYPE.body>
        <TYPE.body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
        </Text>
      </ButtonPrimary>
    </>
  )
}
