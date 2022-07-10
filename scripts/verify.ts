import { Verify, soul } from "./common"

const main = async () => {
    await Verify(soul, ["SoulBoundTokyo", "SBP", "1"])
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

