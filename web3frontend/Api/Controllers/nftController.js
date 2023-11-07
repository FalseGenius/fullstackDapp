import NFT from "../Model/nftModel";

export const getAllNfts = async (req, res, next) => {
    const nfts = await NFT.find();
    res.status(200).json({
        status:"success",
        results:nfts.length,
        data:{
            nfts
        }
    })
}

export const getNft = async (req, res, next) => {
    const nft = await NFT.findById(req.params.id);
    res.status(200).json({
        status:"success",
        data:{
            nft
        }
    })
}

export const createNft = async (req, res, next) => {
    console.log(req.body);
    const newNFT = await NFT.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            nft:newNFT
        }
    })
}