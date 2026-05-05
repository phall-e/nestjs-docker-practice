import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UserEntity } from "./entities/user.entity";

export class UserMapper {
    public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
        const dto = new UserResponseDto();

        dto.id = entity.id;
        dto.username = entity.username;
        dto.email = entity.email;
        dto.isSuperUser = entity.isSuperUser;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        return dto;
    }

    public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
        const entity = new UserEntity();

        entity.username = dto.username;
        entity.email = dto.email;
        entity.password = dto.password;
        entity.isSuperUser = dto.isSuperUser;

        return entity;
    }

    public static toUpdateEntity(entity: UserEntity, dto: UpdateUserRequestDto): UserEntity {
        entity.username = dto.username;
        entity.email = dto.email;
        entity.password = dto.password;
        entity.isSuperUser = dto.isSuperUser;

        return entity;
    }
}