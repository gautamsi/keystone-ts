import { keystone } from '../../../../src/index';
import * as demand from 'must';
import * as utils from 'keystone-utils';
import mongoose from '../../../helpers/getMongooseConnection';

keystone.mongoose = mongoose;

keystone.import('../models');

let Post = keystone.list('Post');

describe('Test autokey', function () {

    it('generate an autokey value from another field', function (done) {
        let post = new Post.model({
            title: 'Foo Bar',
            content: 'Foo bar bar baz bar bar'
        });

        post.save(function (err) {
            if (err) {
                done(err);
            }

            Post.model.findOne({ title: 'Foo Bar' }).exec(function (err, post) {
                if (err) {
                    done(err);
                }

                demand(post.slug).be.equal(utils.slug('Foo Bar'));
                done();
            });
        });

    });

    it('not try to generate an autokey value if from field is not selected', function (done) {
        let post = new Post.model({
            title: 'Foo Bar 2',
            content: 'Foo bar bar baz bar bar'
        });

        post.save(function (err) {
            if (err) {
                done(err);
            }

            Post.model.findOne({ title: 'Foo Bar 2' }).select('content').exec(function (err, post) {
                if (err) {
                    done(err);
                }

                demand(post.title).be.undefined();
                post.content = 'narf narf narf';

                post.save(function (err) {
                    if (err) {
                        done(err);
                    }

                    Post.model.findOne({ slug: utils.slug('Foo Bar 2') }).exec(function (err, post) {
                        if (err) {
                            done(err);
                        }

                        demand(post).be.a.object();
                        demand(post.slug).be.equal(utils.slug('Foo Bar 2'));
                        done();
                    });
                });
            });
        });

    });

    after(function (done) {
        // remove any remaining test data
        Post.model.find({}).remove(function (error) {
            done(error);
        });
    });
});
