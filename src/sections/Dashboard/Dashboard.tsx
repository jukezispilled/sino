import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SlideSection } from '../../components/Slider'
import { GAMES } from '../../games'
import { GameCard } from './GameCard'
import { WelcomeBanner } from './WelcomeBanner'

export function GameSlider() {
  return (
    <SlideSection>
      {GAMES.map((game) => (
        <div key={game.id} style={{ width: '160px', display: 'flex' }}>
          <GameCard game={game} />
        </div>
      ))}
    </SlideSection>
  )
}

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

const SolanaPrice = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1000;
  
  img {
    width: 16px;
    height: 16px;
  }
  
  .price-up {
    color: #4ade80;
  }
  
  .price-down {
    color: #f87171;
  }
`

export function GameGrid() {
  return (
    <Grid>
      {GAMES.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Grid>
  )
}

export default function Dashboard() {
  const [solanaPrice, setSolanaPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/solana');
        const data = await response.json();
        
        // Make sure we're getting numbers
        const currentPrice = parseFloat(data.market_data.current_price.usd);
        const priceChangePercent = parseFloat(data.market_data.price_change_percentage_24h);
        
        if (!isNaN(currentPrice)) {
          setSolanaPrice(currentPrice);
        }
        
        if (!isNaN(priceChangePercent)) {
          setPriceChange(priceChangePercent);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Solana price:', error);
        setLoading(false);
      }
    };

    fetchSolanaPrice();
    const interval = setInterval(fetchSolanaPrice, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <WelcomeBanner />
      <GameGrid />
      {!loading && solanaPrice !== null && (
        <SolanaPrice>
          <img src="https://assets.coingecko.com/coins/images/4128/small/solana.png" alt="SOL" />
          ${solanaPrice.toFixed(2)}
          {priceChange !== 0 && (
            <span className={priceChange >= 0 ? 'price-up' : 'price-down'}>
              {priceChange >= 0 ? '↑' : '↓'}{Math.abs(priceChange).toFixed(2)}%
            </span>
          )}
        </SolanaPrice>
      )}
    </div>
  )
}