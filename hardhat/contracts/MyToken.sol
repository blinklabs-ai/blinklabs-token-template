// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    address public owner;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public maxSupply;
    mapping(address => uint256) public balance;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _maxSupply) {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        maxSupply = _maxSupply * 10**uint256(decimals);
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return balance[_owner];
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        require(totalSupply + _amount <= maxSupply, "Exceeds max supply");
        totalSupply += _amount;
        balance[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    function transfer(address _to, uint256 _value) external returns (bool) {
        require(balance[msg.sender] >= _value, "Insufficient balance");
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(balance[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Not allowed to transfer");
        _transfer(_from, _to, _value);
        _approve(_from, msg.sender, allowance[_from][msg.sender] - _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        _approve(msg.sender, _spender, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        balance[_from] -= _value;
        balance[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function _approve(address _owner, address _spender, uint256 _value) internal {
        allowance[_owner][_spender] = _value;
        emit Approval(_owner, _spender, _value);
    }
}