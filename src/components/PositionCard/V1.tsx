import React, { useContext } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Token, TokenAmount, WETH } from 'dexbr-sdk'
import { Text } from 'rebass'
import { AutoColumn } from '../Column'
import { ButtonSecondary } from '../Button'
import { RowBetween, RowFixed } from '../Row'
import { FixedHeightRow, HoverCard } from './index'
import DoubleTokenLogo from '../DoubleLogo'
import { useActiveWeb3React } from '../../hooks'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'


interface PositionCardProps extends RouteComponentProps<{}> {
  token: Token
  V1LiquidityBalance: TokenAmount
}

function V1PositionCard({ token, V1LiquidityBalance }: PositionCardProps) {
  const theme = useContext(ThemeContext)

  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()


  return (
    <HoverCard>
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <RowFixed>
            <DoubleTokenLogo a0={token.address} margin={true} size={20} />
            <Text fontWeight={500} fontSize={20} style={{ marginLeft: '' }}>
              {`${token.equals(WETH[chainId]) ? 'WETH' : token.symbol}/ETH`}
            </Text>
            <Text
              fontSize={12}
              fontWeight={500}
              ml="0.5rem"
              px="0.75rem"
              py="0.25rem"
              style={{ borderRadius: '1rem' }}
              backgroundColor={theme.yellow1}
              color={'white'}
            >
              V1
            </Text>
          </RowFixed>
        </FixedHeightRow>

        <AutoColumn gap="8px">
          <RowBetween marginTop="10px">
            <ButtonSecondary width="68%" as={Link} to={`/migrate/v1/${V1LiquidityBalance.token.address}`}>
              {t('Migrate')}
            </ButtonSecondary>

            <ButtonSecondary
              style={{ backgroundColor: 'transparent' }}
              width="28%"
              as={Link}
              to={`/remove/v1/${V1LiquidityBalance.token.address}`}
            >
              {t('Remove')}
            </ButtonSecondary>
          </RowBetween>
        </AutoColumn>
      </AutoColumn>
    </HoverCard>
  )
}

export default withRouter(V1PositionCard)
