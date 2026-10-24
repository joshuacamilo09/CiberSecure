import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatbotMessageDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'Quais os serviços disponíveis?' })
  @IsString()
  content: string;
}

export class SendChatbotMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  message: string;

  @ApiProperty({ type: [ChatbotMessageDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatbotMessageDto)
  history?: ChatbotMessageDto[];
}