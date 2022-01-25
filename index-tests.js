const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js");

chai.use(chaiHttp);

describe("API REST", () => {
    it("Probando GET", (done) => {
        chai.request(server)
            .get("/deportes")
            .end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(200);
            const data = JSON.parse(res.text);
            chai.expect(data).to.have.property("deportes");
            chai.expect(data.deportes).to.be.an("array");
            done()
        });
    });
});