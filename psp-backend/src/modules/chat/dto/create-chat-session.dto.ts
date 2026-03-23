import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateChatSessionDto {
  @ApiPropertyOptional({
    example: 'future-user-id',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
