import React from 'react';
import Header from '../../components/Header';
import CollapsibleSection from '../../components/CollapsibleSection';
import BlackjackSimulation from '../../components/BlackjackSimulation';
import SplitDoubleSimulation from '../../components/SplitDoubleSimulation';
import BasicStrategySimulation from '../../components/BasicStrategySimulation';
import StrategyTable from '../../components/StrategyTable';
import { strategyTables } from '../../data/strategyTables';
import './BlackjackBasics.css';

export default function BlackjackBasics() {
  return (
    <div className="blackjack-basics-page">
      <div className="blackjack-basics-header">
        <Header />
        <p className="blackjack-basics-subtitle">Master card counting and perfect your blackjack strategy. Start learning the basics with our interactive guide below or navigate to more advanced guides and simulations.</p>
      </div>

      <div className="blackjack-basics-content">
        <CollapsibleSection title="Basic Blackjack Rules">
          <h3>Objective</h3>
          <p>
            The goal of blackjack is to beat the dealer by having a hand value closer to 21 
            without going over (busting).
          </p>

          <h3>Card Values</h3>
          <ul>
            <li><strong>Number cards (2-10):</strong> Face value</li>
            <li><strong>Face cards (J, Q, K):</strong> Worth 10 points</li>
            <li><strong>Aces:</strong> Worth either 1 or 11 points (player's choice)</li>
          </ul>

          <h3>Basic Gameplay</h3>
          <ul>
            <li>Players are dealt two cards face up</li>
            <li>Dealer gets one card face up and one face down (hole card)</li>
            <li>Players decide to <strong>Hit</strong> (take another card) or <strong>Stand</strong> (keep current hand)</li>
            <li>Dealer must hit on 16 or less and stand on 17 or more</li>
            <li>If you exceed 21, you bust and lose immediately</li>
          </ul>

          <h3>Winning Conditions</h3>
          <ul>
            <li><strong>Blackjack:</strong> Ace + 10 = 21 (pays 3:2)</li>
            <li><strong>Win:</strong> Hand closer to 21 than dealer without busting</li>
            <li><strong>Push:</strong> Same value as dealer (bet returned)</li>
            <li><strong>Lose:</strong> Dealer closer to 21 or you bust</li>
          </ul>

          <BlackjackSimulation />
        </CollapsibleSection>
        <CollapsibleSection title="Doubling and Splitting">
          <h3>Doubling Down</h3>
          <ul>
            <li>Doubling down means to double your bet and take one more card.</li>
            <li>You then receive one extra card for the hand.</li>
            <li>You cannot take any other actions on the hand after doubling down.</li>
          </ul>

          <h3>Splitting</h3>
          <ul>
            <li>If you are dealt two cards of the same rank, you can split them into two separate hands.</li>
            <li>You then receive one extra card for each hand.</li>
            <li>Then you can hit, stand, split again, or double down on each hand as usual.</li>
            <li>Some casinos have extra rules that where you cannot split aces, or can only split once.</li>
          </ul>

          <SplitDoubleSimulation />
        </CollapsibleSection>
        <CollapsibleSection title="Basic Strategy">
          <p>
            Basic strategy is a set of rules that tells you the best action to take in any given situation.
            It is based on the cards you are dealt and the dealer's upcard (the card face up).
          </p>
          <p>
            Basic strategy is a mathematical model that has been proven to be the optimal action for any given hand.
            It is not a guarantee of winning, but it will help you maximize your odds and minimize the house edge.
          </p>
          <p>
            Study the basic strategy tables and practice them using the simulation below. Once you are comfortable 
            with the basic strategy, you can navigate to other sections to start taking the advantage 
            from the casino!
          </p>

          <CollapsibleSection title="Hard Totals (No Aces or Aces counted as 1)">
            <StrategyTable
              title=""
              legend={strategyTables.hard_totals.legend}
              table={strategyTables.hard_totals.table}
              rowLabel="total"
            />
          </CollapsibleSection>

          <CollapsibleSection title="Soft Totals (Hands with an Ace counted as 11)">
            <StrategyTable
              title=""
              legend={strategyTables.soft_totals.legend}
              table={strategyTables.soft_totals.table}
              rowLabel="hand"
            />
          </CollapsibleSection>

          <CollapsibleSection title="Pair Splitting">
            <StrategyTable
              title=""
              legend={strategyTables.pair_splitting.legend}
              table={strategyTables.pair_splitting.table}
              rowLabel="hand"
            />
          </CollapsibleSection>

          <h3>Practice Basic Strategy</h3>
          <p>
            Test your basic strategy knowledge! This simulator deals random hands and checks
            if you make the correct decision according to basic strategy.
          </p>
          <p>
            You'll receive immediate feedback on whether your action was correct, along with
            what the optimal play should have been.
          </p>

          <BasicStrategySimulation />
        </CollapsibleSection>
      </div>
    </div>
  );
}
