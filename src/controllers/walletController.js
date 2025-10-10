import Wallet from '../models/walletModel.js'
export const getUserWallet = async (req, res) => {
    try {
        const { userId } = req.params;
        const wallet = await Wallet.findOne({user: userId});
        if(!wallet){
            return res.status(404).message({success:"false", message:"Wallet Not Found"})
        }

        res.status(200).json({
            success:true,
            message:"Wallet fetched successfully",
            wallet
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Error in getUserWallet ${error.message}`
        })
    }
}

export const filterTransactions = async(req, res) =>{
    try {
        const { userId } = req.params;
        const { type, startDate, endDate } = req.query;

        const wallet = await Wallet.findOne({user:userId})
        if(!wallet){
            return res.status(404).json({
                success:false,
                message:"Wallet Not Found"
            })
        }
        let filtered = wallet.transactions;
        if(type){
            filtered = filtered.filter((t) => t.type === type);
        } 
        if(startDate && endDate){
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = filtered.filter((t) => new Date(t.date) >= start && new Date(t.date) <= end);
        }
        res.status(200).json({
            success:true,
            cout: filtered.length,
            transactions: filtered
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:`Error filtering Transaction : ${error.message}`
        })
    }
}