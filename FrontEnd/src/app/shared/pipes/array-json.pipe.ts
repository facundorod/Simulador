import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "arrayJson",
})
export class ArrayJsonPipe implements PipeTransform {
    transform(values: any[], type: string = ""): any {
        let valueString: string = "";
        if (values && values.length > 0)
            values.forEach((elem, index) => {
                if (type === "medications") {
                    if (elem.medication && elem.medication.name)
                        valueString = valueString.concat(elem.medication.name);
                } else valueString = valueString.concat(elem?.name);
                if (index !== values.length - 1)
                    valueString = valueString.concat(",");
            });
        else {
            valueString = "-";
        }
        return valueString;
    }
}
