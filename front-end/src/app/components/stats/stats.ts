import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Game } from '../../models/Game';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class StatsComponent {
  data: any;
  options: any;

  ngOnInit() {
    // 2. Your raw data (normally this comes from a database or service)

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // 3. Process the data: Calculate totals per month
    // const monthlyTotals = this.calculateMonthlyHours(this.myGames);

    this.data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Hours Played',
          data: [120, 150, 80, 190, 210, 140, 120, 150, 80, 190, 210, 140], //monthlyTotals
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Transparent blue
          borderColor: 'rgb(54, 162, 235)', // Solid blue border
          borderWidth: 1,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months',
          },
          ticks: {
            color: textColor,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          beginAtZero: true, // Ensures the Y axis starts at 0
          title: {
            display: true,
            text: 'Maximum Hours',
          },
          ticks: {
            color: textColor,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  // Helper Function: Groups games by month and sums hours
  // calculateMonthlyHours(games: Game[]): number[] {
  //   // Initialize an array of 12 zeros (Jan-Dec)
  //   const totals = new Array(12).fill(0);

  //   games.forEach(game => {
  //     // getMonth() returns 0 for Jan, 1 for Feb, etc.
  //     const monthIndex = game.completionDate.getMonth();
  //     totals[monthIndex] += game.hoursPlayed;
  //   });

  //   return totals;
  // }
}
