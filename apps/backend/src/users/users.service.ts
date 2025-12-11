import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private users: User[] = [
    { id: 1, name: 'Alice', email: '', role: 'ENGINEER' },
    { id: 2, name: 'Bob', email: '', role: 'MANAGER' },
    { id: 3, name: 'Charlie', email: '', role: 'ADMIN' },
  ];

  findAll(role?: User['role']) {
    if (role) {
      return this.users.filter((user) => user['role'] === role);
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const newId = this.users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
    this.users.push({ id: newId, ...createUserDto });
    return { id: newId, ...createUserDto };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      Object.assign(user, updateUserDto);
      return user;
    }
  }

  remove(id: number) {
    const removedUser = this.findOne(id);
    if (!removedUser) {
      return null;
    }
    this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
