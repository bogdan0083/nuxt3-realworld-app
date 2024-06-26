/* tslint:disable */
/* eslint-disable */
/**
 * RealWorld Conduit API
 * Conduit API documentation
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { User } from './User';
import {
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './User';

/**
 * 
 * @export
 * @interface Login200Response
 */
export interface Login200Response {
    /**
     * 
     * @type {User}
     * @memberof Login200Response
     */
    user: User;
}

/**
 * Check if a given object implements the Login200Response interface.
 */
export function instanceOfLogin200Response(value: object): boolean {
    if (!('user' in value)) return false;
    return true;
}

export function Login200ResponseFromJSON(json: any): Login200Response {
    return Login200ResponseFromJSONTyped(json, false);
}

export function Login200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): Login200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'user': UserFromJSON(json['user']),
    };
}

export function Login200ResponseToJSON(value?: Login200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'user': UserToJSON(value['user']),
    };
}

