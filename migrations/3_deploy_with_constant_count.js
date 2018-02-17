var Voter = artifacts.require("./Voter.sol");

module.exports = function(deployer) {
  deployer.deploy(Voter);
};
