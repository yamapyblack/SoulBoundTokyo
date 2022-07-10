import env, { ethers } from 'hardhat'
import { KmsEthersSigner } from "aws-kms-ethers-signer";
import { HttpNetworkConfig } from "hardhat/types"

export const NilAddress = "0x000000000000000000000000000000000000000"
export const ownerAddr = "0xC275b7e36faF2eBdaBf2B256443e88d911fd822e"
export const receiverAddr = "0x95e311f6C2Fd8EA309C2777BCD973541D6c31325"
export const soul = "0xdD8Eb97a180C165D2c61062FFdEB683B271AE485"

const region = process.env.AWS_REGION!; 
const keyId = process.env.KMS_KEY_ID!; 

export const KmsSigner = () => {
  const rpcUrl = (env.network.config as HttpNetworkConfig).url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new KmsEthersSigner({ keyId }).connect(provider);

  return signer
}

export const Verify = async (address: string, args: any[]) => {
  try {
    await env.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message == "Missing or invalid ApiKey") {
      console.log("Skip verifing with", e.message);
      return;
    }
    if (e.message == "Contract source code already verified") {
      console.log("Skip verifing with", e.message);
      return;
    }
    throw e;
  }
};
