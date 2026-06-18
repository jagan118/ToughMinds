import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numToWord',
})
export class NumToWordPipe implements PipeTransform {
  
  private ones: { [key: number]: string } = {
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine'
  };

  private teens: { [key: number]: string } = {
    10: 'Ten',
    11: 'Eleven',
    12: 'Twelve',
    13: 'Thirteen',
    14: 'Fourteen',
    15: 'Fifteen',
    16: 'Sixteen',
    17: 'Seventeen',
    18: 'Eighteen',
    19: 'Nineteen'
  };

  private tens: { [key: number]: string } = {
    20: 'Twenty',
    30: 'Thirty',
    40: 'Forty',
    50: 'Fifty',
    60: 'Sixty',
    70: 'Seventy',
    80: 'Eighty',
    90: 'Ninety'
  };

  transform(num: number): string {
    if (num === 0) {
      return 'Zero';  // ✅ Fixed: was 'zero'
    }
    
    if (num < 0) {
      return 'Negative ' + this.transform(-num);
    }
    
    if (num < 10) {
      return this.ones[num];
    }
    
    if (num < 20) {
      return this.teens[num];
    }
    
    if (num < 100) {
      return this.convertTens(num);
    }
    
    if (num < 1000) {
      return this.convertHundreds(num);
    }
    
    return this.convertThousands(num);
  }

  private convertTens(num: number): string {
    const tensDigi = Math.floor(num / 10) * 10;
    const onesDigi = num % 10;
    
    let result = this.tens[tensDigi];

    if (onesDigi > 0) {
      result += '-' + this.ones[onesDigi];
    }
    
    return result;
  }

  private convertHundreds(num: number): string {
    const hundredsDigi = Math.floor(num / 100);
    const remainder = num % 100;

    let result = this.ones[hundredsDigi] + ' Hundred';  // ✅ Fixed: added space

    if (remainder > 0) {
      result += ' ' + this.convertTwoDigits(remainder);
    }
    
    return result;
  }

  private convertThousands(num: number): string {
    const thousandsDigi = Math.floor(num / 1000);
    const remainder = num % 1000;

    // ✅ Fixed: Use convertTwoDigits instead of convertHundreds
    let result = this.convertTwoDigits(thousandsDigi) + ' Thousand';

    if (remainder > 0) {
      result += ' ' + this.convertHundreds(remainder);
    }

    return result;
  }

  private convertTwoDigits(num: number): string {
    if (num === 0) {
      return '';
    } else if (num < 10) {
      return this.ones[num];
    } else if (num < 20) {
      return this.teens[num];
    } else {
      return this.convertTens(num);
    }
  }
}