const { User, Expense } = require("../relations/Relation");
const sequelize = require("../config/database");

const { Parser } = require('json2csv');
const AWS = require("aws-sdk");

// Create a new User
exports.createExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = User.verifyToken(token);

    const user = await User.findOne({ where: { id: decoded.id }, transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await user.createExpense(
      {
        amount,
        category,
        description,
      },
      { transaction }
    );

    // Update the user's totalExpense
    user.totalExpense += +amount;
    await user.save({ transaction });

    res.json(expense);
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all Expenses for a User

exports.getExpenses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = User?.verifyToken(token);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const expenses = await user.getExpenses();

    const isPremium = await user.isPremium; // todo: To show premium features to the frontend.

    res.json({ expenses, isPremium });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//todo: Delete expense
exports.deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId, {
      include: [{ model: User, attributes: ["id", "totalExpense"] }],
      transaction,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = expense.User;

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's totalExpense
    user.totalExpense -= expense.amount;

    const isPremium = user.isPremium; //todo: To show premium features to the frontend.

    await user.save({ transaction });

    await expense.destroy({ transaction });

    await transaction.commit();
    res.json({ message: "Expense deleted successfully", isPremium });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const userId = req.user.id;
    const expenses = await req.user.getExpenses({
      attributes: ['amount', 'category', 'description', 'createdAt']
    });

    // Convert JSON to CSV
    const fields = ['amount', 'category', 'description', 'createdAt']
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(expenses);

    const key = `myExpenses${userId}${Date.now()}.csv`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: csv,
      ACL: "public-read",
      ContentType: "text/csv"
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Error generating signed URL" });
      }

      const fileInfo = {fileName: key, url: data.Location}
      const  response = await req.user.createDownloaded(fileInfo)
      console.log(response);

      return res.status(200).json({ fileUrl: data.Location });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

