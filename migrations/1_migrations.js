// eslint-disable-next-line no-undef
const MedRecChain = artifacts.require('./MedRecChain.sol');
module.exports = function(deployer) {
  deployer.deploy(MedRecChain);
};