// eslint-disable-next-line no-undef
var MedRecChain = artifacts.require('./MedRecChain.sol');
module.exports = function(deployer) {
  deployer.deploy(MedRecChain);
};