import { Module } from '@nestjs/common';
import { IncomeService } from './incomes.service';
import { IncomeController } from './incomes.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [IncomeController],
  providers: [IncomeService, PrismaService],
})
export class IncomeModule {}
