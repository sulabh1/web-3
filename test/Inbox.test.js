const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());
//console.log(web3);

let accounts;
let inbox;
beforeEach(async () => {
  //get list of account
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["sulabh"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("should deploy a contract", () => {
    //console.log(accounts, "accounts");
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.deepEqual(message, "sulabh");
  });
  it("can change the message", async () => {
    await inbox.methods.setMessage("adhikari").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.deepEqual(message, "adhikari");
  });
});
