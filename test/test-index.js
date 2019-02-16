let index = require('../index');
let encode = require('../encode');
let decode = require('../decode');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var chaiFiles = require('chai-files');

chai.use(chaiFiles);
chai.use(chaiHttp);

describe('Test URL API', () => {
    it('index server running', (done) => {
        chai.request(index)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
    it('function encode', (done) => {
        const fEncode = encode.encode('omama');
        should.equal(fEncode, "O1*A3*A");
        done();
    })
    it('function decode', (done) => {
        const fDecode = decode.decode('O1*A3*A');
        should.equal(fDecode, 'omama');
        done();
    })
    describe('POST encode', () => {
        let input = {
            "input": "omama"
        };
        it('status', (done) => {
            chai.request(index)
                .post('/encode')
                .send(input)
                .end((err, res) => {
                    res.body.should.have.status(200);
                    done();
                })
        })
        it('type data', (done) => {
            chai.request(index)
                .post('/encode')
                .send(input)
                .end((err, res) => {
                    res.body.should.be.an('object');
                    done();
                })
        })
        it('output', (done) => {
            chai.request(index)
                .post('/encode')
                .send(input)
                .end((err, res) => {
                    res.body.output.should.equal('O1*A3*A');
                    done();
                })
        })
    })
    describe('POST decode', () => {
        let input = {
            "input": "O1*A3*A"
        };
        it('status', (done) => {
            chai.request(index)
                .post('/decode')
                .send(input)
                .end((err, res) => {
                    res.body.should.have.status(200);
                    done();
                })
        })
        it('type data', (done) => {
            chai.request(index)
                .post('/decode')
                .send(input)
                .end((err, res) => {
                    res.body.should.be.an('object');
                    done();
                })
        })
        it('output', (done) => {
            chai.request(index)
                .post('/decode')
                .send(input)
                .end((err, res) => {
                    res.body.output.should.equal('omama');
                    done();
                })
        })
    })
})