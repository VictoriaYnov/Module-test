/**
 * Caluclate a person's age in years.
 *
 * @param {Object} p An object representing a person, implementing a birth Date parameter
 * @returns {number} The age in years of p.
 */

export function calculateAge(p) {

        // Aucun argument n’a été envoyé
        if(!p)
                throw new Error("missing param p")

        // Le format envoyé n'est pas un objet
        if (typeof p !== 'object')
                throw new Error("p is not an object")

        // L'objet ne contient pas le champ birth
        if (!p.birth)
                throw new Error("missing birth field")

        // Le champ birth n'est pas une date et la date envoyée est fausse
        if (!(p.birth instanceof Date) || isNaN(p.birth.getTime()))
                throw new Error("birth must be a valid Date")

        let dateDiff = new Date(Date.now() - p.birth.getTime())
        let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
        return age;
}