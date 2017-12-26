/**
 * A few helper methods for strings
 */

import inflect from "i";
import { compact, size } from "lodash";

/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 *
 * If arity is 1, returns the plural form of the word.
 *
 * @param {String} count
 * @param {String} singular string
 * @param {String} plural string
 * @return {String} singular or plural, * is replaced with count
 * @api public
 */

export const plural = function (count, sn, pl) {
    if (arguments.length === 1) {
        return inflect.pluralize(count);
    }
    if (typeof sn !== "string") sn = "";
    if (!pl) {
        pl = inflect.pluralize(sn);
    }
    if (typeof count === "string") {
        count = Number(count);
    } else if (typeof count !== "number") {
        count = size(count);
    }
    return (count === 1 ? sn : pl).replace("*", count);
};


/**
 * Converts the first letter in a string to uppercase
 *
 * @param {String} str
 * @return {String} Str
 * @api public
 */

export const upcase = function (str) {
    if (str && str.toString) str = str.toString();
    if (typeof str !== "string" || !str.length) return "";
    return (str.substr(0, 1).toUpperCase() + str.substr(1));
};


/**
 * Converts the first letter in a string to lowercase
 *
 * @param {String} Str
 * @return {String} str
 * @api public
 */

export const downcase = function (str) {
    if (str && str.toString) str = str.toString();
    if (typeof str !== "string" || !str.length) return "";
    return (str.substr(0, 1).toLowerCase() + str.substr(1));
};


/**
 * Converts a string to title case
 *
 * @param {String} str
 * @return {String} Title Case form of str
 * @api public
 */

export const titlecase = function (str) {
    if (str && str.toString) str = str.toString();
    if (typeof str !== "string" || !str.length) return "";
    str = str.replace(/([a-z])([A-Z])/g, "$1 $2");
    const parts = str.split(/\s|_|\-/);
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
            parts[i] = upcase(parts[i]);
        }
    }
    return compact(parts).join(" ");
};


/**
 * Converts a string to camel case
 *
 * @param {String} str
 * @param {Boolean} lowercaseFirstWord
 * @return {String} camel-case form of str
 * @api public
 */

export const camelcase = function (str, lc) {
    return inflect.camelize(str, !(lc));
};
