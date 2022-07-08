import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { expect, use } from 'chai'
import { BigNumberish, BytesLike, PayableOverrides, utils, ContractTransaction, BigNumber } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner:SignerWithAddress, addr1:SignerWithAddress, addr2:SignerWithAddress

import { SoulBoundPoker } from "../typechain-types/index"

describe("testing for SoulBoundPoker", async () => {
    let contract: SoulBoundPoker

    beforeEach(async () => {
        [owner,addr1,addr2,] = await ethers.getSigners()

        const C1 = await ethers.getContractFactory("SoulBoundPoker")
        contract = (await C1.deploy("SoulBoundPoker", "SBP")) as SoulBoundPoker
        await contract.deployed()
    })

    describe("SoulBoundPoker", async() => {
        it("success URI", async () => {
            await contract.setTokenURI(1, "")
            await contract.mint(addr1.address, 1)
        })
        it("success burn by owner", async () => {
            await contract.mint(addr1.address, 1)
            await contract.burn(1)
            console.log(await contract.ownerOf(1))
            // expect().equals()
        })
        it("fail", async () => {
            // mint by user
            // transfer by user and owner
            // burn by user
        })
    })
})
