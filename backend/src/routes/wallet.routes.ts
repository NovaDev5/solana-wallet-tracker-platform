import { Router } from "express";
import { WalletController } from "../controllers/wallet.controllers";

const router = Router();


router.get("/ping", WalletController.serverping)
router.get("/pnl", WalletController.pnl);
router.get("/portfolio", WalletController.walletportfolio);
router.get("/walletdetails", WalletController.walletdetails);
router.get("/tokendetails", WalletController.tokendetails);
router.get("/snapshots", WalletController.tokensnapshots);
router.get("/addwallet", WalletController.addWallet);
router.get("/walletlists", WalletController.getWalletList);

export default router;
