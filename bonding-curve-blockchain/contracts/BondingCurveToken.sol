// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/// @title BondingCurveToken (Linear Bonding Curve ERC20)
/// @author ...
/// @notice An ERC20 token whose price follows a linear bonding curve.
/// @dev Price formula:
///      price = basePrice + slope * circulatingSupply / 1e18
///      - basePrice: starting price of token (in wei per token)
///      - slope: rate at which token price increases per additional token (in wei)
///      - circulatingSupply: totalSupply() at current time
contract BondingCurveToken is ERC20, ReentrancyGuard {
    /// @notice Initial base price of token (wei per token)
    uint256 public immutable basePrice;

    /// @notice Rate of price increase per token (wei per token per token)
    uint256 public immutable slope;

    /// @notice Maximum possible supply of tokens (cap)
    uint256 public immutable maxSupply;

    /// @dev Fixed-point math scaling factor (1e18)
    uint256 private constant WAD = 1e18;

    /// @notice Event emitted on token purchase
    event Bought(address indexed buyer, uint256 ethIn, uint256 tokensOut, uint256 newPrice);

    /// @notice Event emitted on token sale
    event Sold(address indexed seller, uint256 tokensIn, uint256 ethOut, uint256 newPrice);

    /// @param name_ ERC20 token name
    /// @param symbol_ ERC20 token symbol
    /// @param basePrice_ Starting price per token in wei
    /// @param slope_ Price growth rate per token
    /// @param maxSupply_ Maximum supply cap
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 basePrice_,
        uint256 slope_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) {
        require(basePrice_ > 0, "Base price cannot be zero");
        require(maxSupply_ > 0, "Max supply cannot be zero");
        basePrice = basePrice_;
        slope = slope_;
        maxSupply = maxSupply_;
    }

    // ================== VIEW FUNCTIONS ==================

    /// @notice Returns circulating supply (same as totalSupply)
    function circulatingSupply() public view returns (uint256) {
        return totalSupply();
    }

    /// @notice Returns current price of one token
    /// @dev Formula: price = basePrice + slope * circulatingSupply / 1e18
    function currentPrice() public view returns (uint256) {
        uint256 supply = totalSupply();
        uint256 linear = slope == 0 ? 0 : Math.mulDiv(slope, supply, WAD);
        return basePrice + linear;
    }

    /// @notice Estimate how many tokens can be bought with given ETH
    /// @param ethAmount ETH amount in wei
    /// @return deltaTokens Estimated tokens to receive
    function previewBuy(uint256 ethAmount) external view returns (uint256 deltaTokens) {
        require(ethAmount > 0, "ETH amount is zero");
        return _tokensForEth(totalSupply(), ethAmount);
    }

    /// @notice Estimate how much ETH can be received for given tokens
    /// @param tokenAmount Token amount (18 decimals)
    /// @return ethOut Estimated ETH amount in wei
    function previewSell(uint256 tokenAmount) external view returns (uint256 ethOut) {
        require(tokenAmount > 0, "Token amount is zero");
        require(tokenAmount <= totalSupply(), "Exceeds total supply");
        return _ethForTokens(totalSupply(), tokenAmount);
    }

    // ================== ACTION FUNCTIONS ==================

    /// @notice Buy tokens by sending ETH
    /// @param minTokensOut Minimum tokens expected (slippage protection)
    /// @return tokensOut Actual tokens received
    function buy(uint256 minTokensOut) external payable nonReentrant returns (uint256 tokensOut) {
        require(msg.value > 0, "No ETH sent");
        tokensOut = _tokensForEth(totalSupply(), msg.value);
        require(tokensOut >= minTokensOut, "Slippage exceeded");
        require(totalSupply() + tokensOut <= maxSupply, "Exceeds max supply");

        _mint(msg.sender, tokensOut);
        emit Bought(msg.sender, msg.value, tokensOut, currentPrice());
    }

    /// @notice Sell tokens to receive ETH back
    /// @param tokenAmount Token amount to sell (18 decimals)
    /// @param minEthOut Minimum ETH expected (slippage protection)
    /// @return ethOut Actual ETH received
    function sell(uint256 tokenAmount, uint256 minEthOut) external nonReentrant returns (uint256 ethOut) {
        require(tokenAmount > 0, "Token amount is zero");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");

        uint256 supply = totalSupply();
        require(tokenAmount <= supply, "Exceeds supply");

        ethOut = _ethForTokens(supply, tokenAmount);
        require(address(this).balance >= ethOut, "Contract ETH insufficient");
        require(ethOut >= minEthOut, "Slippage exceeded");

        _burn(msg.sender, tokenAmount);

        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "ETH transfer failed");

        emit Sold(msg.sender, tokenAmount, ethOut, currentPrice());
    }

    // ================== INTERNAL MATH HELPERS ==================

    /// @dev Solve quadratic formula to calculate how many tokens can be bought for given ETH
    /// Formula:
    ///   tokensOut = ( sqrt( (basePrice + slope * currentSupply)^2 + 2 * slope * ethIn ) 
    ///                 - (basePrice + slope * currentSupply) ) / slope
    /// @param currentSupply Current total token supply
    /// @param ethIn Amount of ETH provided
    /// @return deltaTokens Tokens to mint
    function _tokensForEth(uint256 currentSupply, uint256 ethIn) internal view returns (uint256 deltaTokens) {
        if (slope == 0) {
            return Math.mulDiv(ethIn, WAD, basePrice);
        }

        uint256 b = basePrice * WAD + slope * currentSupply;
        uint256 discriminant = Math.mulDiv(b, b, 1) + (2 * slope * ethIn * WAD * WAD);
        uint256 sqrtD = Math.sqrt(discriminant);

        require(sqrtD >= b, "Math error");

        deltaTokens = (sqrtD - b) / slope;
    }

    /// @dev Cost to buy deltaTokens from currentSupply
    function _costForTokens(uint256 currentSupply, uint256 deltaTokens) internal view returns (uint256) {
        uint256 term1 = Math.mulDiv(basePrice, deltaTokens, WAD);
        uint256 term2a = slope == 0 ? 0 : Math.mulDiv(slope, currentSupply * deltaTokens, WAD * WAD);
        uint256 term2b = slope == 0 ? 0 : Math.mulDiv(slope, (deltaTokens * deltaTokens) / 2, WAD * WAD);
        return term1 + term2a + term2b;
    }

    /// @dev Refund ETH for selling deltaTokens from currentSupply
    /// Formula:
    ///   refund = basePrice * deltaTokens / 1e18 
    ///            + slope * (currentSupply * deltaTokens - deltaTokens^2 / 2) / 1e36
    function _ethForTokens(uint256 currentSupply, uint256 deltaTokens) internal view returns (uint256) {
        uint256 term1 = Math.mulDiv(basePrice, deltaTokens, WAD);
        uint256 term2a = slope == 0 ? 0 : Math.mulDiv(slope, currentSupply * deltaTokens, WAD * WAD);
        uint256 term2b = slope == 0 ? 0 : Math.mulDiv(slope, (deltaTokens * deltaTokens) / 2, WAD * WAD);
        require(term2a >= term2b, "Curve underflow");
        return term1 + term2a - term2b;
    }

    /// @notice Allow contract to receive ETH directly
    receive() external payable {}
}
