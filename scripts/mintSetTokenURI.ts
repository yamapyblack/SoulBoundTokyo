import { ethers } from "hardhat";
import { KmsSigner } from "./common";
import { SoulBoundPoker } from "../typechain-types/index"

const main = async () => {
    const signer = KmsSigner()

    const soul = "0xc67010757022e25FcD15CDc7a6E00Ba53Ea0b139"
    const target = "0x95e311f6C2Fd8EA309C2777BCD973541D6c31325"

    const contract = (await ethers.getContractAt("SoulBoundPoker", soul, signer)) as SoulBoundPoker
    // const tx2 = await contract.mint(target, 1)
    // console.log(tx2)

    const tx = await contract.setTokenURI(1, "https://bafkreidbyhif3mj3aabjws5gf77pm6srj5gwoosonha4ysrdaqyvopvoqy.ipfs.nftstorage.link/")
    console.log(tx)
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

