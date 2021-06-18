import { Controller, Get, Param } from '@nestjs/common';
import { Contract, Provider } from 'ethcall';
import getProvider from 'utils/getProvider';
import IUniswapV2Pair  from '@uniswap/v2-core/build/IUniswapV2Pair.json'

@Controller('price')
export class PriceController {
    @Get(':chainId/:address')
    async fetchPrice(@Param() params): Promise<string> {
        let provider = getProvider(params.chainId)
        return '$100'
    }
}