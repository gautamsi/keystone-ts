import * as demand from 'must';
import { LocationType } from '../LocationType';

export const initList = function (List) {
    List.add({
        locationBasic: { type: LocationType },
        locationCustomRequired: { type: LocationType, required: ['state', 'country'] },
    });
};

export const testFieldType = function (List) {
    describe('updateItem', function () {
        describe('flat paths', function () {
            it('should update the number', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.number': 'number',
                }, function () {
                    demand(testItem.locationBasic.number).be.equal('number');
                    done();
                });
            });

            it('should update the name', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.name': 'name',
                }, function () {
                    demand(testItem.locationBasic.name).be.equal('name');
                    done();
                });
            });

            it('should update the street1', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.street1': 'street1',
                }, function () {
                    demand(testItem.locationBasic.street1).be.equal('street1');
                    done();
                });
            });

            it('should update the street2', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.street2': 'street2',
                }, function () {
                    demand(testItem.locationBasic.street2).be.equal('street2');
                    done();
                });
            });

            it('should update the suburb', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.suburb': 'suburb',
                }, function () {
                    demand(testItem.locationBasic.suburb).be.equal('suburb');
                    done();
                });
            });

            it('should update the state', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.state': 'state',
                }, function () {
                    demand(testItem.locationBasic.state).be.equal('state');
                    done();
                });
            });

            it('should update the postcode', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.postcode': 'postcode',
                }, function () {
                    demand(testItem.locationBasic.postcode).be.equal('postcode');
                    done();
                });
            });

            it('should update the country', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.country': 'country',
                }, function () {
                    demand(testItem.locationBasic.country).be.equal('country');
                    done();
                });
            });

            it('should update the geo', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.geo': [3.14, 1.59],
                }, function () {
                    demand(testItem.locationBasic.geo[0]).be.equal(3.14);
                    demand(testItem.locationBasic.geo[1]).be.equal(1.59);
                    done();
                });
            });
        });

        describe('nested paths', function () {
            it('should update the number', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        number: 'number',
                    },
                }, function () {
                    demand(testItem.locationBasic.number).be.equal('number');
                    done();
                });
            });

            it('should update the name', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        name: 'name',
                    },
                }, function () {
                    demand(testItem.locationBasic.name).be.equal('name');
                    done();
                });
            });

            it('should update the street1', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        street1: 'street1',
                    },
                }, function () {
                    demand(testItem.locationBasic.street1).be.equal('street1');
                    done();
                });
            });

            it('should update the street2', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        street2: 'street2',
                    },
                }, function () {
                    demand(testItem.locationBasic.street2).be.equal('street2');
                    done();
                });
            });

            it('should update the suburb', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        suburb: 'suburb',
                    },
                }, function () {
                    demand(testItem.locationBasic.suburb).be.equal('suburb');
                    done();
                });
            });

            it('should update the state', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        state: 'state',
                    },
                }, function () {
                    demand(testItem.locationBasic.state).be.equal('state');
                    done();
                });
            });

            it('should update the postcode', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        postcode: 'postcode',
                    },
                }, function () {
                    demand(testItem.locationBasic.postcode).be.equal('postcode');
                    done();
                });
            });

            it('should update the country', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        country: 'country',
                    },
                }, function () {
                    demand(testItem.locationBasic.country).be.equal('country');
                    done();
                });
            });

            it('should update the geo', function (done) {
                const testItem = new List.model();
                List.fields.locationBasic.updateItem(testItem, {
                    locationBasic: {
                        geo: [3.14, 1.59],
                    },
                }, function () {
                    demand(testItem.locationBasic.geo[0]).be.equal(3.14);
                    demand(testItem.locationBasic.geo[1]).be.equal(1.59);
                    done();
                });
            });
        });

        it('should remove the location.geo path without valid values', function (done) {
            const testItem = new List.model();
            List.fields.locationBasic.updateItem(testItem, {
                'locationBasic.geo': ['151.2099', '-33.865143'],
            }, function () {
                demand(testItem.locationBasic.geo[0]).be.equal(151.2099);
                demand(testItem.locationBasic.geo[1]).be.equal(-33.865143);

                List.fields.locationBasic.updateItem(testItem, {
                    'locationBasic.geo_lat': '',
                    'locationBasic.geo_lng': '',
                }, function () {
                    demand(testItem.locationBasic.geo).be.undefined();
                    done();
                });
            });
        });
    });

    describe('validateInput', function () {

    });

    describe('kmFrom()', function () {
        it('should return a number', function () {
            const testItem = new List.model();

            testItem.locationBasic = {
                geo: [151.2093, -33.8688],
            };
            const diff = testItem._.locationBasic.kmFrom([151, -33]);
            demand(diff).eql(98.5390186615803);
        });
    });

    describe('milesFrom()', function () {
        it('should return a number', function () {
            const testItem = new List.model();

            testItem.locationBasic = {
                geo: [151.2093, -33.8688],
            };
            const diff = testItem._.locationBasic.milesFrom([151, -33]);
            demand(diff).eql(61.23308348472711);
        });
    });

    describe('addFilterToQuery', function () {
        it('should allow to filter by street', function () {
            const result = List.fields.locationBasic.addFilterToQuery({
                street: 'Broadway',
            });
            demand(result['locationBasic.street1']).eql(/Broadway/i);
        });

        it('should allow to filter by city', function () {
            const result = List.fields.locationBasic.addFilterToQuery({
                city: 'NYC',
            });
            demand(result['locationBasic.suburb']).eql(/NYC/i);
        });

        it('should allow to filter by state', function () {
            const result = List.fields.locationBasic.addFilterToQuery({
                state: 'New York',
            });
            demand(result['locationBasic.state']).eql(/New York/i);
        });

        it('should allow to filter by code', function () {
            const result = List.fields.locationBasic.addFilterToQuery({
                code: 10023,
            });
            demand(result['locationBasic.postcode']).eql(/10023/i);
        });

        it('should allow to filter by country', function () {
            const result = List.fields.locationBasic.addFilterToQuery({
                country: 'USA',
            });
            demand(result['locationBasic.country']).eql(/USA/i);
        });

        it('should support inverted mode', function () {
            const result = List.fields.locationBasic.addFilterToQuery({
                country: 'USA',
                inverted: true,
            });
            demand(result['locationBasic.country']).eql({
                $not: /USA/i,
            });
        });
    });


    /* Deprecated inputIsValid method tests */

    it('should validate required fields', function () {
        const testItem = new List.model();
        // List.fields.locationBasic.inputIsValid({}, true, testItem).must.be.false();
        List.fields.locationBasic.inputIsValid({
            'locationBasic.street1': 'street1',
            'locationBasic.suburb': '',
        }, true, testItem).must.be.false();
        List.fields.locationBasic.inputIsValid({
            'locationBasic.street1': 'street1',
            'locationBasic.suburb': 'suburb',
        }, true, testItem).must.be.true();
        List.fields.locationBasic.inputIsValid({
            locationBasic: {
                street1: 'street1',
                suburb: 'suburb',
            },
        }, true, testItem).must.be.true();
        List.fields.locationCustomRequired.inputIsValid({
            'locationCustomRequired.street1': 'street1',
            'locationCustomRequired.suburb': 'suburb',
        }, true, testItem).must.be.false();
        List.fields.locationCustomRequired.inputIsValid({
            'locationCustomRequired.state': 'state',
            'locationCustomRequired.country': 'country',
        }, true, testItem).must.be.true();
    });
};
