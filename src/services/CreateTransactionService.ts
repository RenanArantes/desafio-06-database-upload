import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let checkCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    console.log(`########!!!!!!!!!!!!!!!!!!1${category}`);

    if (!checkCategory) {
      checkCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(checkCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: checkCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
