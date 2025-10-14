import affiliatePurchaseModel from "../models/affiliatePurchaseModel.js";
import User from "../models/User.js"
import Wallet from '../models/walletModel.js'

export const getAdminDashboard = async (req, res) =>{
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalCommissions = await affiliatePurchaseModel.aggregate([
            { $match:{ status: "approved" }},
            { $group: {_id: null, total: { $sum: "$commissionAmount"} } }
        ]);
        const pendingWithdrawals = await Withdrawal.countDocuments({status: "pending"});

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCommissions: totalCommissions[0]?.total || 0,
                pendingWithdrawals,
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message:`Error in adminDashboard${error.message}`})
    }
}

// ✅ Approve or Reject Affiliate Purchase
export const approveAffiliatePurchase = async (req, res) => {
  try {
    const { purchaseId, action } = req.body; // action = "approve" | "reject"
    const purchase = await AffiliatePurchase.findById(purchaseId);

    if (!purchase) return res.status(404).json({ success: false, message: "Purchase not found" });

    if (purchase.status !== "pending") {
      return res.status(400).json({ success: false, message: "Already processed" });
    }

    if (action === "approve") {
      purchase.status = "approved";
      await purchase.save();

      let wallet = await Wallet.findOne({ user: purchase.user });
      if (!wallet) wallet = new Wallet({ user: purchase.user, balance: 0, transactions: [] });

      wallet.balance += purchase.commissionAmount;
      wallet.transactions.push({
        type: "credit",
        amount: purchase.commissionAmount,
        description: "Affiliate purchase approved",
        reference: purchase._id
      });
      await wallet.save();
    } else {
      purchase.status = "rejected";
      await purchase.save();
    }

    res.status(200).json({
      success: true,
      message: `Purchase ${action} successfully`,
      purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 💰 Handle Withdrawal (approve/reject)
export const handleWithdrawalRequest = async (req, res) => {
  try {
    const { withdrawalId, action } = req.body; // "approve" or "reject"
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) return res.status(404).json({ success: false, message: "Withdrawal not found" });

    const wallet = await Wallet.findOne({ user: withdrawal.user });

    if (action === "approve") {
      if (wallet.balance < withdrawal.amount) {
        return res.status(400).json({ success: false, message: "Insufficient balance" });
      }
      wallet.balance -= withdrawal.amount;
      wallet.transactions.push({
        type: "debit",
        amount: withdrawal.amount,
        description: "Withdrawal approved",
        reference: withdrawal._id,
      });
      await wallet.save();
      withdrawal.status = "approved";
    } else {
      withdrawal.status = "rejected";
    }

    withdrawal.processedAt = Date.now();
    await withdrawal.save();

    res.status(200).json({
      success: true,
      message: `Withdrawal ${action} successfully`,
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};