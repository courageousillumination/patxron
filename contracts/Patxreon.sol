pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Patxreon {
    struct Subscription {
        /** The account that is subscribing */
        address subscriber;
        /** The size of the subscription, measured in wei */
        uint256 amount;
        /** Interval between payouts (in seconds). */
        uint256 interval;
        /** The last withdraw. */
        uint256 lastWithdraw;
        /** How much funding is remaining in this subscription. */
        uint256 fundingRemaining;
    }

    mapping(address => Subscription[]) subscriptions;

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
        uint256 funding = msg.value;
        require(
            amount > 0 && interval > 0,
            "Amount and interval must be non-zero"
        );
        require(funding >= amount, "Must fund at least one cycle");
        Subscription[] storage subs = subscriptions[subscribeTo];

        // Ensure we don't have an existing subscription
        for (uint256 i = 0; i < subs.length; i++) {
            if (subs[i].subscriber == msg.sender) {
                revert("A subscription already exists");
            }
        }

        // NOTE: Because the lastWithdrawn is set to 0, a creator can immedately
        // withdraw these funds.
        subs.push(Subscription(msg.sender, amount, interval, 0, funding));
    }

    /**
     * @notice Cancels a subscription.
     * @param subscribeTo The creator who's subscription you would like to cancel.
     * @param refundAddress Where the refund should be sent.
     */
    function cancelSubscription(
        address subscribeTo,
        address payable refundAddress
    ) public {
        Subscription[] storage subs = subscriptions[subscribeTo];
        uint256 index;
        // Look for the subscription object in the subscriptions array
        for (index = 0; index < subs.length; index++) {
            if (subs[index].subscriber == msg.sender) {
                break;
            }
        }

        // If we have a valid index we'll remove it and refund
        // the difference.
        if (index < subs.length) {
            Subscription storage sub = subs[index];
            refundAddress.transfer(sub.fundingRemaining);
            if (subs.length > 1) {
                // If we have more than 1 entry we remove by moving
                // the last entry to the empty spot and popping.
                subs[index] = subs[subs.length - 1];
                subs.pop();
            } else {
                // Otherwise we just delete the entire array (now empty).
                delete subscriptions[subscribeTo];
            }
        }
    }

    /**
     * @notice claim all funds due to an account.
     * @param account The account to claim funds for.
     */
    function claimFunds(address payable account) public {
        Subscription[] storage subs = subscriptions[account];
        uint256 currentTime = block.timestamp;
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < subs.length; i++) {
            Subscription storage subscription = subs[i];

            // Check that we have funding (the contract should be holding
            // on to this funding).
            bool hasFunding = subscription.fundingRemaining >=
                subscription.amount;

            // Check that enough time has elapsed since we last made a
            // withdraw.
            bool hasTimeElapsed = subscription.lastWithdraw +
                subscription.interval <
                currentTime;

            // If both are true, we will draw from this subscription. We
            // subtract the funding and set the lastWithdraw time.
            if (hasFunding && hasTimeElapsed) {
                totalAmount += subscription.amount;
                subscription.fundingRemaining -= subscription.amount;
                subscription.lastWithdraw = currentTime;
            }
        }

        // If we've been able to draw from any subscriptions initate the transfer.
        if (totalAmount > 0) {
            account.transfer(totalAmount);
        }
    }
}
