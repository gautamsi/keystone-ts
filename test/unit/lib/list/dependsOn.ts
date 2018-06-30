import { keystone } from '../../../../src/index';
import * as demand from 'must';
import mongoose from '../../../helpers/getMongooseConnection';
keystone.mongoose = mongoose;

keystone.import('../models');

let DependsOn = keystone.list('DependsOn');

describe('Test dependsOn and required', function () {

    it('Ignore required if evalDependsOn is not `true` by setting `state` to `draft`', function (done) {
        // remove any Post documents
        DependsOn.model.find({}).remove(function (error) {
            if (error) {
                done(error);
            }

            let newPost = new DependsOn.model({
                title: 'new post',
                state: 'draft'
            });

            newPost.save(done);

        });
    });



    it('Save will fail if `state` set to `published` and `publishedDate` is not defined', function (done) {
        // remove any Post documents
        DependsOn.model.find({}).remove(function (error) {
            if (error) {
                done(error);
            }

            // suppressing console log output
            const backupLog = console.error;
            console.error = () => null;

            let newPost = new DependsOn.model({
                title: 'new post',
                state: 'published',
                publishedDate: undefined,
            });

            newPost.save(function (err) {
                demand(err).be.a.object();

                console.error = backupLog;
                done();
            });
        });

    });

    it('Save will succeed if `state` set to `published` and `publishedDate` is defined', function (done) {

        // remove any Post documents
        DependsOn.model.find({}).remove(function (error) {
            if (error) {
                done(error);
            }

            let newPost = new DependsOn.model({
                title: 'new post',
                state: 'published',
                publishedDate: new Date()
            });
            newPost.save(done);

        });
    });

    after(function (done) {
        // remove any remaining test data
        DependsOn.model.find({}).remove(function (error) {
            done(error);
        });
    });
});
