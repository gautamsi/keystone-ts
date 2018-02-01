import * as demand from 'must';
import { MoneyType } from '../MoneyType';
import { NumberType } from '../../number/NumberType';

export const initList = function (List) {
    List.add({
        money: { type: MoneyType },
        nested: {
            money: { type: MoneyType },
        },
        noFormat: { type: MoneyType, format: false },
    });
};

export const testFieldType = function (List) {
    describe('invalid options', function () {
        it('should throw when format is not a string', function (done) {
            try {
                List.add({
                    invalidFormatOption: { type: MoneyType, format: /aregexp/ },
                });
            } catch (err) {
                demand(err.message).eql('FieldType.Number: options.format must be a string.'); // must be FieldType.Number not like FieldType.Money due to inheritance
                done();
            }
        });
    });

    describe('updateItem', function () {
        it('should update top level fields', function (done) {
            const testItem = new List.model();
            List.fields.money.updateItem(testItem, {
                money: 42,
            }, function () {
                demand(testItem.money).be.equal(42);
                done();
            });
        });

        it('should update nested fields', function (done) {
            const testItem = new List.model();
            List.fields['nested.money'].updateItem(testItem, {
                nested: {
                    money: 42,
                },
            }, function () {
                demand(testItem.nested.money).be.equal(42);
                done();
            });
        });

        it('should update nested fields with flat paths', function (done) {
            const testItem = new List.model();
            List.fields['nested.money'].updateItem(testItem, {
                'nested.money': 42,
            }, function () {
                demand(testItem.nested.money).be.equal(42);
                done();
            });
        });
    });

    it('should use the common number input validator', function () {
        demand(List.fields.money.validateInput === NumberType.prototype.validateInput);
    });

    it('should use the common number required validator', function () {
        demand(List.fields.money.validateRequiredInput === NumberType.prototype.validateRequiredInput);
    });

    it('should use the common number addFilterToQuery', function () {
        demand(List.fields.money.addFilterToQuery === NumberType.prototype.addFilterToQuery);
    });

    describe('format', function () {
        it('should properly format', function () {
            const testItem = new List.model();
            testItem.money = 1234;
            demand(testItem._.money.format()).be.equal('$1,234.00');
            testItem.money = -244;
            demand(testItem._.money.format()).be.equal('-$244.00');
        });

        it('should ignore formatting if the format option is false', function () {
            const testItem = new List.model();
            testItem.noFormat = 1234;
            demand(testItem._.noFormat.format()).be.equal(1234);
            testItem.noFormat = -244;
            demand(testItem._.noFormat.format()).be.equal(-244);
        });
    });

    /* Deprecated inputIsValid tests */

    it('should validate numeric input', function () {
        demand(List.fields.money.inputIsValid({
            money: 0,
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: 1,
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: -1,
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: 1.1,
        })).be.true();
    });

    it('should validate string input', function () {
        demand(List.fields.money.inputIsValid({
            money: '0',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '1',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '-1',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '1.1',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '$0',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '$1',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '$-1',
        })).be.true();
        demand(List.fields.money.inputIsValid({
            money: '$1.1',
        })).be.true();
    });

    it('should validate no input', function () {
        const testItem = new List.model();
        demand(List.fields.money.inputIsValid({})).be.true();
        demand(List.fields.money.inputIsValid({}, true)).be.false();
        demand(List.fields.money.inputIsValid({ money: '' })).be.true();
        demand(List.fields.money.inputIsValid({ money: '' }, true)).be.false();
        testItem.money = 1;
        demand(List.fields.money.inputIsValid({}, true, testItem)).be.true();
    });

    it('should invalidate invalid input', function () {
        demand(List.fields.money.inputIsValid({
            money: {},
        })).be.false();
        demand(List.fields.money.inputIsValid({
            money: [],
        })).be.false();
        demand(List.fields.money.inputIsValid({
            money: 'a',
        })).be.false();
    });
};
