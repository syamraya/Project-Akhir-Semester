import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';

@Module({
  imports: [UsersModule, ExpensesModule, IncomesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
