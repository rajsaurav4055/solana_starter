import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { JSDocParsingMode } from "typescript";
import { json } from "stream/consumers";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/JjjQE-PvNaaHT-YyUuLCm7MjjFKcYSPFId1z6HCTCYo"
        const metadata = {
            name: "RUGGERS",
            symbol: "WBA",
            description: "Community of Ruggers",
            image: image,
            attributes: [
                {trait_type: 'Power Move', value: 'Sol drainers'},
                {trait_type: 'Moat', value: 'Always ready to help'},
                {trait_type: 'Goal', value: 'We ship'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://arweave.net/JjjQE-PvNaaHT-YyUuLCm7MjjFKcYSPFId1z6HCTCYo"
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
