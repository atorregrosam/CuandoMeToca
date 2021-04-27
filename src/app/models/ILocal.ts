export interface ISector {
  backColor: string;
  id: number;
  nombre: string;
}

export interface ILocal {
  direccion: string;
  id: number;
  nombre: string;
  relacionados: string;
  sector: ISector;
  sectores: ISector[];
  turnoUltimo?: any;
  turnoActual?: any;
}
