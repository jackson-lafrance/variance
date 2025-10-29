import React, { useState } from 'react';
import Header from '../../components/Header';
import CollapsibleSection from '../../components/CollapsibleSection';
import './AdvancedTechniques.css';

export default function AdvancedTechniques() {
  const [cutCardPosition, setCutCardPosition] = useState(52);
  const [sequenceCards, setSequenceCards] = useState<string[]>([]);
  const [inputCard, setInputCard] = useState('');
  const [cardError, setCardError] = useState('');

  const calculatePenetration = () => {
    const totalCards = 312;
    const cardsDealt = totalCards - cutCardPosition;
    return ((cardsDealt / totalCards) * 100).toFixed(1);
  };

  const isValidCard = (card: string): boolean => {
    const upper = card.toUpperCase();
    const validRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const validSuits = ['C', 'D', 'H', 'S'];
    
    if (upper.length < 2 || upper.length > 3) return false;
    
    const suit = upper[upper.length - 1];
    const rank = upper.substring(0, upper.length - 1);
    
    return validRanks.includes(rank) && validSuits.includes(suit);
  };

  const addCardToSequence = () => {
    if (inputCard && sequenceCards.length < 10) {
      const formattedCard = inputCard.toUpperCase().trim();
      if (isValidCard(formattedCard)) {
        setSequenceCards([...sequenceCards, formattedCard]);
        setInputCard('');
        setCardError('');
      } else {
        setCardError('Invalid card format. Use: AS, 10H, KD, etc.');
      }
    }
  };

  const clearSequence = () => {
    setSequenceCards([]);
    setCardError('');
  };

  const handleInputChange = (value: string) => {
    setInputCard(value);
    if (cardError) setCardError('');
  };

  const getRank = (card: string): string => {
    const suit = card[card.length - 1];
    return card.substring(0, card.length - 1);
  };

  const countHighCards = () => {
    return sequenceCards.filter(card => {
      const rank = getRank(card);
      return ['10', 'J', 'Q', 'K', 'A'].includes(rank);
    }).length;
  };

  const isGoodSequence = () => {
    const highCount = countHighCards();
    return highCount >= 6;
  };

  return (
    <div className="advanced-techniques-page">
      <div className="advanced-techniques-header">
        <Header />
        <p className="advanced-techniques-subtitle">
          Beyond basic card counting: Advanced techniques used by professional advantage players.
          These methods require extensive practice and are not for beginners.
        </p>
      </div>

      <div className="advanced-techniques-content">
        <CollapsibleSection title="Shuffle Tracking">
          <h3>What is Shuffle Tracking?</h3>
          <p>
            Shuffle tracking is an advanced technique where you track segments of cards (usually high-card rich or
            low-card rich "slugs") through the shuffle. If you can identify where these slugs end up after the shuffle,
            you can increase your bets when you know high-value cards are about to be dealt.
          </p>

          <h3>How It Works</h3>
          <p>
            During play, you track specific sections of the discard tray. When you notice a favorable slug
            (lots of high cards), you mentally note its position. During the shuffle, you follow where that
            slug moves. After the shuffle, you cut the cards to place your favorable slug at the top of the shoe.
          </p>

          <h3>Key Concepts</h3>
          <ul>
            <li><strong>Slug:</strong> A group of cards (usually 10-20) that you're tracking through the shuffle</li>
            <li><strong>Favorable Slug:</strong> A slug rich in high cards (10s and Aces)</li>
            <li><strong>Unfavorable Slug:</strong> A slug rich in low cards</li>
            <li><strong>Shuffle Point:</strong> The exact location where two halves are combined during the shuffle</li>
            <li><strong>Cut Card Placement:</strong> Cutting to bring your favorable slug to the front</li>
          </ul>

          <h3>Penetration Calculator</h3>
          <p>
            Understanding penetration is crucial for shuffle tracking. The deeper the penetration,
            the more information you have about where slugs are located.
          </p>

          <div className="technique-tool">
            <div className="tool-input-group">
              <label>Cards Before Cut Card (out of 312 for 6-deck):</label>
              <input 
                type="range"
                min="52"
                max="280"
                value={cutCardPosition}
                onChange={(e) => setCutCardPosition(Number(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{cutCardPosition} cards</span>
            </div>
            <div className="tool-result">
              <div className="result-large">
                <span className="result-label">Penetration:</span>
                <span className="result-value">{calculatePenetration()}%</span>
              </div>
              <p className="result-note">
                {parseFloat(calculatePenetration()) >= 75 && 'Excellent penetration for shuffle tracking!'}
                {parseFloat(calculatePenetration()) >= 65 && parseFloat(calculatePenetration()) < 75 && 'Good penetration, workable for tracking.'}
                {parseFloat(calculatePenetration()) < 65 && 'Poor penetration, shuffle tracking will be difficult.'}
              </p>
            </div>
          </div>

          <h3>Difficulty & Requirements</h3>
          <ul>
            <li>Must have excellent memory and concentration</li>
            <li>Requires understanding of specific casino shuffle procedures</li>
            <li>Takes 100+ hours of practice to become proficient</li>
            <li>Works best with simple shuffle procedures</li>
            <li>Combined with card counting for maximum effectiveness</li>
          </ul>

          <h3>Risks</h3>
          <p>
            Shuffle tracking is very obvious to surveillance if done poorly. Improper cut card placement,
            staring at the discard tray, or tracking slugs with obvious eye movements can get you backed off quickly.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="Ace Sequencing">
          <h3>What is Ace Sequencing?</h3>
          <p>
            Ace sequencing (or ace prediction) involves memorizing the cards that appear before and after Aces
            in the shoe. When you see those key cards in the next shoe, you know an Ace is coming soon and can
            increase your bet accordingly.
          </p>

          <h3>Why It Works</h3>
          <p>
            Many casinos use simple shuffle procedures where cards stay in relatively the same order.
            If you memorize what comes before or after an Ace, there's a high probability that relationship
            will persist through the shuffle.
          </p>

          <h3>Practice Tool: Card Sequence Tracker</h3>
          <p>
            Practice tracking sequences of cards. Add up to 10 cards to see if you're identifying high-card rich sequences.
          </p>

          <div className="technique-tool">
            <div className="sequence-input">
              <input 
                type="text"
                value={inputCard}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCardToSequence()}
                placeholder="Enter card (e.g., AS, 10H, KD)"
                className={`card-input ${cardError ? 'error' : ''}`}
                maxLength={3}
              />
              <button onClick={addCardToSequence} className="add-button">Add Card</button>
              <button onClick={clearSequence} className="clear-button">Clear</button>
            </div>
            {cardError && (
              <div className="card-error">{cardError}</div>
            )}

            <div className="sequence-display">
              {sequenceCards.length === 0 && (
                <p className="sequence-empty">Start entering cards...</p>
              )}
              {sequenceCards.map((card, i) => (
                <div key={i} className="sequence-card">{card}</div>
              ))}
            </div>

            {sequenceCards.length > 0 && (
              <div className="sequence-analysis">
                <div className="analysis-item">
                  <span>Total Cards:</span>
                  <span>{sequenceCards.length}</span>
                </div>
                <div className="analysis-item">
                  <span>High Cards (10, J, Q, K, A):</span>
                  <span>{countHighCards()}</span>
                </div>
                <div className={`analysis-result ${isGoodSequence() ? 'favorable' : 'unfavorable'}`}>
                  {isGoodSequence() 
                    ? '✓ Favorable sequence - High card rich!' 
                    : '✗ Unfavorable sequence - Low card rich'}
                </div>
              </div>
            )}
          </div>

          <h3>Key Cards to Track</h3>
          <ul>
            <li><strong>Key Card:</strong> The card(s) that appear immediately before an Ace</li>
            <li><strong>Sequence Length:</strong> Typically track 2-3 cards before each Ace</li>
            <li><strong>Repeatable Patterns:</strong> Look for key cards that appear before multiple Aces</li>
          </ul>

          <h3>Requirements</h3>
          <ul>
            <li>Photographic or near-photographic memory</li>
            <li>Ability to track 4-8 key cards per shoe</li>
            <li>Understanding of the specific shuffle at your casino</li>
            <li>Discipline to only bet when you have confirmation</li>
          </ul>

          <h3>Limitations</h3>
          <p>
            Ace sequencing only works with:
          </p>
          <ul>
            <li>Simple, consistent shuffle procedures</li>
            <li>Single shuffles (not shuffle machines)</li>
            <li>Good penetration (75%+)</li>
            <li>Manual shuffles where card order is preserved</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Wonging (Back Counting)">
          <h3>What is Wonging?</h3>
          <p>
            Named after blackjack author Stanford Wong, "Wonging" involves counting cards while standing behind
            a table (not playing), and only sitting down to play when the count becomes favorable.
          </p>

          <h3>Advantages</h3>
          <ul>
            <li>Never play in negative counts</li>
            <li>Dramatically increases your hourly EV</li>
            <li>Reduces variance compared to playing every hand</li>
            <li>Smaller bankroll requirements</li>
            <li>Can watch multiple tables simultaneously</li>
          </ul>

          <h3>How To Wong Effectively</h3>
          <ul>
            <li><strong>Stand casually behind the table</strong> - Don't stare intensely at every card</li>
            <li><strong>Enter at True Count +2 or higher</strong> - Wait for genuinely favorable situations</li>
            <li><strong>Exit at True Count +1 or lower</strong> - Leave when advantage disappears</li>
            <li><strong>Vary your entry points</strong> - Don't always enter at exactly +2</li>
            <li><strong>Use cover plays</strong> - Occasionally play a few hands in negative counts</li>
          </ul>

          <h3>Casino Countermeasures</h3>
          <p>
            Casinos are very aware of Wonging and have several countermeasures:
          </p>
          <ul>
            <li><strong>No Mid-Shoe Entry (NSE) rules</strong> - Can't join until a new shoe starts</li>
            <li><strong>"Flat betting" requirements</strong> - Must bet the same on first hand as previous player</li>
            <li><strong>Enhanced surveillance</strong> - Pit bosses watch for people standing behind tables</li>
            <li><strong>Reduced penetration</strong> - Cutting off more cards to limit favorable situations</li>
          </ul>

          <h3>Modified Wonging Strategies</h3>
          <ul>
            <li><strong>Wong in and out</strong> - Play when favorable, take bathroom breaks when not</li>
            <li><strong>Table hopping</strong> - Move between tables at advantageous times</li>
            <li><strong>Partner play</strong> - One person counts, signals partner when to play</li>
            <li><strong>Team play</strong> - Multiple counters feeding high counts to big players</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Hole Carding">
          <h3>What is Hole Carding?</h3>
          <p>
            Hole carding is the practice of gaining knowledge of the dealer's hole card (face-down card) through
            observation. This is legal as long as you're not using devices or colluding with the dealer.
          </p>

          <h3>How It Occurs</h3>
          <p>
            Dealer mistakes are the most common source:
          </p>
          <ul>
            <li>Dealer lifts the hole card too high when checking for blackjack</li>
            <li>Poor card handling technique exposes the card</li>
            <li>Reflective surfaces on the table or dealer's watch</li>
            <li>Sitting in the right position at the table (first base or third base)</li>
          </ul>

          <h3>The Advantage</h3>
          <p>
            Knowing the dealer's hole card gives you a massive advantage (10%+ edge). You know exactly what the
            dealer has, allowing you to make perfect decisions:
          </p>
          <ul>
            <li>Never bust if dealer will bust</li>
            <li>Always double down when dealer has low card</li>
            <li>Know when to take insurance (if dealer has blackjack)</li>
            <li>Optimal splitting decisions</li>
          </ul>

          <h3>Strategy Changes</h3>
          <p>
            With hole card information, basic strategy changes dramatically. For example:
          </p>
          <ul>
            <li>If dealer shows 6 with 10 underneath (16 total), you hit all stiff hands</li>
            <li>If dealer shows 6 with 5 underneath (11 total), you stand on almost everything</li>
            <li>Double down much more frequently when dealer has weak total</li>
          </ul>

          <h3>Legal & Ethical Considerations</h3>
          <ul>
            <li><strong>Legal:</strong> Simply observing exposed cards without devices or collusion</li>
            <li><strong>Illegal:</strong> Using mirrors, cameras, or working with the dealer</li>
            <li><strong>Casino Response:</strong> Will immediately back you off if suspected</li>
            <li><strong>Difficulty:</strong> Very rare to find exploitable dealers in modern casinos</li>
          </ul>

          <h3>Reality Check</h3>
          <p>
            Modern casino dealer training has made hole carding extremely rare. Dealers are taught
            to protect their hole card carefully, and surveillance watches for this constantly.
            It's not a practical strategy for most players.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="Team Play">
          <h3>The Team Advantage</h3>
          <p>
            Team play multiplies the effectiveness of card counting by having multiple players work together.
            The most famous example is the MIT Blackjack Team, which won millions using coordinated team strategies.
          </p>

          <h3>Basic Team Structure</h3>
          <ul>
            <li><strong>Counters (Spotters):</strong> Play minimum bets and count cards</li>
            <li><strong>Big Player (BP):</strong> Bets large amounts when signaled by counters</li>
            <li><strong>Controller:</strong> Manages the bankroll and coordinates the team</li>
          </ul>

          <h3>How It Works</h3>
          <ol>
            <li>Spotters sit at different tables, counting and playing small bets</li>
            <li>When the count becomes very favorable (+3 or higher), spotter signals the BP</li>
            <li>BP approaches the table and makes large bets</li>
            <li>When count drops, BP leaves and waits for next signal</li>
            <li>Spotters continue counting at the same table</li>
          </ol>

          <h3>Advantages of Team Play</h3>
          <ul>
            <li>BP never plays in negative counts (maximum EV)</li>
            <li>BP's betting pattern appears random to casino</li>
            <li>Spotters attract no attention with min bets</li>
            <li>Can cover many tables simultaneously</li>
            <li>Pooled bankroll reduces individual risk</li>
            <li>Combined edge is much higher than solo play</li>
          </ul>

          <h3>Signaling Systems</h3>
          <p>
            Teams use subtle signals to communicate the count:
          </p>
          <ul>
            <li>Chip placement patterns</li>
            <li>Body language cues</li>
            <li>Verbal phrases</li>
            <li>Hand signals disguised as natural movements</li>
            <li>Cell phone/text message codes (riskier)</li>
          </ul>

          <h3>Requirements</h3>
          <ul>
            <li>Complete trust between team members</li>
            <li>Substantial bankroll ($50k+ recommended)</li>
            <li>All members must be expert counters</li>
            <li>Detailed record-keeping and accounting</li>
            <li>Regular practice sessions to maintain skills</li>
            <li>Legal agreements on profit sharing</li>
          </ul>

          <h3>Modern Challenges</h3>
          <p>
            Team play today faces significant obstacles:
          </p>
          <ul>
            <li>Advanced facial recognition in casinos</li>
            <li>Databases shared between casinos</li>
            <li>Enhanced surveillance technology</li>
            <li>Reduced penetration and increased deck counts</li>
            <li>Continuous shuffle machines</li>
            <li>Legal issues if caught (trespassing, fraud charges possible)</li>
          </ul>

          <h3>Famous Blackjack Teams</h3>
          <ul>
            <li><strong>MIT Blackjack Team:</strong> Won an estimated $50M+ over 20 years</li>
            <li><strong>Al Francesco's Team:</strong> Pioneered the big player concept in the 1970s</li>
            <li><strong>Ken Uston's Teams:</strong> Successfully sued casinos for right to play</li>
            <li><strong>The Greeks:</strong> European team that dominated 1980s and 1990s</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Card Counting Systems Comparison">
          <h3>Beyond Hi-Lo</h3>
          <p>
            While Hi-Lo is the most popular, other counting systems offer different trade-offs between
            power (effectiveness) and ease of use.
          </p>

          <h3>Popular Systems</h3>
          
          <div className="systems-comparison">
            <div className="system-card">
              <h4>Hi-Lo (Level 1)</h4>
              <p><strong>Tags:</strong> 2-6 = +1, 7-9 = 0, 10-A = -1</p>
              <p><strong>Betting Correlation:</strong> 97%</p>
              <p><strong>Playing Efficiency:</strong> 51%</p>
              <p><strong>Best For:</strong> Beginners and experienced players. Best all-around system.</p>
            </div>

            <div className="system-card">
              <h4>Hi-Opt II (Level 2)</h4>
              <p><strong>Tags:</strong> 2,3,6,7 = +1, 4,5 = +2, 8,9 = 0, 10 = -2, A = 0</p>
              <p><strong>Betting Correlation:</strong> 91%</p>
              <p><strong>Playing Efficiency:</strong> 67%</p>
              <p><strong>Best For:</strong> Advanced players wanting better playing decisions.</p>
            </div>

            <div className="system-card">
              <h4>Omega II (Level 2)</h4>
              <p><strong>Tags:</strong> 2,3,7 = +1, 4,5,6 = +2, 8,A = 0, 9 = -1, 10 = -2</p>
              <p><strong>Betting Correlation:</strong> 92%</p>
              <p><strong>Playing Efficiency:</strong> 67%</p>
              <p><strong>Best For:</strong> Advanced players, balanced for betting and playing.</p>
            </div>

            <div className="system-card">
              <h4>Zen Count (Level 2)</h4>
              <p><strong>Tags:</strong> 2,3,7 = +1, 4,5,6 = +2, 8,9 = 0, 10 = -2, A = -1</p>
              <p><strong>Betting Correlation:</strong> 96%</p>
              <p><strong>Playing Efficiency:</strong> 63%</p>
              <p><strong>Best For:</strong> Experienced players wanting high betting correlation.</p>
            </div>

            <div className="system-card">
              <h4>KO (Knock-Out)</h4>
              <p><strong>Tags:</strong> 2-7 = +1, 8,9 = 0, 10-A = -1</p>
              <p><strong>Betting Correlation:</strong> 98%</p>
              <p><strong>Playing Efficiency:</strong> 55%</p>
              <p><strong>Best For:</strong> Players who want simplicity (unbalanced, no true count conversion).</p>
            </div>

            <div className="system-card">
              <h4>Red Seven (Unbalanced)</h4>
              <p><strong>Tags:</strong> 2-6 = +1, Red 7 = +1, Black 7 = 0, 8,9 = 0, 10-A = -1</p>
              <p><strong>Betting Correlation:</strong> 98%</p>
              <p><strong>Playing Efficiency:</strong> 54%</p>
              <p><strong>Best For:</strong> Beginners wanting to skip true count conversion.</p>
            </div>
          </div>

          <h3>Should You Switch Systems?</h3>
          <p>
            For most players, the answer is no. Hi-Lo offers:
          </p>
          <ul>
            <li>Excellent betting correlation (97%)</li>
            <li>Simplicity allows faster, more accurate counting</li>
            <li>Most deviations and strategies published for Hi-Lo</li>
            <li>Better to be perfect at Hi-Lo than mediocre at Hi-Opt II</li>
          </ul>

          <h3>When to Consider Advanced Systems</h3>
          <ul>
            <li>You've mastered Hi-Lo completely (100% accuracy under pressure)</li>
            <li>You play primarily single or double-deck games</li>
            <li>You want to maximize playing efficiency for deviation plays</li>
            <li>You have the time to learn and practice extensively</li>
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  );
}

