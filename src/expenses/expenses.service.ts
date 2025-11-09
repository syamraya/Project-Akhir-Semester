import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExpenseDto) {
    try {
      const expense = await this.prisma.expense.create({ data });
      return {
        message: 'Expense successfully created',
        data: expense,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create expense');
    }
  }

  async findAll() {
    try {
      const expenses = await this.prisma.expense.findMany({ orderBy: { date: 'desc' } });
      return {
        message: expenses.length ? 'Expense data retrieved successfully' : 'No expense records found',
        data: expenses,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch expense data');
    }
  }

  async findOne(id: number) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    return {
      message: 'Expense data retrieved successfully',
      data: expense,
    };
  }

  async update(id: number, data: UpdateExpenseDto) {
    await this.findOne(id);
    try {
      const updated = await this.prisma.expense.update({ where: { id }, data });
      return {
        message: 'Expense successfully updated',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update expense');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      await this.prisma.expense.delete({ where: { id } });
      return {
        message: 'Expense successfully deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete expense');
    }
  }
}
