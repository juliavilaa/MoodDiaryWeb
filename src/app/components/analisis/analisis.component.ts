import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef;

  // Datos quemados
  private emociones = [
    { _id: "672ae135753e65cbcdfc2c76", nombreEmocion: "Alegria", descripcion: "Comi helado", fecha: "2024-11-05T00:00:00.000Z" },
    { _id: "673a7a56457b8d50006a35c4", nombreEmocion: "Nostalgia", descripcion: "Comi helado", fecha: "2024-11-05T00:00:00.000Z" },
    { _id: "673ab054045880e5bd396c96", nombreEmocion: "Alegria", descripcion: "vi a alguien", fecha: "2024-12-05T00:00:00.000Z" },
    { _id: "673ab066045880e5bd396c9a", nombreEmocion: "Alegria", descripcion: "vi a alguien", fecha: "2024-09-05T00:00:00.000Z" },
    { _id: "673ab8504b48527f1da63c75", nombreEmocion: "Alegria", descripcion: "Sali con mis amigos", fecha: "2024-09-05T00:00:00.000Z" },
    { _id: "673ab9514b48527f1da63c78", nombreEmocion: "Alegria", descripcion: "Sali con mis amigos a comer", fecha: "2024-09-05T00:00:00.000Z" }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.generarGraficas();
  }

  generarGraficas() {
    // Gráfica de pastel - Emociones por porcentaje
    const emocionContador: { [key: string]: number } = {};
    this.emociones.forEach((emocion) => {
      const nombre = emocion.nombreEmocion;
      emocionContador[nombre] = (emocionContador[nombre] || 0) + 1;
    });

    const total = this.emociones.length;
    const emocionPorcentaje: { [key: string]: number } = {};
    for (const key in emocionContador) {
      emocionPorcentaje[key] = (emocionContador[key] / total) * 100;
    }

    this.crearGrafica(
      this.pieChartCanvas.nativeElement,
      'pie',
      Object.keys(emocionPorcentaje),
      Object.values(emocionPorcentaje),
      'Distribución de Emociones (%)'
    );

    // Gráfica de barras - Emociones por día
    const emocionesPorFecha: { [fecha: string]: number } = {};
    this.emociones.forEach((emocion) => {
      const fecha = new Date(emocion.fecha).toLocaleDateString();
      emocionesPorFecha[fecha] = (emocionesPorFecha[fecha] || 0) + 1;
    });

    this.crearGrafica(
      this.barChartCanvas.nativeElement,
      'bar',
      Object.keys(emocionesPorFecha),
      Object.values(emocionesPorFecha),
      'Emociones Registradas por Día'
    );
  }

  crearGrafica(canvas: HTMLCanvasElement, tipo: ChartType, labels: string[], data: number[], titulo: string) {
    new Chart(canvas, {
      type: tipo,
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: titulo,
            font: { size: 18 },
            color: '#333'
          },
          legend: {
            display: tipo === 'pie'
          }
        },
        responsive: true,
        scales: tipo === 'bar' ? { y: { beginAtZero: true } } : undefined
      }
    });
  }
}
