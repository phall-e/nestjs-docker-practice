import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { ApiConflictResponse, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('User')
@Controller({
  path: 'admin/users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: UserResponseDto,
    description: 'Create User',
  })
  @ApiConflictResponse({
    description: 'User is existed',
  })
  public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  @ApiResponse({ 
    status: 200,
    type: [UserResponseDto],
    description: 'Listing the users',
  })
  public findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'Find one the user',
  })
  @ApiNotFoundResponse({
    description: 'User is not found',
  })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'User updated successfully'
  })
  @ApiNotFoundResponse({
    description: 'User is not found',
  })
  public update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'User deleted successfull',
  })
  @ApiNotFoundResponse({
    description: 'User is not found',
  })
  public remove(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.remove(id);
  }
}
