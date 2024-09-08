import { Injectable } from '@angular/core';

type CountKey = 'red' | 'black' | 'even' | 'odd';

@Injectable({
  providedIn: 'root'
})
export class MartingaleService {
  private consecutiveCount: Record<CountKey, number> = {
    red: 0,
    black: 0,
    even: 0,
    odd: 0
  };
  private canBetFlag: boolean = false;
  private currentBetChoice: string = '';

  constructor() {}

  generateNumber(): number {
    return Math.floor(Math.random() * 37);
  }

  result(number: number): { number: number; color: 'rouge' | 'noir' | 'vert'; parity: 'pair' | 'impair' } {
    let color: 'rouge' | 'noir' | 'vert';
    let parity: 'pair' | 'impair';

    if (number === 0) {
      color = 'vert';
      parity = 'pair';
    } else if (number % 2 === 0) {
      color = 'rouge';
      parity = 'pair';
    } else {
      color = 'noir';
      parity = 'impair';
    }

    this.updateConsecutiveCounts(color, parity);

    return { number, color, parity };
  }

  private updateConsecutiveCounts(color: 'rouge' | 'noir' | 'vert', parity: 'pair' | 'impair'): void {
    if (!this.canBetFlag) {
      this.consecutiveCount.red = color === 'rouge' ? this.consecutiveCount.red + 1 : 0;
      this.consecutiveCount.black = color === 'noir' ? this.consecutiveCount.black + 1 : 0;
      this.consecutiveCount.even = parity === 'pair' ? this.consecutiveCount.even + 1 : 0;
      this.consecutiveCount.odd = parity === 'impair' ? this.consecutiveCount.odd + 1 : 0;

      if (Object.values(this.consecutiveCount).some(count => count > 3)) {
        this.canBetFlag = true;
        this.currentBetChoice = this.getBetChoice();
      } else {
        this.canBetFlag = false;
        this.currentBetChoice = '';
      }
    }
  }

  canBet(): boolean {
    return this.canBetFlag;
  }

  getBetChoice(): string {
    if (this.consecutiveCount.red >= 3) return 'noir';
    if (this.consecutiveCount.black >= 3) return 'rouge';
    if (this.consecutiveCount.even >= 3) return 'impair';
    if (this.consecutiveCount.odd >= 3) return 'pair';
    return '';
  }

  strategyMartingale(previousBet: { amount: number; choice: string }, hasWon: boolean): { amount: number; choice: string } {
    let newAmount = hasWon ? 1 : previousBet.amount * 2;
    let newChoice = previousBet.choice;
    return { amount: newAmount, choice: newChoice };
  }

  updateBudget(budget: number, bet: { amount: number; choice: string }, result: { number: number; color: string; parity: string }): number {
    const isWinningBet =
      (bet.choice === 'rouge' && result.color === 'rouge') ||
      (bet.choice === 'noir' && result.color === 'noir') ||
      (bet.choice === 'pair' && result.parity === 'pair') ||
      (bet.choice === 'impair' && result.parity === 'impair');

    return isWinningBet ? budget + bet.amount : budget - bet.amount;
  }

  resetCounts(): void {
    const keys: CountKey[] = ['red', 'black', 'even', 'odd'];
    keys.forEach(key => {
      this.consecutiveCount[key] = 0;
    });
    this.canBetFlag = false;
  }
}