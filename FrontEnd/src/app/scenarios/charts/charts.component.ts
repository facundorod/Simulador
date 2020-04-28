import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, OnDestroy{
  public chart: any = null;
  private intervalUpdate: any = null;
  
  ngOnInit(): void {
    this.chart = new Chart('realtime', {
      type: 'line',
      data: {
       labels: [],
       datasets: [
         {
        label: 'Data',
        fill: false,
        data: [],
        backgroundColor: '#168ede',
        borderColor: '#168ede'
         }
       ]
        },
        options: {
       tooltips: {
        enabled: false
       },
       legend: {
        display: false,
        position: 'bottom',
        labels: {
         fontColor: 'white'
        }
       },
       scales: {
         yAxes: [{
          ticks: {
           fontColor: "white",
           display: false,
          }
         }],
         xAxes: [{
        ticks: {
         fontColor: "white",
         beginAtZero: true,
         display: false,
        }
         }]
       }
        }
     });
    this.intervalUpdate = setInterval(function(){
     this.showData();
    }.bind(this), 500);
   }

  ngOnDestroy(): void {
    clearInterval(this.intervalUpdate);
  }

  showData() {
    let chartTime: any = new Date();
    chartTime = chartTime.getHours() + ':' + ((chartTime.getMinutes() < 10) ? '0' + chartTime.getMinutes() : chartTime.getMinutes()) + ':' + ((chartTime.getSeconds() < 10) ? '0' + chartTime.getSeconds() : chartTime.getSeconds());
    this.chart.data.labels.push(chartTime);
    this.chart.data.datasets[0].data.push(Math.floor((Math.random() * 10) + 1));
    this.chart.update();
  }

}
