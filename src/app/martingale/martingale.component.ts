import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MartingaleService } from '../martingale.service';

interface SimulationLog {
  iteration: number;
  generatedNumber: number;
  color: string;
  parity: string;
  betAmount: number;
  betChoice: string;
  currentBudget: number;
  result: 'Gagné' | 'Perdu' | 'Pas de pari';
}

@Component({
  selector: 'app-martingale',
  templateUrl: './martingale.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./martingale.component.css']
})
export class MartingaleComponent implements OnInit {
  initialBudget: number = 100;
  budget: number = 100;
  maxIterations: number = 300;
  targetBudget: number = 300;
  currentIterations: number = 0;
  simulationLogs: SimulationLog[] = [];
  resultMessage: string = '';
  previousBet: { amount: number; choice: string } = { amount: 1, choice: '' };
  hasWon: boolean = false;
  simulationInProgress: boolean = false;
  showAllIterations: boolean = false;
  totalSimulations: number = 0;
  successfulSimulations: number = 0;
  globalSuccessRate: number = 0;
  
  betTime: number = 30; // Temps pour placer un pari (en secondes)
  spinTime: number = 30; // Temps pour un tirage de la roulette (en secondes)
  totalSimulationTime: number = 0; // Temps total de la simulation (en secondes)

  constructor(private martingaleService: MartingaleService) {}

  ngOnInit(): void {
    this.resetSimulation();
  }

  resetSimulation(): void {
    this.budget = this.initialBudget;
    this.currentIterations = 0;
    this.simulationLogs = [];
    this.resultMessage = '';
    this.previousBet = { amount: 1, choice: '' };
    this.hasWon = false;
    this.simulationInProgress = false;
    this.martingaleService.resetCounts();
    this.totalSimulationTime = 0;
  }

  simulate(): void {
    this.resetSimulation();
    this.simulationInProgress = true;
    let totalTime = 0;

    while (this.budget > 0 && this.currentIterations < this.maxIterations && this.budget < this.targetBudget) {
      this.currentIterations++;
      const number = this.martingaleService.generateNumber();
      const res = this.martingaleService.result(number);

      totalTime += this.spinTime; // Ajouter le temps du tirage

      let betAmount = 0;
      let result: 'Gagné' | 'Perdu' | 'Pas de pari' = 'Pas de pari';

      if (this.martingaleService.canBet()) {
        totalTime += this.betTime;
        if (this.previousBet.choice === '') {
          this.previousBet.choice = this.martingaleService.getBetChoice();
        }
        betAmount = Math.min(this.previousBet.amount, this.budget);
        const newBudget = this.martingaleService.updateBudget(this.budget, { amount: betAmount, choice: this.previousBet.choice }, res);
        this.hasWon = newBudget > this.budget;
        result = this.hasWon ? 'Gagné' : 'Perdu';
        this.budget = newBudget;

        this.previousBet = this.martingaleService.strategyMartingale(this.previousBet, this.hasWon);
      }

      this.addSimulationLog(this.currentIterations, res.number, res.color, res.parity, betAmount, this.previousBet.choice, this.budget, result);
      if (this.budget >= this.targetBudget) {
        break;
      }    
    }

    this.totalSimulationTime = totalTime;
    this.setResultMessage();
    this.simulationInProgress = false;
    this.updateGlobalStats();
  }

  private addSimulationLog(iteration: number, number: number, color: string, parity: string, betAmount: number, betChoice: string, currentBudget: number, result: 'Gagné' | 'Perdu' | 'Pas de pari'): void {
    this.simulationLogs.push({
      iteration,
      generatedNumber: number,
      color,
      parity,
      betAmount,
      betChoice,
      currentBudget,
      result
    });
  }

  private setResultMessage(): void {
    const profit = this.budget - this.initialBudget;
    const timeString = this.formatTime(this.totalSimulationTime);
    
    if (this.budget >= this.targetBudget) {
      this.resultMessage = `Simulation terminée. Objectif atteint : budget cible atteint. Bénéfice : ${profit.toFixed(2)} €. Temps total : ${timeString}`;
    } else if (this.budget <= 0) {
      this.resultMessage = `Simulation terminée. Budget épuisé. Perte : ${Math.abs(profit).toFixed(2)} €. Temps total : ${timeString}`;
    } else {
      this.resultMessage = `Simulation terminée. Nombre d'itérations atteint. Bénéfice/Perte : ${profit.toFixed(2)} €. Temps total : ${timeString}`;
    }
  }
  
  public formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  private updateGlobalStats(): void {
    this.totalSimulations++;
    if (this.budget >= this.targetBudget) {
      this.successfulSimulations++;
    }
    this.globalSuccessRate = (this.successfulSimulations / this.totalSimulations) * 100;
  }

  getDisplayedLogs(): SimulationLog[] {
    return this.showAllIterations ? this.simulationLogs : this.simulationLogs.slice(-50);
  }

  resetGlobalStats(): void {
    this.totalSimulations = 0;
    this.successfulSimulations = 0;
    this.globalSuccessRate = 0;
  }

  onSubmit(): void {
    this.resetSimulation();
    this.simulate();
  }
}