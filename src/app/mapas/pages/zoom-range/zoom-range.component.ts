import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import  * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container{width:100%; height:100%} 
      .row {background-color:white; border-radius: 5px; bottom: 16px; left: 50px; padding: 10px; position:fixed; z-index:999; width:400px;}
    `
  ]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel:number = 10;
  center: [number,number] = [-3.6439253777110716, 40.42089606343155]

  constructor() {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  
    console.log('ngAfterViewInit', this.divMapa);

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
      console.log(this.zoomLevel);
    })

    this.mapa.on('zoomend', (ev) => {
      if (this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18)
      };
    })

    //Movimiento del mapa
    this.mapa.on('move', (ev) => {
      const target = ev.target;
      const { lng, lat } = target.getCenter();
      console.log(target.getCenter());
      
      
    })
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }
  

  zoomIn(){
    this.mapa.zoomIn();
  }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomCambio(value:string){
    this.mapa.zoomTo(Number(value));
  }
}
