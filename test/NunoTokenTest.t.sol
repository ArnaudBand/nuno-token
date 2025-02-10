// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;


import {Test} from "forge-std/Test.sol";
import {DeployNunoToken} from "../script/DeployNunoToken.s.sol";
import {NunoToken} from "../src/NunoToken.sol"; 


contract NunoTokenTest is Test {
  DeployNunoToken public deployer;
  NunoToken public nuno;

  address bob = makeAddr("bob");
  address zaza = makeAddr("zaza");

  uint256 STARTINGBALANCE = 100 ether;

  string public called;

  function setUp() public {
    deployer = new DeployNunoToken();
    nuno = deployer.run();

    address depl = deployer.deployer();
    vm.startPrank(depl);
    nuno.transfer(bob, STARTINGBALANCE);
    vm.stopPrank();
  }

  function testInitialBalance() public view {
    assertEq(nuno.balanceOf(bob), STARTINGBALANCE);
  }

  function testTransfer() public {
    // if 10 NUNO  --> zaza
    vm.startPrank(bob);
    bool success = nuno.transfer(zaza, 10);
    vm.stopPrank();

    assertTrue(success);
    assertEq(nuno.balanceOf(bob), STARTINGBALANCE - 10);
    assertEq(nuno.balanceOf(zaza), 10);
  }

  function testTotalSupply() public view {
    uint256 bal = nuno.totalSupply();
    assertEq(bal, STARTINGBALANCE);
  }

  function testName() public {
    called = nuno.name();
    assertEq(called, "NUNOTOKEN");
  }
}