pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Patxreon {
    struct Subscription {
        address subscribeTo;
        uint256 amount;
        uint256 interval;
    }

    Subscription[] subscriptions;

    /**
     * @notice Creates a new subscripion.
     * @param subscribeTo The account being subscribed to.
     * @param amount The amount to be payed out during each subscription period.
     * @param interval The length of a subscription period.
     */
    function createSubscription(
        address subscribeTo,
        uint256 amount,
        uint256 interval
    ) public payable {
        Subscription memory subscription = Subscription(
            subscribeTo,
            amount,
            interval
        );
        subscriptions.push(subscription);
        // TODO: Verify that the funds will cover our subscription costs
    }

    /**
     * @notice Cancel an outstanding subscription
     * @dev TODO: Actually implement this.
     */
    function cancelSubscription() public {}

    /**
     * @notice claim all funds due to an account.
     * @param account The account to claim funds for.
     */
    function claimFunds(address payable account) public {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].subscribeTo == account) {
                totalAmount += subscriptions[i].amount;
            }
        }
        if (totalAmount > 0) {
            account.transfer(totalAmount);
        }
    }
}
