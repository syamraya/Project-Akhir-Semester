import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateIncomeDto) {
    try {
      const income = await this.prisma.income.create({ data });
      return {
        message: 'Income successfully created',
        data: income,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create income');
    }
  }

  async findAll() {
    try {
      const incomes = await this.prisma.income.findMany({ orderBy: { date: 'desc' } });
      return {
        message: incomes.length ? 'Income data retrieved successfully' : 'No income records found',
        data: incomes,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch income data');
    }
  }

  async findOne(id: number) {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income) throw new NotFoundException('Income not found');
    return {
      message: 'Income data retrieved successfully',
      data: income,
    };
  }

  async update(id: number, data: UpdateIncomeDto) {
    await this.findOne(id);
    try {
      const updated = await this.prisma.income.update({ where: { id }, data });
      return {
        message: 'Income successfully updated',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update income');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      await this.prisma.income.delete({ where: { id } });
      return {
        message: 'Income successfully deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete income');
    }
  }
}
