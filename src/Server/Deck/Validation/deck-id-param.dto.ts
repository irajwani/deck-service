import { IsMongoId, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeckIdParamDto {
  @IsUUID()
  @ApiProperty({ name: '_id' })
  _id: string;
}
