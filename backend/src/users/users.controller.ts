import { Controller, Get, Put, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    const { password_hash, ...profile } = user;
    return profile;
  }

  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(req.user.userId, updateUserDto);
    const { password_hash, ...profile } = user;
    return profile;
  }

  @ApiOperation({ summary: 'Buscar usuário por código de compartilhamento' })
  @Get('sharing/:sharingCode')
  async getUserBySharingCode(@Param('sharingCode') sharingCode: string) {
    const user = await this.usersService.findBySharingCode(sharingCode);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  @ApiOperation({ summary: 'Conectar conta com código de compartilhamento' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('connect-sharing')
  async connectWithSharingCode(@Request() req, @Body() body: { sharing_code: string }) {
    return this.usersService.connectWithSharingCode(req.user.userId, body.sharing_code);
  }

  @ApiOperation({ summary: 'Buscar usuários que compartilham o mesmo código' })
  @Get('shared-users/:sharingCode')
  async getSharedUsers(@Param('sharingCode') sharingCode: string) {
    return this.usersService.getUsersBySharingCode(sharingCode);
  }
}
