import { ChessPiece } from './../interfaces/chess.piece';
import { ChessPieceType, TILE_SIZE } from './../constants';
import { GameService } from '../services/game.service';
import { Component, OnInit } from '@angular/core';
import { Coordinates } from '../interfaces/coordinates';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  chessPieces$ = this.game.chessPieces$;
  fields: number[] = new Array(64).fill(0).map((_,i) => i);
  dragPosition = {x: 0, y: 0};
  coordinates(i): Coordinates {
    return {
      x: i % 8,
      y: Math.floor(i / 8)
    }
  }
  
constructor(private game: GameService) { }  

  ngOnInit() {

    }

  isDarkerTile(field: number) {
      return (this.coordinates(field).x + this.coordinates(field).y) % 2 === 1;
  }

  hasAKnight(field: number) {
    const fieldX = this.coordinates(field).x;
    const fieldY = this.coordinates(field).y;
    const chessPiece: ChessPiece = this.game.chessPieces.find(
      cp => 
      cp.type == ChessPieceType.KNIGHT &&
      cp.coordinates.x == fieldX && 
      cp.coordinates.y == fieldY);
    return chessPiece ? true : false;
  }

onDragEnded(event, field: number) {
  const fieldX = this.coordinates(field).x;
  const fieldY = this.coordinates(field).y;
  const chessPiece: ChessPiece = this.game.chessPieces.find(
    cp => 
    cp.coordinates.x == fieldX && 
    cp.coordinates.y == fieldY);

  let element = event.source.getRootElement();
  let boundingClientRect = element.getBoundingClientRect();
  let oldPosition: Coordinates = chessPiece.coordinates;
  let newPosition: Coordinates = ({ x: Math.floor(boundingClientRect.x / TILE_SIZE), y: Math.floor(boundingClientRect.y / TILE_SIZE) });

  if (this.game.canMoveKnight(chessPiece, oldPosition, newPosition)) {
    console.log('...moving knight...');  
    this.game.moveChessPiece(chessPiece, newPosition);
  } else {
    console.log('...invalid move!');
    event.source.reset();
  }
  
}

getPosition(el) {
  let x = 0;
  let y = 0;
  while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { x: x, y: y };
}
}
