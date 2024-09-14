// const { User, Expense } = require("../relations/Relation");
const User = require("../models/User");
const Expense = require("../models/Expense");
// const sequelize = require("../config/database");
const { Parser } = require('json2csv');
const AWSService = require('../services/awsService');

//todo: Create a new User
exports.createExpense = async (req, res) => {
  const session = await Expense.startSession();
  session.startTransaction();

  try {
    const { amount, description, category } = req.body;

    const user = req.user
    const expense = new Expense({
      amount,
      category,
      description,
      userId: user._id
    });

    await expense.save({ session });

    // Update the user's totalExpense
    user.totalExpense += +amount;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json(expense);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// exports.createExpense = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { amount, description, category } = req.body;

//     const user = req.user
//     const expense = await user.createExpense(
//       {
//         amount,
//         category,
//         description,
//       },
//       { transaction }
//     );

//     // Update the user's totalExpense
//     user.totalExpense += +amount;
//     await user.save({ transaction });

//     res.json(expense);
//     await transaction.commit();
//   } catch (err) {
//     await transaction.rollback();
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// todo: Get all Expenses for a User with pagination and in reverse order
exports.getExpenses = async (req, res) => {
  try {
    const user = req.user;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // const { rows: expenses, count } = await Expense.findAndCountAll({
    //   where: { userId: user.id },
    //   limit,
    //   offset,
    //   order: [['createdAt', 'DESC']], // Order by createdAt in descending order
    // });

    const expenses = await Expense.find({ userId: user._id })
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 }); // Order by createdAt in descending order

    const totalItems = await Expense.countDocuments({ userId: user._id })

    const totalPages = Math.ceil(await Expense.countDocuments({ userId: user._id }) / limit)

    const isPremium = await user.isPremium; // todo: To show premium features to the frontend.

    res.json({
      expenses,
      isPremium,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



//todo: Delete expense
exports.deleteExpense = async (req, res) => {
  const session = await Expense.startSession();
  session.startTransaction();

  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId).session(session);

    if (!expense) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findById(expense.userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's totalExpense
    user.totalExpense -= expense.amount;

    const isPremium = user.isPremium; // For frontend

    await user.save({ session });
    await expense.remove({ session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Expense deleted successfully", isPremium });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.deleteExpense = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const expenseId = req.params.id;
//     const expense = await Expense.findByPk(expenseId, {
//       include: [{ model: User, attributes: ["id", "totalExpense"] }],
//       transaction,
//     });

//     if (!expense) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     const user = expense.User;

//     if (!user) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update the user's totalExpense
//     user.totalExpense -= expense.amount;

//     const isPremium = user.isPremium; //todo: To show premium features to the frontend.

//     await user.save({ transaction });

//     await expense.destroy({ transaction });

//     await transaction.commit();
//     res.json({ message: "Expense deleted successfully", isPremium });
//   } catch (err) {
//     await transaction.rollback();
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

//todo: Download Expenses Report


exports.downloadExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    // const expenses = await req.user.getExpenses({
    //   attributes: ['amount', 'category', 'description', 'createdAt']
    // });
    const expenses = await Expense.find({ userId })
      .select('amount category description createdAt')
      .exec();

    // Convert JSON to CSV
    const fields = ['amount', 'category', 'description', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(expenses);

    // Generate unique key for the file
    const key = `myExpenses-${userId}-${Date.now()}.csv`;

    // Upload CSV to S3 using AWSService
    const uploadResult = await AWSService.uploadToS3(process.env.BUCKET_NAME, key, csv);

    // Save file info to the database
    const fileInfo = { fileName: key, url: uploadResult.Location };
    const response = await req.user.createDownloaded(fileInfo);
    // console.log(response);

    return res.status(200).json({ fileUrl: uploadResult.Location });
  } catch (err) {
    // console.error('Error in downloadExpenses controller:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};