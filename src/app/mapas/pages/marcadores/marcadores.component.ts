import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import  * as mapboxgl from 'mapbox-gl';

interface MarcadorPersonalizado{
  color:string;
  marcador:mapboxgl.Marker;
}

interface locaSotreData{
  color:string;
  centro: [number,number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container{width:100%; height:100%} 
      .list-group{position:fixed; top:20px; right:20px; z-index:99;}
      li{cursor:pointer;}
    `
  ]
})
export class MarcadoresComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel:number = 13;
  center: [number,number] = [-3.6439253777110716, 40.42089606343155];

  //Array de marcadores
  marcadores: MarcadorPersonalizado[] = [];
  marcadoresStore: locaSotreData[] = [];


  constructor() { }

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

    this.leerMarcadoresLocalStorage();
    //const markerHtml: HTMLElement = document.createElement('div');
    //markerHtml.innerHTML = 'Hola mundo';

    //const marker = new mapboxgl.Marker({element:markerHtml})
    //.setLngLat(this.center).addTo(this.mapa);

    //const marker = new mapboxgl.Marker()
    //.setLngLat(this.center).addTo(this.mapa);


  }

  agregarMarcador(){

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({draggable: true, color:color})
      .setLngLat(this.center)
      .addTo(this.mapa);

      this.marcadores.push({color: color, marcador:nuevoMarcador});

      this.guardarMarcadoresLocalStorage();

      nuevoMarcador.on('dragend', ()=>{
        this.guardarMarcadoresLocalStorage();
      });

  }

  irMarcador(marcador:mapboxgl.Marker){

    this.mapa.flyTo({center: marcador.getLngLat()});;
  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr:locaSotreData[] = []; 

    this.marcadores.forEach( m => {
      const color = m.color;
      const {lng, lat} = m.marcador!.getLngLat();

      lngLatArr.push({
        color:color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerMarcadoresLocalStorage(){

    if (!localStorage.getItem('marcadores')){
      return ;
    }

    const lngLatArr:locaSotreData[] = JSON.parse(localStorage.getItem('marcadores')!);
    
    lngLatArr.forEach( m => {
      const marker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,

      }).setLngLat(m.centro!).addTo(this.mapa);

      this.marcadores.push({
        marcador: marker,
        color:m.color
      })

      marker.on('dragend', ()=>{
        this.guardarMarcadoresLocalStorage();
      });
    });
  }


  borrarMarcador(i:number){

    console.log('Doble click');
    this.marcadores[i].marcador?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
