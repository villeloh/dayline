import { Utils } from './../../utils/Utils';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe to transform image urls (to display differently sized images).
 */

@Pipe({
  name: 'thumbnail'
})
export class ThumbnailPipe implements PipeTransform {

  baseUrl = Utils.BASE_API_URL + 'uploads/';

  transform(value: any, size?: string): string {

    const defaultSize = '-tn320.png';
    let usedSize;

    if (size ==='normal' || size === null) {

      usedSize = defaultSize;

    } else if (size === 'small') {

      usedSize = '-tn160.png';

    } else if (size === 'large') {

      usedSize = '-tn640.png';

    } else {
      console.log('invalid thumbnail pipe size specified!');
    } // end if-else

    let tempArray;
    let tempStr;

    tempArray = value.split('.'); // value = 'filename' attribute; result: [picString, png]
    tempStr = tempArray[0]; // result: 'picString'

    return this.baseUrl + tempStr + usedSize; // replace original image url
  } // end transform()

} // end class
