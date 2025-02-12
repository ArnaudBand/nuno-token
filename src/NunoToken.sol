// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract NunoToken {

  // Error
  error Not_enough_balaance();
  error Invalid_Input();

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
    totalSupply = _totalSupply * 10 ** decimal;
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
  function burn(uint256 _value) private returns(bool successs) {
    if (balanceOf[msg.sender] < _value) {
      revert Not_enough_balaance();
    }

    balanceOf[msg.sender] -= _value;
    totalSupply -= _value;
    return true;
  }

  // Airdrop
  function airdrop(address[] memory _recipients, uint256[] memory _values) external returns (bool success) {
    if (_recipients.length != _values.length) {
      revert Invalid_Input();
    }

    for (uint256 i = 0; i < _recipients.length; i++) {
      addTokens(_recipients[i], 10);
    }
    return true;
  }

  function addTokens(address _to, uint256 _value) internal returns(bool success) {
    if (balanceOf[msg.sender] < _value) {
      revert Not_enough_balaance();
    }
    balanceOf[_to] += _value;
    return true;
  }

  function getName() external view returns(string memory) {
    return name;
  }

  function getSymbol() external view returns(string memory) {
    return symbol;
  }

  function getTotalSupply() external view returns (uint256) {
    return totalSupply;
  }

  function getBalance(address _owner) external view returns(uint256) {
    return balanceOf[_owner];
  }
}