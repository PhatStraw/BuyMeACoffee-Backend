const hre = require("hardhat");

// Returns the Ether balance of a given address.

async function ContractBalance(address: string) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address)
    return await hre.ethers.formatEther(balanceBigInt)
}

async function ListBalances(addresses: string[]) {
    let idx = 0;
  for (const address of addresses) {
    console.log(address)
    console.log(`Address ${idx} balance: `, await ContractBalance(address));
    idx ++;
  }
}

type Memo = {
    name: string,
    timestamp: string,
    from: string,
    message: string
}
// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos: Memo[]) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
    }
}
type account = {
    address: string
}

async function main() {
    //get accounts 
    const [owner, tipper, tipper2, tipper3]: account[] = await hre.ethers.getSigners();

    // We get the contract to deploy.
    const BuyMeACoffee = await hre.ethers.deployContract("BuyMeACoffee");
    const buyMeACoffee =  await BuyMeACoffee.waitForDeployment();

    console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);

    // Check balances before the coffee purchase.
    const addresses: string[] = [owner.address, tipper.address, buyMeACoffee.target];
    console.log("== start ==");
    await ListBalances(addresses);

    // Buy the owner a few coffees.
    const tip = { value: await hre.ethers.parseEther("10") };
    await buyMeACoffee.connect(tipper).buyCoffee("Carolina", "You're the best!", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);

    // Check balances after the coffee purchase.
    console.log("== bought coffee ==");
    await ListBalances(addresses);

    // Withdraw.
    await buyMeACoffee.connect(owner).payout();

    // Check balances after withdrawal.
    console.log("== withdrawTips ==");
    await ListBalances(addresses);

    // Check out the memos.
    console.log("== memos ==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });