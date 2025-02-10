// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract NunoToken {

  // Name and Symbol
  string public name = "NUNOTOKEN";
  string public symbol = "NUNO";

  // Integers for my token
  uint256 public decimal = 18;
  uint256 public totalSupply;

  // Mapping of balanceOf and Allowance
  mapping (address => uint256) public balanceOf;
  mapping (address => mapping(address => uint256)) public allowance;

  constructor (uint256 _totalSupply) {
    totalSupply = _totalSupply*10**decimal;
    balanceOf[msg.sender] = totalSupply;
  }

  // Transfer
  function transfer(address _to, uint256 _value) public returns(bool success) {
    require(balanceOf[msg.sender] >= _value, "Not enough balance");
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    return true;
  }


  // Approve
  function approve(address _spender, uint256 _value) public returns(bool success) {
    allowance[msg.sender][_spender] = _value;
    return true;
  }


  // transferFrom
  function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
    require(balanceOf[_from] >= _value, "Not Enough balance");
    require(allowance[_from][msg.sender] >= _value, "Not Enough allowance");

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;


    allowance[_from][msg.sender] -= _value;
    return true;
  }



  // burn





}