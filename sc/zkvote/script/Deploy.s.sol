// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {SystemEngine} from "../src/SystemEngine.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        address hub = vm.envAddress("IDENTITY_VERIFICATION_HUB");
        uint256 mockScope = 1;

        console.log("Deploying SystemEngine...");
        console.log("Hub:", hub);
        console.log("MockScope:", mockScope);

        vm.startBroadcast(deployerPrivateKey);

        SystemEngine systemEngine = new SystemEngine(hub, mockScope);

        vm.stopBroadcast();

        console.log("Deployed at:", address(systemEngine));
    }
}
