import env, { ethers } from 'hardhat'
import { KmsEthersSigner } from "aws-kms-ethers-signer";
import { HttpNetworkConfig } from "hardhat/types"

export const NilAddress = "0x000000000000000000000000000000000000000"
const region = process.env.AWS_REGION!; 
const keyId = process.env.KMS_KEY_ID!; 

export const KmsSigner = () => {
  const rpcUrl = (env.network.config as HttpNetworkConfig).url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new KmsEthersSigner({ keyId }).connect(provider);

  return signer
}
