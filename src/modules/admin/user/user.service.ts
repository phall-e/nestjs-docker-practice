import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { UserMapper } from './user.mapper';
import { PasswordHash } from 'src/utils/password-hash.util';
import { handleError } from 'src/utils/handle-error.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = UserMapper.toCreateEntity({
        ...dto,
        password: await PasswordHash.hash(dto.password),
      });
      entity = await this.userRepository.save(entity);
      await this.cacheManager.del('users_all');

      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAll(): Promise<UserResponseDto[]> {
    try {
      const cache: UserResponseDto[] = await this.cacheManager.get('users_all');
      if (cache) {
        return cache;
      }
      const entities = await this.userRepository.find({
        order: {
          id: 'DESC',
        },
      });

      const itemMapped = await Promise.all(
        entities.map(item => UserMapper.toDto(item)),
      );

      await this.cacheManager.set('users_all', itemMapped, 60 * 5);

      return itemMapped;

    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<UserResponseDto> {
    try {
      const key = `user_${id}`;
      const cache: UserResponseDto = await this.cacheManager.get(key);
      if (cache) return cache;
      const entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      const entityMapped = UserMapper.toDto(entity);
      await this.cacheManager.set(key, entityMapped, 60);
      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: number, dto: UpdateUserRequestDto) {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = UserMapper.toUpdateEntity(entity, dto);
      entity = await this.userRepository.save(entity);
      await this.cacheManager.del('users_all');
      await this.cacheManager.del(`user_${id}`);
      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      await this.userRepository.softDelete(id);
      await this.cacheManager.del(`user_${id}`);
      await this.cacheManager.del('users_all');

      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
