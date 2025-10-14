import Wallet from '../models/walletModel.js'
import Withdrawal from '../models/withdrawalModel.js';

export const requestWithdrawal = async (req, res) => {
    try {
        const {userId, amount, method, accountDetails } = req.body

        const wallet = await Wallet.findOne({ user:userId});

        if(!wallet){
            return res.status(404).json({
                success:false,
                message:"Wallet not Found"
            })
        }

        if(wallet.balance < amount){
            return res.status(400).json({success:false, message:"Insufficient Balance"})
        } 

        const withdrawal = await Withdrawal.create({
            user: userId,
            amount,
            method,
            accountDetails
        })

        res.status(201).json({
            success:true,
            message:`Withdrawal Request submitted Successfully`,
            withdrawal
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:`Error requesting withdrawal: ${error.message}`
        })
    }
}

// 🧑‍💼 Admin confirms withdrawal
export const handleWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ success: false, message: "Already processed" });
    }

    const wallet = await Wallet.findOne({ user: withdrawal.user });

    if (status === "approved") {
      if (wallet.balance < withdrawal.amount) {
        return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
      }

      // Deduct from wallet
      wallet.balance -= withdrawal.amount;
      wallet.transactions.push({
        type: "debit",
        amount: withdrawal.amount,
        description: "Withdrawal approved",
        reference: withdrawal._id,
      });
      await wallet.save();

      withdrawal.status = "approved";
      withdrawal.processedAt = Date.now();
      await withdrawal.save();
    } else if (status === "rejected") {
      withdrawal.status = "rejected";
      withdrawal.processedAt = Date.now();
      await withdrawal.save();
    }

    res.status(200).json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      withdrawal,
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error processing withdrawal: ${error.message}`,
    });
  }
};

