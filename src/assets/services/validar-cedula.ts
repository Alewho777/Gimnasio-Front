export const validarCedulaEcu =
function validarCedula(cedula: string) {
   
    if (cedula.length === 10) {

        const digitoRegion = cedula.substring(0, 2);

        if (digitoRegion >= String(0) && digitoRegion <= String(24)) {

            const ultimoDigito = Number(cedula.substring(9, 10));

            const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));

            let numeroUno: any = cedula.substring(0, 1);
            numeroUno = (numeroUno * 2);
            if (numeroUno > 9) {
                numeroUno = (numeroUno - 9);
            }

            let numeroTres: any = cedula.substring(2, 3);
            numeroTres = (numeroTres * 2);
            if (numeroTres > 9) {
                numeroTres = (numeroTres - 9);
            }

            let numeroCinco: any = cedula.substring(4, 5);
            numeroCinco = (numeroCinco * 2);
            if (numeroCinco > 9) {
                numeroCinco = (numeroCinco - 9);
            }

            let numeroSiete: any = cedula.substring(6, 7);
            numeroSiete = (numeroSiete * 2);
            if (numeroSiete > 9) {
                numeroSiete = (numeroSiete - 9);
            }

            let numeroNueve: any = cedula.substring(8, 9);
            numeroNueve = (numeroNueve * 2);
            if (numeroNueve > 9) {
                numeroNueve = (numeroNueve - 9);
            }

            const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

            const sumaTotal = (pares + impares);

            const primerDigitoSuma = String(sumaTotal).substring(0, 1);

            const decena = (Number(primerDigitoSuma) + 1) * 10;

            let digitoValidador = decena - sumaTotal;

            if (digitoValidador === 10) {
                digitoValidador = 0;
            }

            if (digitoValidador === ultimoDigito) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    } else {
        return false;
    }

}

