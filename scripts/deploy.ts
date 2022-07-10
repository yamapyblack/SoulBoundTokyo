import { ethers } from "hardhat";
import { KmsSigner } from "./common";
import { SoulBoundPoker } from "../typechain-types/index"

const main = async () => {
    const signer = KmsSigner()

    const c = await ethers.getContractFactory("SoulBoundPoker");
    const contract = (await c.connect(signer).deploy("SoulBoundPoker", "SBP", "1")) as SoulBoundPoker
    await contract.deployed();
    console.log('deployed txHash:', contract.deployTransaction.hash);
    console.log('deployed address:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

