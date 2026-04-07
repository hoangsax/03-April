class Cloth {
    static instanceCount = 0;
    designName: string;
    barcode: string;
    color: string;
    size: number;
    material: string;
    categories: string[];
    basePrice: number;

    constructor(designName: string, barcode: string, color: string, size: number, material: string, categories: string[], price: number) {
        this.designName = designName;
        this.barcode = barcode;
        this.color = color;
        this.size = size;
        this.material = material;
        this.categories = categories;
        this.basePrice = price;
    }


}

export { Cloth };