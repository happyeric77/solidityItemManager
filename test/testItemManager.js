const ItemManager = artifacts.require("./contracts/ItemManager.sol")

contract ("ItemManagerTest", accounts=>{
    it("Create item test passed", async ()=>{
        const itemManagerInstance = await ItemManager.deployed()
        const itemName = "testItem"
        const itemPrice = 500
        
        const result = await itemManagerInstance.crateItem(itemName, itemPrice, {from: accounts[0]});
        assert.equal(result.logs[0].args._itemIndex, 0, "It is not first Item")

        const item = await itemManagerInstance.items(0)
        // console.log(item)
        assert.equal(item._identifier, "testItem", "The wrong item identifer")
    })
})