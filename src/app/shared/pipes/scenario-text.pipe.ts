import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'scenarioText'
})
export class ScenarioTextPipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): string {
        if (value.length > 40) {
            value = value.slice(0, 40);
            value = value.concat('...')
        }
        return value;
    }

}
