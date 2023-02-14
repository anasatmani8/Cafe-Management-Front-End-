import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from 'src/app/shared/File';
import { ProductService } from './../services/product.service';
import { ImoAchat } from './../shared/imoAchat';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-imo-achat',
  templateUrl: './imo-achat.component.html',
  styleUrls: ['./imo-achat.component.scss'],
})
export class ImoAchatComponent implements OnInit {

  imoAchat: ImoAchat = {
    title: '',
    description: '',
    price: 0,
    adresse: '',
    surface: 0,
    rooms: 0,
    imoAchatImages: []
  };
  constructor(private prodService:ProductService,
    private sanitize:DomSanitizer) {}

  addAchat(imoAchatForm: NgForm) {
    console.log(this.imoAchat)
    const imoAchatFormData = this.prepareFormData(this.imoAchat);
    this.prodService.addAchat(imoAchatFormData).subscribe(
      (response: ImoAchat)=>{
        console.log(response)
      }, (error)=>{
        console.log(error)
      }
    );
    }

    prepareFormData(imoAchat:ImoAchat):FormData{
      const formData= new FormData();
      formData.append(
        'imoAchat',
        new Blob([JSON.stringify(imoAchat)], {type:'application/json'})
      );

      for (let index = 0; index < imoAchat.imoAchatImages.length; index++) {
        formData.append(
          'file',
          imoAchat.imoAchatImages[index].file,
          imoAchat.imoAchatImages[index].file.name
        )


      }
      return formData;
    }

    onFileSelected(event: any){
      if (event.target.files) {
        const file = event.target.files[0];
        console.log(file)
        const fileHandle: FileHandle = {
          file : file,
          url :this.sanitize.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          )
        }
        console.log(fileHandle)
        this.imoAchat.imoAchatImages.push(fileHandle);
      }

    }

  ngOnInit(): void {}
}
