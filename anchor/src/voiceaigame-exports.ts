// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VoiceaigameIDL from '../target/idl/voiceaigame.json'
import type { Voiceaigame } from '../target/types/voiceaigame'

// Re-export the generated IDL and type
export { Voiceaigame, VoiceaigameIDL }

// The programId is imported from the program IDL.
export const VOICEAIGAME_PROGRAM_ID = new PublicKey(VoiceaigameIDL.address)

// This is a helper function to get the Voiceaigame Anchor program.
export function getVoiceaigameProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VoiceaigameIDL, address: address ? address.toBase58() : VoiceaigameIDL.address } as Voiceaigame, provider)
}

// This is a helper function to get the program ID for the Voiceaigame program depending on the cluster.
export function getVoiceaigameProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Voiceaigame program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOICEAIGAME_PROGRAM_ID
  }
}
