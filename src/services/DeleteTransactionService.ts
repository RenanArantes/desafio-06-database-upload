import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transationRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transationRepository.find({
      where: {
        id,
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not exists', 400);
    }

    await transationRepository.delete(id);
  }
}

export default DeleteTransactionService;
