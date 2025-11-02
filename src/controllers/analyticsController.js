import AffiliatePurchase from "../models/affiliatePurchaseModel.js";
import User from "../models/User.js";
import Wallet from "../models/walletModel.js";

export const getUserTransactionHistory = async(req,res) =>{
   try {
    const userId = req.user._id;

    const wallet = await Wallet.findOne({user: userId});
    const purchases = await AffiliatePurchase.find({user: userId}).populate("product");

    res.status(200).json({
        success:true,
        message:"User activity Fetched",
        data:{
            wallet,
            purchases
        },
    });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message})
   }
}

export const getAdminOverview = async (req, res) => {
    try {
        const totalUser = await User.countDocuments({ role : "user"});
        const totalProducts = await Product.countDocuments();

        const totalCommissions = await AffiliatePurchase.aggregate([
            { $match: {status: "approved"}},
            { $group: { _id:null, total: { $sum: "$commissionAmount"}}},
        ])

        const salesByDate = await AffiliatePurchase.aggregate([
            { $match: { status: "approved"}},
            {
                $group: {
                    _id: { $dateToString : {format: "%Y-%m-%d", date: "$createdAt"}},
                    totalSales: { $sum: "$purchaseAmount"},
                    totalCommission: { $sum: "$commissionAmount"},
                    count: { $sum: 1},
                }
            },
            { $sort : { _id: 1}},
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUser,
                totalProducts,
                totalCommissions: totalCommissions[0]?.total || 0,
                salesByDate,
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
    }
}