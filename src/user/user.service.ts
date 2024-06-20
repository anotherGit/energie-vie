import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RoleService } from '../role/role.service';
import { RoleEnum } from '../role/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: { roles: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    await this.roleService.ensureRoleExistInDB();

    const userRole = await this.roleService.findByName(RoleEnum.User);

    const user = new User({
      ...createUserDto,
      roles: [userRole],
    });

    return this.userRepository.save(user);
  }

  async addRole(id: string, roleName: RoleEnum) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.roleService.findByName(roleName);
    if (!role) {
      throw new Error('Role not found');
    }

    user.roles = [...user.roles, role];

    return this.userRepository.save(user);
  }
}
