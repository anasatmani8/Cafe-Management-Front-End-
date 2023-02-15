import { FileHandle } from './../shared/File';
import { DomSanitizer } from '@angular/platform-browser';
import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';


@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  @Output() files:EventEmitter<FileHandle> = new EventEmitter();

  @HostBinding("style.background") private background = "#eee";

  constructor(private sanitize:DomSanitizer) { }

  @HostListener("dragover", ["$event"])
  public onDragOver(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"])
  public onDragLeave(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";
  }

  @HostListener("drop", ["$event"])
  public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";

    let fileHandle: FileHandle= null as any;

    if (evt.dataTransfer != undefined) {
      const file = evt.dataTransfer.files[0];
       const url = this.sanitize.bypassSecurityTrustUrl(window.URL?.createObjectURL(file));

    fileHandle = {file,url};
    }



    this.files.emit(fileHandle);
  }

}
