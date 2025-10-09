import affiliatePurchaseModel from "../models/affiliatePurchaseModel.js"
import walletModel from "../models/walletModel.js";

export const tracksAffiliatePurchase = async (req, res) =>{
    try {
        const { userId, productId, affiliateLink, commisionAmount} = req.body

        const newPurchase = new affiliatePurchaseModel({
            user:userId,
            product:productId,
            affiliateLink,
            commisionAmount,
            status:"pending"
        });

        await newPurchase.save();

        res.status(201).json({
            success:true,
            message:"Affiliate click tracked successfully — awaiting admin confirmation",
            purchase:newPurchase
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message:`Error in trackAffialtePurchase ${error.message}`
        })
    }
}

//Admin confirms purchase (commision approved);
export const confirmAffiliatePurchase = async (req, res) =>{
    try {
        const { purchaseId} = req.params;

        const purchase = await affiliatePurchaseModel.findById(purchaseId);
        if(!purchaseId){
            return res.status(404).json({
                success:false,
                message:"Purchase not Found"
            })
        }

        if(purchase.status === "approved"){
            return res.status(400).json({ success: false,
                message:"Already Approved"
            })
        }

        purchase.status = "approved";
        await purchase.save();

        //Credits to user's wallet.
        let wallet = await walletModel.findOne({ user: purchase.user })
        if(!wallet){
            wallet = new wallet({ user: purchase.user, balance: 0, transactions: []})
        }

        wallet.balance += purchase.commissionAmount;
        wallet.transactions.push({
            type:"credit",
            amount: purchase.commissionAmount,
            description:"Affialiate purchase confirmed",
            reference: purchase._id
        });

        await wallet.save();

        res.status(200).json({
            success:true,
            message:"Purchase confirmed and commission credited",
            purchase,
            wallet
        })
    } catch (error) {
        res.status(500).json({success:false, message:`Error confirming ${error.message}`})
    }
}

//Admin Rejects purchase 
export const rejectAffiliatePurchase