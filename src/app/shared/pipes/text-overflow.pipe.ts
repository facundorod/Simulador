import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textOverflow'
})
export class TextOverflowPipe implements PipeTransform {

    transform(value: string, maxLength: number, ...args: unknown[]): string {
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            value = value.concat('...')
        }
        return value;
    }

}
