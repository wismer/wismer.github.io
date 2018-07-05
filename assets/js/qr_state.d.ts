/* tslint:disable */
export function greet(arg0: string): void;

export function create_qr(arg0: number, arg1: Uint8Array): void;

export class QRState {
free(): void;
 current_index(): number;

 dark(): boolean;

 current_codeword(): number;

 size(): number;

 peek(): number;

 current_bit(): number;

 tick(arg0: number): void;

 alignment_points(): Uint32Array;

static  new(arg0: number, arg1: Uint8Array): QRState;

}
