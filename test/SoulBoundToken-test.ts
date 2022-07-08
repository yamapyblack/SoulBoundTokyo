import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner:SignerWithAddress, addr1:SignerWithAddress, addr2:SignerWithAddress

import { SoulBoundTokenMock } from "../typechain-types/index"

describe("testing for SoulBoundTokenMock", async () => {
    let contract: SoulBoundTokenMock

    beforeEach(async () => {
        [owner,addr1,addr2,] = await ethers.getSigners()

        const C1 = await ethers.getContractFactory("SoulBoundTokenMock")
        contract = (await C1.deploy("SoulBoundPoker", "SBP")) as SoulBoundTokenMock
        await contract.deployed()
    })

    describe("SoulBoundTokenMock", async() => {
        it("success", async () => {
            await contract.mint(addr1.address, 1)
            expect(await contract.ownerOf(1)).equals(addr1.address)
            await contract.burn(1)
            await expect(contract.ownerOf(1)).reverted
        })
        it("fail", async () => {
            // mint by user
            await expect(contract.connect(addr1).mint(addr1.address, 1)).reverted

            // transfer by user
            await contract.mint(addr1.address, 1)
            await expect(contract.connect(addr1).transferFrom(addr1.address, addr2.address, 1)).revertedWith("SoulBoundToken: not to be transferred")

            // burn by user
            await expect(contract.connect(addr1).burn(1)).reverted
        })
    })
})
