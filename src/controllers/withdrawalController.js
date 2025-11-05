import Wallet from '../models/walletModel.js'
import Withdrawal from '../models/withdrawalModel.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.../.env' });


export const requestWithdrawal = async (req, res) => {
  try {
    const { userId, amount, method, accountDetails } = req.body
    const user = await Wallet.findById(userId);
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not Found"
      })
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient Balance" })
    }

    const withdrawal = await Withdrawal.create({
      user: userId,
      amount,
      method,
      accountDetails
    })

    // ✅ Notify Admin
    const subject = "🔔 New Withdrawal Request";
    const html = `
      <h2>🪙 New Withdrawal Request Received</h2>
      <p><strong>User:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Amount:</strong> $${amount}</p>
      <p><strong>Requested On:</strong> ${new Date().toLocaleString()}</p>
      ${wallet ? `<p><strong>Current Wallet Balance:</strong> $${wallet.balance}</p>` : ""}
      <hr/>
      <p>Please log in to the admin dashboard to review and process this request.</p>
    `;

    await sendEmail(process.env.EMAIL_USER, subject, html);

    res.status(201).json({
      success: true,
      message: `Withdrawal Request submitted Successfully`,
      withdrawal
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error requesting withdrawal: ${error.message}`
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

