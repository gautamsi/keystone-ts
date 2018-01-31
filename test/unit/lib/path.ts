import * as demand from 'must';
import { Path } from '../../../src/lib/path';

describe('Path', function () {
    describe('new', function () {
        it('must be an instance of Path', function () {
            new Path('').must.be.an.instanceof(Path);
        });
    });

    describe('.prototype.addTo', function () {
        it('must return an hierarchical object from path', function () {
            let path = new Path('foo.example.dir.file');
            let obj = path.addTo({}, 42);
            obj.must.eql({ foo: { example: { dir: { file: 42 } } } });
        });

        it('must merge given an existing hierarchy', function () {
            let path = new Path('foo.example.dir.file');
            let obj = path.addTo({ foo: { example: { link: 69 } } }, 42);
            obj.must.eql({ foo: { example: { link: 69, dir: { file: 42 } } } });
        });
    });

    describe('.prototype.get', function () {
        it('must return a simple value', function () {
            let path = new Path('foo');
            demand(path.get({ foo: 42 })).equal(42);
        });
        it('must return a nested value', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({ foo: { example: { dir: 42 } } })).equal(42);
        });
        it('must return undefined when a nested value isn\'t present', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({})).be.undefined();
        });
        it('must return a flat nested value', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({ 'foo.example.dir': 42 })).equal(42);
        });
        it('must return an appended sub path', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({ foo: { example: { dir_ext: 42 } } }, '_ext')).equal(42);
        });
        it('must return a flat appended sub path', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({ 'foo.example.dir_ext': 42 }, '_ext')).equal(42);
        });
        it('must return a nested sub path', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({ foo: { example: { dir: { ext: 42 } } } }, '.ext')).equal(42);
        });
        it('must return a flat nested sub path', function () {
            let path = new Path('foo.example.dir');
            demand(path.get({ 'foo.example.dir.ext': 42 }, '.ext')).equal(42);
        });
    });
});
