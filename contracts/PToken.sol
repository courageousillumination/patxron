import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("PToken", "PTK") {
        _mint(msg.sender, initialSupply);
    }
}