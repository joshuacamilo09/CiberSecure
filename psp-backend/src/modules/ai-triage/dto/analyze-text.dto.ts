import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class AnalyzeTextDto {
  @ApiProperty({
    example:
      'Criaram uma conta falsa com a minha foto e estão a gozar comigo num grupo.',
  })
  @IsString()
  @MinLength(5)
  text: string;

  @ApiPropertyOptional({
    example: 'teen',
  })
  @IsOptional()
  @IsString()
  ageGroup?: string;
}
