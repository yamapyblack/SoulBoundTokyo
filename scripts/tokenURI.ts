import { ethers } from "hardhat";
import { KmsSigner } from "./common";
import { SoulBoundPoker } from "../typechain-types/index"

const main = async () => {
    const signer = KmsSigner()

    const soul = "0xc67010757022e25FcD15CDc7a6E00Ba53Ea0b139"

    const contract = (await ethers.getContractAt("SoulBoundPoker", soul, signer)) as SoulBoundPoker
    const tx = await contract.tokenURI(1)
    console.log(tx)
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

