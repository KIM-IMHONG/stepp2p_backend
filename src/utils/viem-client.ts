import { createPublicClient, createWalletClient, http, WalletClient, PublicClient } from 'viem'
import { bsc } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

export const createPublicViemClient = (rpcurl: string) =>
  createPublicClient({
    chain: bsc,
    transport: http(rpcurl),
  }) as PublicClient

export const createWalletViemClient = (rpcurl: string, privateKey: `0x${string}`) =>
  createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: bsc,
    transport: http(rpcurl),
  }) as WalletClient

export const getWalletClientWithAccount = (encrypted: string, rpcurl: string) => {
  const hex = Buffer.from(encrypted, 'base64').toString('hex')
  const privateKey = `0x${hex}` as `0x${string}`
  const account = privateKeyToAccount(privateKey)
  const client = createWalletViemClient(rpcurl, privateKey)
  return { client, account }
}
