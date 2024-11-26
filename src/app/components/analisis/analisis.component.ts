import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EmocionService } from 'src/app/services/emocion.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements AfterViewInit {
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;

  pieChart!: Chart<'pie'>;
  barChart!: Chart<'bar'>;

  constructor(private emocionService: EmocionService, private authService: AuthenticationService) {
    Chart.register(...registerables); // Registrar componentes necesarios de Chart.js
  }

  ngAfterViewInit(): void {
    const token = this.authService.getToken();
    this.createPieChart([], []);
    this.createBarChart([], []);
    this.cargarDatosDesdeDB(token); // Reemplaza con el token real
  }

  cargarDatosDesdeDB(token: any) {
    this.emocionService.getAllEmocionesData(token).subscribe((response: any[]) => {
      // Inicializa los contadores para cada día y emoción
      const emocionesPorDia: { [dia: string]: { [emocion: string]: number } } = {
        Lunes: {}, Martes: {}, Miércoles: {}, Jueves: {}, Viernes: {}, Sábado: {}, Domingo: {}
      };
  
      const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
      response.forEach((emocion) => {
        const fecha = new Date(emocion.fecha);
        const dia = diasSemana[fecha.getDay()]; // Obtén el día de la semana (0 = Domingo, 1 = Lunes, etc.)
        const nombreEmocion = emocion.nombreEmocion.trim();
  
        // Incrementa el contador de esa emoción en el día correspondiente
        emocionesPorDia[dia][nombreEmocion] = (emocionesPorDia[dia][nombreEmocion] || 0) + 1;
      });
  
      // Calcular totales por día para convertirlos a porcentajes (para el gráfico de barras)
      const datasets = Object.keys(response.reduce((acc, emocion) => {
        acc[emocion.nombreEmocion.trim()] = true;
        return acc;
      }, {})).map((emocion, index) => ({
        label: emocion,
        data: diasSemana.map((dia) => {
          const totalPorDia = Object.values(emocionesPorDia[dia]).reduce((acc, val) => acc + val, 0);
          return totalPorDia > 0 ? (emocionesPorDia[dia][emocion] || 0) / totalPorDia * 100 : 0;
        }),
        backgroundColor: this.getPastelColor(index), // Usamos la función para asignar colores pastel
      }));
  
      // Actualiza el gráfico de barras con los datos calculados
      this.updateBarChart(diasSemana, datasets);
  
      // Calcular porcentajes para el gráfico de pie (porcentaje total de cada emoción)
      const emocionContador: { [emocion: string]: number } = {};
      response.forEach((emocion) => {
        const nombreEmocion = emocion.nombreEmocion.trim();
        emocionContador[nombreEmocion] = (emocionContador[nombreEmocion] || 0) + 1;
      });
  
      const total = response.length;
      const emocionPorcentaje: { [emocion: string]: number } = {};
      for (const key in emocionContador) {
        emocionPorcentaje[key] = (emocionContador[key] / total) * 100;
      }
  
      // Extrae las etiquetas y los datos para el gráfico de pie
      const labelsPie = Object.keys(emocionPorcentaje);
      const dataPie = Object.values(emocionPorcentaje);
      const pastelColors = labelsPie.map((_, index) => this.getPastelColor(index));
      // Actualiza el gráfico de pie con los datos calculados
      this.updatePieChart(labelsPie, dataPie,pastelColors);
    });
  }
  

  // Función para generar colores pastel
getPastelColor(index: number): string {
  const pastelColors = [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFB3", "#BAE1FF",
    "#E3BAFF", "#FFB6C1", "#C1E1C1", "#FFE4E1", "#D3E4F7"
  ];
  return pastelColors[index % pastelColors.length]; // Garantiza que siempre haya un color disponible
}

  

  createPieChart(labels: string[], data: number[]): void {
  const ctx = this.pieChartCanvas.nativeElement.getContext('2d');

  // Generar los colores pastel para cada etiqueta
  const pastelColors = labels.map((_, index) => this.getPastelColor(index));

  const config: ChartConfiguration<'pie', number[], string> = {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: pastelColors, // Usar los colores pastel generados
        },
      ],
    },
    options: {
      responsive: true,
    },
  };

  this.pieChart = new Chart<'pie'>(ctx!, config);
}


  
  createBarChart(labels: string[], data: number[]) {
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Porcentaje de emociones',
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: '#666',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    this.barChart = new Chart<'bar'>(ctx!, config);
  }

  updatePieChart(labels: string[], data: number[], backgroundColor: string[]) {
    this.pieChart.data.labels = labels;
    this.pieChart.data.datasets[0].data = data;
    this.pieChart.data.datasets[0].backgroundColor = backgroundColor; // Asignamos los colores pastel
    this.pieChart.update();
  }

  updateBarChart(labels: string[], datasets: { label: string; data: number[]; backgroundColor: string }[]) {
    this.barChart.data.labels = labels;
    this.barChart.data.datasets = datasets;
    this.barChart.update();
  }
  
}
