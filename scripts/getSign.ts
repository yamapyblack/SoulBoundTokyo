import env, { ethers } from 'hardhat'
import { HttpNetworkConfig } from "hardhat/types"
import { KmsSigner, ownerAddr, receiverAddr, soul } from "./common";
import { SoulBoundTokyo } from "../typechain-types/index"
import { EIP712Domain, Agreement } from "../test/helpers/eip712"
const ethSigUtil = require('eth-sig-util');

const main = async () => {
    const signer = KmsSigner()

    const uri = "https://bafkreidbyhif3mj3aabjws5gf77pm6srj5gwoosonha4ysrdaqyvopvoqy.ipfs.nftstorage.link/"

    const contract = (await ethers.getContractAt("SoulBoundTokyo", soul, signer)) as SoulBoundTokyo

    const data = {
        primaryType: 'Agreement',
        types: { 
            EIP712Domain: EIP712Domain, 
            Agreement: Agreement
        },
        domain: { 
            name: 'SoulBoundTokyo',
            version: '1',
            chainId: (env.network.config as HttpNetworkConfig).chainId,
            verifyingContract: contract.address
        },
        message: { 
            active: receiverAddr,
            passive: ownerAddr,
            tokenURI: uri
        }
    }

    const buf = Buffer.from(process.env.PRIV_KEY!, "hex")
    const sig = ethSigUtil.signTypedMessage(buf, { data });
    console.log(sig)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

