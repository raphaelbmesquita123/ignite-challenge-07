import { useState } from 'react';
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';

//components
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

export interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imgUrl, setImgUrl] = useState('');

  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleModalImg(url: string): void {
    onOpen();
    setImgUrl(url);
  }

  return (
    <>
      <SimpleGrid
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 2fr))"
        spacing={10}
      >
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleModalImg} />
        ))}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imgUrl} />
    </>
  );
}
