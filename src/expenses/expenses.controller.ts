import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class ExpensesController {
  constructor(private readonly expensesService: ExpenseService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateExpenseDto) {
    const userId = req.user.id;
    return this.expensesService.create;
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.expensesService.findAll;
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.expensesService.findOne;
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    const userId = req.user.id;
    return this.expensesService.update;
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.expensesService.remove;
  }
}
