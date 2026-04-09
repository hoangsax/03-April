import { Cloth } from "../entity/cloth.ts";
import { Receipt } from "../entity/receipt.ts";

export interface CartCheckoutProvider {
    createReceipt(cloths: Cloth[], clientPayment: number, discount: number, staffID: number): Receipt | null;
    sellCloths(receipt: Receipt): boolean;
}

export class CartManager {
    private cart: Cloth[] = [];
    private readonly provider: CartCheckoutProvider;

    constructor(provider: CartCheckoutProvider) {
        this.provider = provider;
    }

    addToCart(cloth: Cloth): void {
        this.cart.push(cloth);
    }

    getCart(): Cloth[] {
        return [...this.cart];
    }

    clearCart(): void {
        this.cart = [];
    }

    getCartTotal(): number {
        return this.cart.reduce((total, cloth) => total + cloth.basePrice, 0);
    }
}