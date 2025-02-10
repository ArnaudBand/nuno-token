// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {NunoToken} from "../src/NunoToken.sol";
import {Script} from "forge-std/Script.sol";

contract DeployNunoToken is Script {


  NunoToken public nuno;
  uint256 TOTALSUPPLY = 100;

  address public deployer;

  function run () public returns(NunoToken){
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    deployer = vm.addr(deployerPrivateKey);
    vm.startBroadcast(deployerPrivateKey);
    nuno = new NunoToken(TOTALSUPPLY);
    vm.stopBroadcast();
    return nuno;
  }
}