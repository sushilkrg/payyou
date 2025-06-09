import Transaction from "../models/Transaction.model.js";

export const getMyTransactions = async (req, res) => {
  try {
    // optional filter
    const { type } = req.query;

    const query = { user: req.user._id };
    if (type) {
      query.type = type; // 'add', 'send', 'receive'
    }

    const transaction = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ transaction });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
