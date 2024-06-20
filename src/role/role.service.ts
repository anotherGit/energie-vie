import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum } from './role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  findByName(name: string) {
    return this.roleRepository.findOne({
      where: { name },
    });
  }

  async ensureRoleExistInDB() {
    const roles = Object.values(RoleEnum);
    for (const roleName of roles) {
      const existing = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!existing) {
        const role = new Role({ name: roleName });

        await this.roleRepository.save(role);
      }
    }
  }
}
