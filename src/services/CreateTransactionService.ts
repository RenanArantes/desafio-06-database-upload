import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
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
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const validBalance = transactionRepository.getBalance();

    console.log(`${(await validBalance).outcome} - ${value}`);

    if (type === 'outcome' && (await validBalance).income <= value) {
      throw new AppError(
        'Invalid balance, yours outcome can`t be greater than your income',
      );
    }

    let checkCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

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
