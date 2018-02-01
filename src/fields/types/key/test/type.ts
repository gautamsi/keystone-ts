import * as demand from 'must';
import { KeyType } from '../KeyType';
import { TextType } from '../../text/TextType';

export const initList = function (List) {
    List.add({
        key: { type: KeyType },
        customSeparator: { type: KeyType, separator: '$' },
        nested: {
            key: { type: KeyType },
        },
    });
};

export const testFieldType = function (List) {
    describe('updateItem', function () {
        it('should update top level fields', function (done) {
            const testItem = new List.model();
            List.fields.key.updateItem(testItem, {
                key: 'foobar',
            }, function () {
                demand(testItem.key).be.equal('foobar');
                done();
            });
        });

        it('should update nested fields', function (done) {
            const testItem = new List.model();
            List.fields['nested.key'].updateItem(testItem, {
                nested: {
                    key: 'foobar',
                },
            }, function () {
                demand(testItem.nested.key).be.equal('foobar');
                done();
            });
        });

        it('should update nested fields with flat paths', function (done) {
            const testItem = new List.model();
            List.fields['nested.key'].updateItem(testItem, {
                'nested.key': 'foobar',
            }, function () {
                demand(testItem.nested.key).be.equal('foobar');
                done();
            });
        });

        it('should update the item with a slugified value', function (done) {
            const testItem = new List.model();
            List.fields.key.updateItem(testItem, {
                key: 'A b ç',
            }, function () {
                demand(testItem.key).be.equal('a-b-c');
                done();
            });
        });

        it('should use the separator option for the slugified value', function (done) {
            const testItem = new List.model();
            List.fields.customSeparator.updateItem(testItem, {
                customSeparator: 'A b ç',
            }, function () {
                demand(testItem.customSeparator).be.equal('a$b$c');
                testItem.customSeparator = undefined;
                done();
            });
        });
    });

    it('should use the common text validateInput method', function () {
        demand(List.fields.key.validateInput === TextType.prototype.validateInput);
    });

    it('should use the common text validateRequiredInput method', function () {
        demand(List.fields.key.validateRequiredInput === TextType.prototype.validateRequiredInput);
    });

    it('should use the common text addFilterToQuery method', function () {
        demand(List.fields.key.addFilterToQuery === TextType.prototype.addFilterToQuery);
    });

    describe('generateKey', function () {
        it('should return a slug of the provided string', function () {
            List.fields.key.generateKey('A b ç').must.be('a-b-c');
        });

        it('should use the seperator option', function () {
            demand(List.fields.customSeparator.generateKey('A b c')).be.equal('a$b$c');
        });
    });

    /* Deprecated inputIsValid method tests */

    it('should invalidate input with stripped characters', function () {
        const testItem = new List.model();
        List.fields.key.inputIsValid({
            key: '()',
        }, true, testItem).must.be.false();
    });

    it('should invalidate input with just whitespace', function () {
        const testItem = new List.model();
        List.fields.key.inputIsValid({
            key: ' ',
        }, true, testItem).must.be.false();
    });

    it('should validate input with non-key characters', function () {
        const testItem = new List.model();
        List.fields.key.inputIsValid({
            key: 'A b',
        }, true, testItem).must.be.true();
    });
};
