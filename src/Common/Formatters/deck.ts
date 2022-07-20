import { IDeck } from '../../Schemas/deck.schema';
import { TDeckPreview } from '../../Server/Deck/Types/deck';

export const formatDeckForPreview = (deck: IDeck): TDeckPreview => ({
  _id: deck._id,
  type: deck.type,
  isShuffled: deck.isShuffled,
  remaining: deck.remaining,
});
