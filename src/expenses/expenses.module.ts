import { Module } from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExpensesController],
  providers: [ExpenseService, PrismaService],
})
export class ExpensesModule {}
