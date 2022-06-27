import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import Constants from '../../../Common/constants';

export class DrawCardsDto {
  @IsInt()
  @Min(Constants.DRAW_CARDS_MIN)
  @Max(Constants.DRAW_CARDS_MAX)
  @ApiProperty({
    name: 'count',
    description: 'Specify how many cards to draw',
    example: 4,
  })
  count: number;
}
