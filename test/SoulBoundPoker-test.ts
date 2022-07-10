import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { expect, use } from 'chai'
import { BigNumberish, BytesLike, PayableOverrides, utils, ContractTransaction, BigNumber } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { EIP712Domain, Agreement } from "./helpers/eip712"
const ethSigUtil = require('eth-sig-util');

let owner:SignerWithAddress, addr1:SignerWithAddress, addr2:SignerWithAddress

import { SoulBoundTokyo } from "../typechain-types/index"

describe("testing for SoulBoundTokyo", async () => {
    let contract: SoulBoundTokyo

    beforeEach(async () => {
        [owner,addr1,addr2,] = await ethers.getSigners()

        const C1 = await ethers.getContractFactory("SoulBoundTokyo")
        contract = (await C1.deploy("SoulBoundTokyo", "SBP", "1")) as SoulBoundTokyo
        await contract.deployed()
    })

    describe("SoulBoundTokyo", async() => {
        const uri = "https://bafkreidbyhif3mj3aabjws5gf77pm6srj5gwoosonha4ysrdaqyvopvoqy.ipfs.nftstorage.link/"
 
        it("success", async () => {
            const domain = {
                name: 'SoulBoundTokyo',
                version: '1',
                chainId: 31337,
                verifyingContract: contract.address
            };
            
            // The named list of all type definitions
            const types = {
                Agreement: Agreement
            };

            // The data to sign
            const value = {
                active: addr1.address,
                passive: owner.address,
                tokenURI: uri
            };
            
            const sig = await owner._signTypedData(domain, types, value);

            await contract.connect(addr1).take(owner.address, uri, sig)
            console.log(await (await contract.balanceOf(addr1.address)).toString())
        })

        it("success", async () => {
            const ownerAddr = "0xC275b7e36faF2eBdaBf2B256443e88d911fd822e"

            const data = {
                primaryType: 'Agreement',
                types: { 
                    EIP712Domain: EIP712Domain, 
                    Agreement: Agreement
                },
                domain: { 
                    name: 'SoulBoundTokyo',
                    version: '1',
                    chainId: 31337,
                    verifyingContract: contract.address
                },
                message: { 
                    active: addr1.address,
                    passive: ownerAddr,
                    tokenURI: uri
                }
            }

            const buf = Buffer.from(process.env.PRIV_KEY!, "hex")
            const sig = ethSigUtil.signTypedMessage(buf, { data });

            await contract.connect(addr1).take(ownerAddr, uri, sig)
            console.log(await (await contract.balanceOf(addr1.address)).toString())
        })
    })
})
