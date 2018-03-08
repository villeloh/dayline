import { ThumbnailPipe } from './../../pipes/thumbnail/thumbnail';
import { DlImage } from './../../models/DlImage';
import { Component, Input } from '@angular/core';

/**
 * A custom component that works as a container for the images in the image list.
 */

@Component({
  selector: 'image-box',
  templateUrl: 'image-box.html'
})
export class ImageBoxComponent {

  @Input()
  img: DlImage;

  constructor() {
  }
}
