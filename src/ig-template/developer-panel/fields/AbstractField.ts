export class AbstractField {
    object: Record<string, unknown> | undefined;
    componentName: string | undefined;

    propertyName: string;
    label: string | undefined;

    cssClass: string;

    constructor(propertyName: string, label?: string) {
        this.propertyName = propertyName;
        this.label = label;
        this.cssClass = 'btn-green';
    }

    get displayLabel(): string {
        return this.label ?? this.propertyName;
    }

    get value(): unknown {
        if (this.object == undefined) {
            console.warn(`Cannot get as object is undefined for AbstractField ${this.propertyName}`)
            return '';
        }
        return this.object[this.propertyName];
    }

    set value(value: unknown) {
        if (this.object == undefined) {
            console.warn(`Cannot get as object is undefined for AbstractField ${this.propertyName}`)
            return;
        }
        this.object[this.propertyName] = value;
    }

    setObject(object: unknown): this {
        this.object = object as Record<string, unknown>;
        return this;
    }

    setCssClass(cssClass: string): this {
        this.cssClass = cssClass;
        return this;
    }

    setComponentName(name: string): this {
        this.componentName = name;
        return this;
    }
}
