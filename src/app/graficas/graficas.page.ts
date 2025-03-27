import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart, PieController, ArcElement, Legend } from 'chart.js';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.page.html',
  styleUrls: ['./graficas.page.scss'],
})
export class GraficasPage implements OnInit, AfterViewInit {
  public grafica: any;
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
      this.onGraficaGeneral();
  }

  onGraficaGeneral(){
    Chart.register(PieController, ArcElement, Legend);
    this.grafica = new Chart('graficaVentas', {
      type: 'pie',
      data: {
        labels: 
        [
          'Frappes',
          'Marquesitas',
          'Desayunos'
        ],
        datasets: 
        [
          {
            label: 'Graficas de Hoy',
            data: [15, 9, 10],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], 
          }
        ],
      }
    });
  }
}
