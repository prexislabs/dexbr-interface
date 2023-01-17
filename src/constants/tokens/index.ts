import { ChainId, Token, WETH } from 'dexbr-sdk'
// import KOVAN_TOKENS from './kovan'
// import MAINNET_TOKENS from './mainnet'
// import RINKEBY_TOKENS from './rinkeby'
import GOERLI_TOKENS from './goerli'

type AllTokens = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: Token }> }>
export const ALL_TOKENS: AllTokens = [
  // WETH on all chains
  ...Object.values(WETH),
  // chain-specific tokens
  ...GOERLI_TOKENS
]
  // remap WETH to ETH
  .map(token => {
    if (token.equals(WETH[token.chainId])) {
      ;(token as any).symbol = 'ETH'
      ;(token as any).name = 'Ether'
    }
    return token
  })
  // put into an object
  .reduce<AllTokens>(
    (tokenMap, token) => {
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    {
      [ChainId.MAINNET]: {},
      [ChainId.GÖRLI]: {}
    }
  )
