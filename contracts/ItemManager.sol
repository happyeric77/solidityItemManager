// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Item} from  "./Item.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ItemManager is Ownable {
    
    enum SupplyChainState{Created, Paid, Delivered}
    
    event supplyChainStep(uint256 _itemIndex, uint256 _step, address _itemAddress);
    
    struct S_Item {
        string _identifier;
        uint256 _itemPrice;
        Item _item;
        ItemManager.SupplyChainState _state;
    }
    
    mapping( uint256 => S_Item) public items;
    uint itemIndex;
    
    function crateItem(string memory _identifier, uint _itemPrice) public onlyOwner{
        items[itemIndex]._item = new Item(this, _itemPrice, itemIndex);
        items[itemIndex]._identifier = _identifier;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        emit supplyChainStep(itemIndex, uint(items[itemIndex]._state), address(items[itemIndex]._item));
        itemIndex ++;
    }
    
    function triggerPayment(uint256 _itemIndex) public payable {
        require(items[_itemIndex]._itemPrice == msg.value, "Only allowing full paid, check you payment amount.");
        require(items[_itemIndex]._state == SupplyChainState.Created);
        items[_itemIndex]._state = SupplyChainState.Paid;
        emit supplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
        
        
    }
    
    function triggerDelivery(uint256 _itemIndex) public onlyOwner {
        require(items[_itemIndex]._state == SupplyChainState.Paid, "Item not paid yet!");
        items[_itemIndex]._state = SupplyChainState.Delivered;
        emit supplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
        
    }    
}