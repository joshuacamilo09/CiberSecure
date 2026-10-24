import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserHistoryQueryDto } from './dto/user-history-query.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users/me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  profile(@CurrentUser() user: { userId: string }) {
    return this.usersService.getProfile(user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get aggregated user history' })
  history(
    @CurrentUser() user: { userId: string },
    @Query() query: UserHistoryQueryDto,
  ) {
    return this.usersService.getHistory(user.userId, query);
  }

  @Get('analyses')
  @ApiOperation({ summary: 'Get authenticated user analyses' })
  analyses(
    @CurrentUser() user: { userId: string },
    @Query() query: UserHistoryQueryDto,
  ) {
    return this.usersService.getAnalyses(user.userId, query);
  }

  @Get('chats')
  @ApiOperation({ summary: 'Get authenticated user chat sessions' })
  chats(
    @CurrentUser() user: { userId: string },
    @Query() query: UserHistoryQueryDto,
  ) {
    return this.usersService.getChats(user.userId, query);
  }
}
