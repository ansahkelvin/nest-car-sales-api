import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user: User = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }
  async findOneById(id: number) {
    return await this.repo.findOneBy({ id });
  }
  async updateUserDetails(id: number, attrs: Partial<User>) {
    const user: User = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async removeUser(id: number) {
    const user: User = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return this.repo.remove(user);
  }
}
