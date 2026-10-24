import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SendChatMessageDto {
  @ApiProperty({
    example: 'Criaram uma conta falsa com a minha foto e estão a gozar comigo.',
  })
  @IsString()
  @MinLength(1)
  content: string;
}
