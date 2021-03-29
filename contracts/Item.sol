// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ItemManager } from "./ItemManager.sol";

contract Item {
    
    ItemManager parentContract;
    uint256 public itemPrice;
    uint256 public pricePaid;
    uint256 public itemIndex;
    constructor(ItemManager _parentContract, uint256 _itemPrice, uint256 _itemIndex) {
        parentContract = _parentContract;
        itemPrice = _itemPrice;
        itemIndex = _itemIndex;
    }
    
    receive() external payable {
        require(pricePaid == 0, "The item has already been paid.");
        require(itemPrice == msg.value, "You need to pay for the item in exact price.");
        pricePaid += msg.value;
        (bool ok, ) = address(parentContract).call{value:msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", itemIndex));
        require(ok, "Fail to execute payment");
    }
}