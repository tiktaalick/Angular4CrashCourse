import { Coordinates } from './../../game/interfaces/coordinates';
export interface ChessPiece {
  id: number;
  type: string;
  isBlack: boolean; 
  from: Coordinates;
  to: Coordinates;
}
