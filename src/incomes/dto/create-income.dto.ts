import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateIncomeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
