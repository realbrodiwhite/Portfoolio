import { Pipe, PipeTransform } from '@angular/core';
import { prettifySymbol } from '@portfoolio/common/helper';

@Pipe({ name: 'gfSymbol' })
export class SymbolPipe implements PipeTransform {
  public constructor() {}

  public transform(aSymbol: string) {
    return prettifySymbol(aSymbol);
  }
}
