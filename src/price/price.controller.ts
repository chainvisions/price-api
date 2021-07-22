import { Controller, Get, Param } from '@nestjs/common'
import { ethers } from 'ethers'
import { Contract, Provider } from 'ethcall'
import { LPABI, BaseMappings } from 'src/constants'
import getProvider from 'utils/getProvider'
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json'

// Price caching, saved in an array that looks like the following:
// [price, data expiration (Should be calculated as Date.now() + 1800)]
let priceCache = {}

@Controller('price')
export class PriceController {
    @Get(':chainId/:address/:base')
    async fetchPrice(@Param() params): Promise<string> {
        console.log(params)
        const getPrice = async (chainId: number, pairAddress: string, base: number) => {
            console.log(chainId, pairAddress, base)
            if(priceCache[pairAddress] && priceCache[pairAddress][1] >= Date.now()) {
                return priceCache[pairAddress][0]
            } else {
                let provider = getProvider(chainId)
                let multicallProvider = new Provider()
                await multicallProvider.init(provider)
        
                let pairContract = new Contract(pairAddress, LPABI)
                let [token0, token1, { _reserve0, _reserve1 }] = await multicallProvider.all([
                    pairContract.token0(),
                    pairContract.token1(),
                    pairContract.getReserves()
                ])
        
                let token0Contract = new Contract(token0, LPABI)
                let token1Contract = new Contract(token1, LPABI)
    
                let [token0Symbol, token1Symbol, token0Decimals, token1Decimals] = await multicallProvider.all([
                    token0Contract.symbol(),
                    token1Contract.symbol(),
                    token0Contract.decimals(),
                    token1Contract.decimals()
                ])
    
                if(base == 0) {
                    if(token0Symbol == 'USDT' || token0Symbol == 'USDC' || token0Symbol == 'DAI' || token0Symbol == 'BUSD') {
                        let tokenPrice = (Number(ethers.utils.formatUnits(_reserve0, token1Decimals)) * 1) / Number(ethers.utils.formatUnits(_reserve1, token1Decimals))
                        priceCache[pairAddress] = [tokenPrice, Date.now() + 1800]
                        return tokenPrice
                    } else {
                        let basePrice = await getPrice(chainId, BaseMappings[token0Symbol], 0)
                        let tokenPrice = (Number(ethers.utils.formatUnits(_reserve0, token1Decimals)) * basePrice) / Number(ethers.utils.formatUnits(_reserve1, token1Decimals))
                        priceCache[pairAddress] = [tokenPrice, Date.now() + 1800]
                    }
                } else {
                    if(token1Symbol == 'USDT' || token1Symbol == 'USDC' || token1Symbol == 'DAI' || token1Symbol == 'BUSD') {
                        let tokenPrice = (Number(ethers.utils.formatUnits(_reserve1, token1Decimals)) * 1) / Number(ethers.utils.formatUnits(_reserve0, token0Decimals))
                        priceCache[pairAddress] = [tokenPrice, Date.now() + 1800]
                        return tokenPrice
                    } else {
                        let basePrice = await getPrice(chainId, BaseMappings[token1Symbol], 0)
                        let tokenPrice = (Number(ethers.utils.formatUnits(_reserve1, token1Decimals)) * basePrice) / Number(ethers.utils.formatUnits(_reserve0, token0Decimals))
                        priceCache[pairAddress] = [tokenPrice, Date.now() + 1800]
                        return tokenPrice
                    }
                }
            }
        }

        let price = await getPrice(Number(params.chainId), params.address, Number(params.base))

        return price
    }

    @Get('/lp/:chainId/:address')
    async fetchLPPrice(@Param() params): Promise<string> {
        console.log(params)
        // TODO: Price fetching for LPs.
        return ''
    }
}