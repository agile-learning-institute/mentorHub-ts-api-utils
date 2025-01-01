/**
 * NOTE: This set of unit tests requires a mongodb 
 * You can run a mongo container with test data using
 * mh up mongodb
 */
import { ObjectId } from 'mongodb';
import { encodeDocument } from './MongoEncode';

describe('MongoEncode', () => {

    beforeEach(async () => {
    });

    afterEach(async () => {
    });

    test('test_simple_id_encode', async () => {
        const id_string = "123456789012345678901234";
        let document = {"id_prop": id_string};
        encodeDocument(document, ["id_prop"], []);
        expect(document["id_prop"]).toStrictEqual(new ObjectId(id_string));
    });

    test('test_sub_document_id_encode', async () => {
        const id_string = "123456789012345678901234";
        let document = {"baseObject": {"id_prop": id_string}};
        encodeDocument(document, ["id_prop"], []);
        expect(document["baseObject"]["id_prop"]).toStrictEqual(new ObjectId(id_string));
    });

    test('test_list_id_encode', async () => {
        const id_string1 = "123456789012345678901234";
        const id_string2 = "000000000000000000000001";
        const document = {"listOfIds": [id_string1, id_string2]};
        const expected = {"listOfIds": [new ObjectId(id_string1), new ObjectId(id_string2)]};
        
        encodeDocument(document, ["listOfIds"], []);
        expect(document).toStrictEqual(expected);
    });

    test('test_list_document_id_encode', async () => {
        const id_string1 = "123456789012345678901234";
        const id_string2 = "000000000000000000000001";
        const document = {"listOfObjects": [{idProp: id_string1}, {idProp: id_string2}]};
        const expected = {"listOfObjects": [{idProp: new ObjectId(id_string1)}, {idProp: new ObjectId(id_string2)}]};
        
        encodeDocument(document, ["idProp"], []);
        expect(document).toStrictEqual(expected);
    });

    test('test_multiple_id_encode', async () => {
        const id_string1 = "123456789012345678901234";
        const id_string2 = "000000000000000000000001";
        const document = {"propA": id_string1, "propB": id_string2};
        const expected = {"propA": new ObjectId(id_string1), "propB": new ObjectId(id_string2)};
        
        encodeDocument(document, ["propA", "propB"], []);
        expect(document).toStrictEqual(expected);
    });

    test('test_simple_date_encode', async () => {
        const date_string = "2024-12-27T12:34:56.000Z";
        const document = {"dateProp": date_string};
        const expected = {"dateProp": new Date(date_string)};
        
        encodeDocument(document, [], ["dateProp"]);
        expect(document).toStrictEqual(expected);
    });

    test('test_sub_document_date_encode', async () => {
        const date_string = "2024-12-27T12:34:56.000Z";
        const document = {"docProp": {"dateProp": date_string}};
        const expected = {"docProp": {"dateProp": new Date(date_string)}};
        
        encodeDocument(document, [], ["dateProp"]);
        expect(document).toStrictEqual(expected);
    });

    test('test_multiple_date_encode', async () => {
        const date_string1 = "2024-12-27T12:34:56.000Z";
        const date_string2 = "2009-10-11T12:34:56.000Z";
        const document = {"dateProp1": date_string1, "dateProp2": date_string2};
        const expected = {"dateProp1": new Date(date_string1), "dateProp2": new Date(date_string2)};
        
        encodeDocument(document, [], ["dateProp1", "dateProp2"]);
        expect(document).toStrictEqual(expected);
    });

    test('test_list_date_encode', async () => {
        const date_string1 = "2024-12-27T12:34:56.000Z";
        const date_string2 = "2009-10-11T12:34:56.000Z";
        const document = {"dateProp": [date_string1, date_string2]};
        const expected = {"dateProp": [new Date(date_string1), new Date(date_string2)]};
        
        encodeDocument(document, [], ["dateProp"]);
        expect(document).toStrictEqual(expected);
    });

    test('test_list_document_date_encode', async () => {
        const date_string1 = "2024-12-27T12:34:56.000Z";
        const date_string2 = "2009-10-11T12:34:56.000Z";
        const document = {"listOfObjects": [{"dateProp": date_string1}, {"dateProp": date_string2}]};
        const expected = {"listOfObjects": [{"dateProp": new Date(date_string1)}, {"dateProp": new Date(date_string2)}]};
        
        encodeDocument(document, [], ["dateProp"]);
        expect(document).toStrictEqual(expected);
    });

    test('test_complexity', async () => {
        const document = {
            "property1": 1,
            "property2": "someData",
            "base_id_property": "000000000000000000000001",
            "list_of_id": [
                "000000000000000000000001",
                "000000000000000000000002",
                "000000000000000000000003"
            ],
            "date_property": "2000-01-23T01:23:45.000Z",
            "list_of_dates": [
                "2009-10-11T12:34:56.000Z",
                "2009-11-11T11:11:11.000Z",
                "2009-12-12T12:12:12.000Z",
                "2010-01-01T01:01:01.000Z",                
            ],
            "list_of_objects": [
                {"id_property": "000000000000000000000004", "date_property": "2002-02-02T02:02:02.000Z" },
                {"id_property": "000000000000000000000005", "date_property": "2003-03-03T03:03:03.000Z" },
                {"id_property": "000000000000000000000006", "date_property": "2004-04-04T04:04:04.000Z" },
            ]
        };

        const expected = {
            "property1": 1,
            "property2": "someData",
            "base_id_property": new ObjectId("000000000000000000000001"),
            "list_of_id": [
                new ObjectId("000000000000000000000001"),
                new ObjectId("000000000000000000000002"),
                new ObjectId("000000000000000000000003")
            ],
            "date_property": new Date("2000-01-23T01:23:45.000Z"),
            "list_of_dates": [
                new Date("2009-10-11T12:34:56.000Z"),
                new Date("2009-11-11T11:11:11.000Z"),
                new Date("2009-12-12T12:12:12.000Z"),
                new Date("2010-01-01T01:01:01.000Z"),
            ],
            "list_of_objects": [
                {"id_property": new ObjectId("000000000000000000000004"), "date_property": new Date("2002-02-02T02:02:02.000Z") },
                {"id_property": new ObjectId("000000000000000000000005"), "date_property": new Date("2003-03-03T03:03:03.000Z") },
                {"id_property": new ObjectId("000000000000000000000006"), "date_property": new Date("2004-04-04T04:04:04.000Z") },
            ]
        }
    
        encodeDocument(document, ["base_id_property", "list_of_id", "id_property"], ["date_property", "list_of_dates"]);
        expect(document).toStrictEqual(expected);
    });

    test('test_polymorphic', async () => {
        const document = {
            "name": "Test polymorphic list",   
            "polymorphic_list": [
                {
                    "id_property": "999999999999999999999999", 
                    "date_property": "2009-10-11T12:34:56.000Z"
                },
                "123456789012345678901234",
                [
                    "123456789012345678900000",
                    "123456789012345678900001",
                    "123456789012345678900002",
                    "123456789012345678900003"
                ]
            ]
        }

        const expected = {
            "name": "Test polymorphic list",   
            "polymorphic_list": [
                {
                    "id_property": "999999999999999999999999", 
                    "date_property": "2009-10-11T12:34:56.000Z"
                },
                new ObjectId("123456789012345678901234"),
                [
                    new ObjectId("123456789012345678900000"),
                    new ObjectId("123456789012345678900001"),
                    new ObjectId("123456789012345678900002"),
                    new ObjectId("123456789012345678900003")
                ]
            ]
        }

        encodeDocument(document, ["polymorphic_list", "list_of_id", "id_property"], ["date_property", "list_of_dates"]);
        expect(document).toStrictEqual(expected);
    });
    
})
    /*
    
        def test_polymorphic(self):
            document = {
                "name": "Test polymorphic list",   
                "polymorphic_list": [
                    {
                        "id_property": "999999999999999999999999", 
                        "date_property": "2009-10-11T12:34:56.000Z"
                    },
                    "123456789012345678901234",
                    [
                        "123456789012345678900000",
                        "123456789012345678900001",
                        "123456789012345678900002",
                        "123456789012345678900003"
                    ]
                ]
            }
    
            expected = {
                "name": "Test polymorphic list",   
                "polymorphic_list": [
                    {
                        "id_property": "999999999999999999999999", 
                        "date_property": "2009-10-11T12:34:56.000Z"
                        # Note that these will not encode - known limitation
                    },
                    ObjectId("123456789012345678901234"),
                    [
                        ObjectId("123456789012345678900000"),
                        ObjectId("123456789012345678900001"),
                        ObjectId("123456789012345678900002"),
                        ObjectId("123456789012345678900003")
                    ]
                ]
            }
    
            encode_document(document, ["polymorphic_list", "id_property"], ["date_property"])
            self.assertEqual(document, expected)
*/