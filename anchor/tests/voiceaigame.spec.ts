import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Voiceaigame} from '../target/types/voiceaigame'

describe('voiceaigame', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Voiceaigame as Program<Voiceaigame>

  const voiceaigameKeypair = Keypair.generate()

  it('Initialize Voiceaigame', async () => {
    await program.methods
      .initialize()
      .accounts({
        voiceaigame: voiceaigameKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([voiceaigameKeypair])
      .rpc()

    const currentCount = await program.account.voiceaigame.fetch(voiceaigameKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Voiceaigame', async () => {
    await program.methods.increment().accounts({ voiceaigame: voiceaigameKeypair.publicKey }).rpc()

    const currentCount = await program.account.voiceaigame.fetch(voiceaigameKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Voiceaigame Again', async () => {
    await program.methods.increment().accounts({ voiceaigame: voiceaigameKeypair.publicKey }).rpc()

    const currentCount = await program.account.voiceaigame.fetch(voiceaigameKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Voiceaigame', async () => {
    await program.methods.decrement().accounts({ voiceaigame: voiceaigameKeypair.publicKey }).rpc()

    const currentCount = await program.account.voiceaigame.fetch(voiceaigameKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set voiceaigame value', async () => {
    await program.methods.set(42).accounts({ voiceaigame: voiceaigameKeypair.publicKey }).rpc()

    const currentCount = await program.account.voiceaigame.fetch(voiceaigameKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the voiceaigame account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        voiceaigame: voiceaigameKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.voiceaigame.fetchNullable(voiceaigameKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
