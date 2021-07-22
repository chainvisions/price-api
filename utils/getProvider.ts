import { ethers } from 'ethers'

export const getProvider = (chainId: number) => {
    let provider
    switch(chainId) {
        case 56:
            provider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL)
            break;
        case 137:
            provider = new ethers.providers.JsonRpcProvider(process.env.POLY_RPC_URL)
            break;
        default:
            console.error(`Unsupported chainId: ${chainId}`)
    }
    return provider
}

export default getProvider