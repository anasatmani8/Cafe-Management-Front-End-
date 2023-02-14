import { FileHandle } from 'src/app/shared/File';
export interface ImoAchat{
  title:string,
  description:string,
  price:number,
  adresse:string,
  surface:number,
  rooms:number,
  imoAchatImages:FileHandle[]
}
