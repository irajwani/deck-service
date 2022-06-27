import { Deck } from '../../Schemas/deck.schema';
import { TDeckPreview } from '../../Server/Deck/Types/deck';

export const formatDeckForPreview = (deck: Deck): TDeckPreview => ({
  deckId: deck.deckId,
  type: deck.type,
  isShuffled: deck.isShuffled,
  remaining: deck.remaining,
});
