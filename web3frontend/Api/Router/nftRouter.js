import express from "express";
import * as nftController from '../Controllers/nftController';

const router = express.Router();

router.route('/').get(nftController.getAllNfts).post(nftController.createNft);
router.route("/:id").get(nftController.getNft);

export default router;

