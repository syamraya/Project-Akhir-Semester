import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Validasi email duplikat (karena email adalah unique field)
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email sudah digunakan');
    }

    // Validasi username duplikat menggunakan findFirst
    const existingUserByName = await this.prisma.user.findFirst({
      where: { name: createUserDto.name },
    });

    if (existingUserByName) {
      throw new ConflictException('Username sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.SALT_ROUNDS,
    );

    // Buat user baru
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      status: 'success',
      message: 'Pengguna berhasil ditambahkan',
      data: user,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      status: 'success',
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return {
      status: 'success',
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Cek apakah user exists
    const user = await this.prisma.user.findUnique({ 
      where: { id } 
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Validasi jika mengubah username
    if (updateUserDto.name && updateUserDto.name !== user.name) {
      const existingUser = await this.prisma.user.findFirst({
        where: { name: updateUserDto.name },
      });

      if (existingUser) {
        throw new ConflictException('Username sudah digunakan');
      }
    }

    // Validasi jika mengubah email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email sudah digunakan');
      }
    }

    // Prepare data untuk update
    const dataToUpdate: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'USER' | 'ADMIN';
    } = {};

    if (updateUserDto.name) dataToUpdate.name = updateUserDto.name;
    if (updateUserDto.email) dataToUpdate.email = updateUserDto.email;
    if (updateUserDto.role) dataToUpdate.role = updateUserDto.role;

    // Hash password jika ada perubahan
    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      status: 'success',
      message: 'Pengguna berhasil diubah',
      data: updatedUser,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    await this.prisma.user.delete({ where: { id } });

    return {
      status: 'success',
      message: `User ${user.name} berhasil dihapus`,
    };
  }
}
