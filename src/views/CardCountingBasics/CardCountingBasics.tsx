import React from 'react';
import Header from '../../components/Header';
import CollapsibleSection from '../../components/CollapsibleSection';
import BasicHiLoSimulation from '../../components/BasicHiLoSimulation';
import DeviationsSimulation from '../../components/DeviationsSimulation';
import CardSpeedDrill from '../../components/CardSpeedDrill';
import DeviationFlashcards from '../../components/DeviationFlashcards';
import './CardCountingBasics.css';

export default function CardCountingBasics() {
  return (
    <div className="card-counting-basics-page">
      <div className="card-counting-basics-header">
      <Header />
        <p className="card-counting-basics-subtitle">Learn the fundamentals of card counting and gain an edge over the casino. Master the Hi-Lo system and advanced techniques to become a profitable blackjack player.</p>
      </div>

      <div className="card-counting-basics-content">
        <CollapsibleSection title="The Basics of Hi-Lo Counting">
          <h3>What is Card Counting?</h3>
          <p>
            Card counting is a strategy used in blackjack to determine whether the next hand is likely to give an advantage to the player or the dealer. 
            By keeping track of which cards have been played, skilled players can adjust their bets and playing decisions to maximize their edge.
          </p>

          <h3>The Hi-Lo System</h3>
          <p>
            The Hi-Lo counting system is the most popular and widely used card counting method. It assigns point values to cards:
          </p>
          <ul>
            <li><strong>Low cards (2-6):</strong> +1</li>
            <li><strong>Neutral cards (7-9):</strong> 0</li>
            <li><strong>High cards (10, J, Q, K, A):</strong> -1</li>
          </ul>

          <h3>How It Works</h3>
          <p>
            As cards are dealt, you keep a running count by adding and subtracting these values. A positive count means more low cards have been played, 
            leaving more high cards in the deck, which favors the player. A negative count means more high cards have been played, favoring the dealer.
          </p>

          <h3>Running Count vs True Count</h3>
          <p>
            The <strong>running count</strong> is your cumulative total as cards are dealt. However, to account for multiple decks, 
            you need to convert this to a <strong>true count</strong> by dividing the running count by the number of decks remaining.
          </p>
          <p>
            For example, if your running count is +6 and there are 3 decks left, your true count is +2. 
            The true count gives you a more accurate picture of your advantage.
          </p>

          <h3>Speed Drill: Build Your Counting Speed</h3>
          <p>
            Before jumping into full game situations, practice your counting speed with rapid card flashes.
            This drill helps you develop the reflexes needed to keep up with a fast dealer.
          </p>

          <CardSpeedDrill />

          <h3>Practice Counting</h3>
          <p>
            Use this simulation to practice maintaining a running count while playing blackjack.
            Every 5 hands, you'll be asked to enter the current running count. Track your accuracy and aim for 100% correct!
          </p>

          <BasicHiLoSimulation />
        </CollapsibleSection>

        <CollapsibleSection title="Betting Strategy and Bankroll Management">
          <h3>The Importance of Proper Betting</h3>
          <p>
            Card counting only gives you an edge when you adjust your bet size based on the count. 
            Betting the same amount regardless of the count defeats the entire purpose of counting cards. 
            Your betting strategy is just as important as your counting accuracy.
          </p>

          <h3>Basic Betting Spread</h3>
          <p>
            A betting spread is the ratio between your minimum and maximum bets. Common spreads include:
          </p>
          <ul>
            <li><strong>1-4 spread:</strong> Bet 1 unit at negative counts, 2-4 units at positive counts</li>
            <li><strong>1-8 spread:</strong> More aggressive, better for experienced players</li>
            <li><strong>1-12 spread:</strong> High risk, high reward, requires large bankroll</li>
          </ul>

          <h3>Betting Based on True Count</h3>
          <p>
            The most common approach is to bet your base unit multiplied by the true count minus 1:
          </p>
          <ul>
            <li><strong>True Count ≤ 1:</strong> Bet minimum (1 unit)</li>
            <li><strong>True Count = 2:</strong> Bet 2 units</li>
            <li><strong>True Count = 3:</strong> Bet 4 units</li>
            <li><strong>True Count = 4:</strong> Bet 6 units</li>
            <li><strong>True Count ≥ 5:</strong> Bet maximum (8-12 units)</li>
          </ul>

          <h3>Bankroll Management</h3>
          <p>
            Your bankroll should be at least 100-200 times your maximum bet to withstand variance. 
            For example, if your max bet is $100, you should have a bankroll of $10,000-$20,000.
          </p>
          <p>
            Never bet money you can't afford to lose. Even with perfect play, variance means you can have losing sessions. 
            Proper bankroll management ensures you can survive the downswings and profit in the long run.
          </p>

          <h3>Risk of Ruin</h3>
          <p>
            Risk of ruin is the probability of losing your entire bankroll. With a properly sized bankroll (100-200 max bets) 
            and disciplined play, your risk of ruin should be less than 5%. Betting too aggressively or with an undersized bankroll 
            dramatically increases your risk.
          </p>

          <h3>Casino Heat and Cover Betting</h3>
          <p>
            Casinos watch for card counters and may ask you to leave or limit your betting. To avoid detection, 
            some players use "cover bets" - occasionally making non-optimal bets to appear like a recreational player. 
            However, this reduces your edge, so use it sparingly and only when necessary.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="Basic Strategy Deviations">
          <h3>What Are Strategy Deviations?</h3>
          <p>
            While basic strategy tells you the mathematically correct play in a neutral deck, strategy deviations adjust your decisions 
            based on the true count. As the count changes, the optimal play for certain hands also changes. 
            Learning these deviations can add significant value to your edge as a card counter.
          </p>

          <h3>Why Deviations Matter</h3>
          <p>
            About 70-80% of your advantage from card counting comes from varying your bet size. The remaining 20-30% comes from 
            playing deviations. While not as crucial as proper betting, mastering key deviations can increase your hourly win rate 
            and reduce variance.
          </p>

          <h3>The Illustrious 18</h3>
          <p>
            The "Illustrious 18" are the 18 most profitable playing deviations in blackjack. These were identified by blackjack 
            expert Don Schlesinger. Here are the most important ones to memorize:
          </p>

          <h4>Insurance</h4>
          <ul>
            <li><strong>Take insurance at True Count ≥ +3</strong></li>
            <li>This is the single most valuable deviation, accounting for roughly one-third of all deviation value</li>
          </ul>

          <h4>16 vs 10</h4>
          <ul>
            <li><strong>Stand at True Count ≥ 0</strong> (basic strategy says hit)</li>
            <li>One of the most common and valuable deviations</li>
          </ul>

          <h4>15 vs 10</h4>
          <ul>
            <li><strong>Stand at True Count ≥ +4</strong> (basic strategy says hit)</li>
          </ul>

          <h4>10,10 vs 5</h4>
          <ul>
            <li><strong>Split at True Count ≥ +5</strong> (basic strategy says stand)</li>
            <li>High count only, rarely occurs but highly profitable</li>
          </ul>

          <h4>10,10 vs 6</h4>
          <ul>
            <li><strong>Split at True Count ≥ +4</strong> (basic strategy says stand)</li>
          </ul>

          <h4>10 vs 10</h4>
          <ul>
            <li><strong>Double down at True Count ≥ +4</strong> (basic strategy says hit)</li>
          </ul>

          <h4>12 vs 3</h4>
          <ul>
            <li><strong>Stand at True Count ≥ +2</strong> (basic strategy says hit)</li>
          </ul>

          <h4>12 vs 2</h4>
          <ul>
            <li><strong>Stand at True Count ≥ +3</strong> (basic strategy says hit)</li>
          </ul>

          <h4>11 vs Ace</h4>
          <ul>
            <li><strong>Double down at True Count ≥ +1</strong> (basic strategy says hit in some games)</li>
          </ul>

          <h4>9 vs 2</h4>
          <ul>
            <li><strong>Double down at True Count ≥ +1</strong> (basic strategy says hit)</li>
          </ul>

          <h3>Learning Strategy</h3>
          <p>
            Don't try to memorize all 18 deviations at once. Start with the most valuable ones:
          </p>
          <ul>
            <li>Insurance (True Count ≥ +3)</li>
            <li>16 vs 10 (Stand at TC ≥ 0)</li>
            <li>15 vs 10 (Stand at TC ≥ +4)</li>
            <li>10 vs 10 (Double at TC ≥ +4)</li>
          </ul>
          <p>
            Once you're comfortable with these, gradually add the remaining deviations. 
            Practice them alongside your counting until they become second nature.
          </p>

          <h3>Common Mistakes</h3>
          <ul>
            <li><strong>Using running count instead of true count:</strong> Always convert to true count before making deviation decisions</li>
            <li><strong>Deviating too obviously:</strong> Splitting 10s at high counts is a red flag for casino surveillance</li>
            <li><strong>Forgetting basic strategy:</strong> Deviations only apply at specific counts; use basic strategy at neutral counts</li>
          </ul>

          <h3>Flashcards: Memorize the Illustrious 18</h3>
          <p>
            Use these interactive flashcards to drill the key deviations. Each card shows a situation and the correct play.
            Shuffle the deck and test yourself until you know all 18 deviations by heart.
          </p>

          <DeviationFlashcards />

          <h3>Practice Deviations</h3>
          <p>
            This simulator deals hands specifically from the Illustrious 18 at the appropriate true counts. 
            You'll need to decide whether to follow basic strategy or make the deviation play. 
            Track your accuracy and master these crucial deviations!
          </p>

          <DeviationsSimulation />
        </CollapsibleSection>

        <CollapsibleSection title="Readiness Test">
          <h3>Are You Ready for the Casino?</h3>
          <p>
            Before risking real money at a casino, you need to be completely confident in your skills. 
            Counting cards while managing your cover, tracking the count, and making decisions under pressure is challenging. 
            Use this guide to assess whether you're truly ready.
          </p>

          <h3>Skill Requirements Checklist</h3>
          
          <h4>Basic Strategy Mastery</h4>
          <ul>
            <li><strong>100% accuracy:</strong> You should know every basic strategy decision without hesitation</li>
            <li><strong>Speed test:</strong> Go through 100 random hands in under 5 minutes with zero errors</li>
            <li><strong>Under pressure:</strong> Can you maintain accuracy while talking, listening to music, or being distracted?</li>
          </ul>

          <h4>Counting Proficiency</h4>
          <ul>
            <li><strong>Deck countdown:</strong> Count down a full deck in under 25 seconds with zero errors</li>
            <li><strong>Consistency:</strong> Repeat the deck countdown 10 times in a row without a single mistake</li>
            <li><strong>Paired cards:</strong> Can you count cards in pairs (e.g., 10+6 = 0, 3+K = 0) to increase speed?</li>
            <li><strong>True count conversion:</strong> Instantly convert running count to true count at any point</li>
          </ul>

          <h4>Playing Deviations</h4>
          <ul>
            <li><strong>Top 4 memorized:</strong> Insurance and the Fab 4 should be automatic</li>
            <li><strong>Additional deviations:</strong> Know at least 10 of the Illustrious 18</li>
            <li><strong>No confusion:</strong> Never mix up the index numbers for different plays</li>
          </ul>

          <h4>Betting Strategy</h4>
          <ul>
            <li><strong>Spread memorized:</strong> Know exactly what to bet at each true count</li>
            <li><strong>Bankroll allocated:</strong> Have 100-200x your max bet set aside</li>
            <li><strong>Risk tolerance:</strong> Understand that you can lose your entire session bankroll in a bad run</li>
          </ul>

          <h3>Practice Test Simulation</h3>
          <p>
            Before going to a casino, complete this simulation at home:
          </p>
          <ul>
            <li><strong>Deal yourself hands:</strong> Use real cards and simulate 200 hands</li>
            <li><strong>Count accurately:</strong> Maintain a running count and convert to true count</li>
            <li><strong>Make decisions:</strong> Play each hand according to basic strategy and deviations</li>
            <li><strong>Adjust bets:</strong> Properly size your bets based on the true count</li>
            <li><strong>Add distractions:</strong> Play music, watch TV, have someone talk to you</li>
          </ul>
          <p>
            If you can complete this without any errors in counting or play decisions, you're getting close to ready.
          </p>

          <h3>Speed Benchmarks</h3>
          <p>
            Casino play moves quickly. You need to be able to:
          </p>
          <ul>
            <li><strong>Count 2 cards in under 0.5 seconds:</strong> As they're dealt</li>
            <li><strong>Make play decisions in under 2 seconds:</strong> Don't slow down the table</li>
            <li><strong>Calculate true count in under 3 seconds:</strong> While appearing relaxed</li>
            <li><strong>Remember the count while making small talk:</strong> Act natural</li>
          </ul>

          <h3>Mental Preparation</h3>
          <ul>
            <li><strong>Variance tolerance:</strong> Are you prepared to lose 20+ max bets in a session?</li>
            <li><strong>Acting skills:</strong> Can you appear like a recreational gambler while counting?</li>
            <li><strong>Composure under heat:</strong> If pit bosses watch you closely, can you stay calm?</li>
            <li><strong>Quit discipline:</strong> Will you leave when the count drops or when you hit your session goal?</li>
          </ul>

          <h3>Financial Readiness</h3>
          <ul>
            <li><strong>Dedicated bankroll:</strong> Money you can afford to lose completely</li>
            <li><strong>No scared money:</strong> Betting small due to fear will waste your time</li>
            <li><strong>Long-term mindset:</strong> You need 50+ hours of play to see reliable results</li>
            <li><strong>Record keeping:</strong> Track every session to monitor your actual win rate</li>
          </ul>

          <h3>Final Checklist</h3>
          <p>
            You should honestly be able to check all of these before playing for real money:
          </p>
          <ul>
            <li>I can count down a deck in under 25 seconds with zero errors</li>
            <li>I know basic strategy perfectly without thinking</li>
            <li>I have memorized at least the top 10 deviations</li>
            <li>I can maintain count while having a conversation</li>
            <li>I have a bankroll of 100+ max bets</li>
            <li>I understand I can lose money even with perfect play</li>
            <li>I have practiced at least 20 hours at home</li>
            <li>I can quickly convert running count to true count</li>
          </ul>

          <h3>Start Small</h3>
          <p>
            Even when you're ready, start with low stakes to get comfortable with the casino environment. 
            The pressure, noise, and distractions are different from practicing at home. 
            Once you prove you can maintain accuracy in the real environment, gradually increase your bet sizes.
          </p>
        </CollapsibleSection>
      </div>
    </div>
  );
}
