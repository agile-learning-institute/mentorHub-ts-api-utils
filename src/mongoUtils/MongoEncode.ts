import { ObjectId } from "mongodb";

/**
 * Encode ObjectId and date values for MongoDB in place.
 * 
 * Traverses the given document recursively, modifying it in place.
 * It encodes specified fields into MongoDB-compatible formats: `ObjectId` for
 * `objectProps` and `Date` for `dateProps`.
 * 
 * @param document - The document to encode. This is modified in place.
 * @param objectProps - List of keys that should be converted to ObjectId.
 * @param dateProps - List of keys that should be converted to Date.
 * @returns The same document, modified in place.
 * 
 * @throws Error if an invalid ObjectId or Date value is encountered.
 */
export const encodeDocument = (
    document: Record<string, any>, 
    objectProps: string[],
    dateProps: string[]
): Record<string, any> => {

    // Helper function to encode values
    const encodeValue = (key: string, value: any): any => {
        try {
            if (objectProps.includes(key)) {
                if (typeof value === "string") {
                    return new ObjectId(value);
                }
                if (Array.isArray(value)) {
                    return value.map(item => (typeof item === "string" ? new ObjectId(item) : item));
                }
            }
            if (dateProps.includes(key)) {
                if (typeof value === "string") {
                    return new Date(value); 
                }
                if (Array.isArray(value)) {
                    return value.map(item => (typeof item === "string" ? new Date(item) : item));
                }
            }
        } catch (error) {
            throw new Error(`Error encoding key "${key}": ${value}`);
        }
        return value;
    };

    // Modify the document in place
    for (const [key, value] of Object.entries(document)) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            encodeDocument(value as Record<string, any>, objectProps, dateProps); // Recurse for nested objects
        } else if (Array.isArray(value)) {
            if (value.every(item => typeof item === "object" && !Array.isArray(item))) {
                value.forEach(item =>
                    encodeDocument(item as Record<string, any>, objectProps, dateProps) // Recurse for objects in arrays
                );
            } else {
                document[key] = value.map(item => encodeValue(key, item)); // Encode non-object array elements
            }
        } else {
            document[key] = encodeValue(key, value); // Encode primitive or single values
        }
    }

    return document;
};