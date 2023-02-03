// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library Formats {
    using Strings for uint256;

    function formatMetadata(
        string[] memory _attributes,
        string memory _signature,
        string memory _description,
        string memory _externalUrl,
        bytes3 _backgroundColor,
        uint256 _creationTimestamp,
        uint256 _tokenId
    ) internal pure returns (string memory) {
        string memory imageData = generateSvg(
            _attributes,
            bytes3ColorToString(_backgroundColor)
        );

        // Separate the data into two parts to avoid "Stack too deep"
        bytes memory dataA = abi.encodePacked(
            '{"description":"',
            _description,
            '",',
            '"image_data":"',
            imageData,
            '",',
            '"external_url":"',
            _externalUrl,
            _tokenId.toString(),
            '",',
            '"name":"',
            _signature,
            '",',
            '"background_color":"',
            bytes3ColorToString(_backgroundColor),
            '",'
        );

        bytes memory dataB = abi.encodePacked(
            '"attributes":[',
            '{"trait_type":"Spectrum","value":"',
            _attributes[0],
            '"},',
            '{"trait_type":"Scenery","value":"',
            _attributes[1],
            '"},',
            '{"trait_type":"Trace","value":"',
            _attributes[2],
            '"},',
            '{"trait_type":"Atmosphere","value":"',
            _attributes[3],
            '"},'
        );

        bytes memory dataC = abi.encodePacked(
            '{"trait_type":"Generation","value":"',
            _creationTimestamp.toString(),
            '"}',
            "]",
            "}"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(abi.encodePacked(dataA, dataB, dataC))
                )
            );
    }

    function formatMetadataUpdatable(
        string memory _animationUrl,
        string[] memory _attributes,
        uint256 _expansion,
        uint256 _lastExpansionTimestamp,
        bool _maxExpansionReached
    ) internal pure returns (string memory) {
        // Get the updated animation URL
        string memory animationUrl = string(
            abi.encodePacked(
                _animationUrl,
                "&0=",
                _attributes[0],
                "&1=",
                _attributes[1],
                "&2=",
                _attributes[2],
                "&3=",
                _attributes[3],
                "&4=",
                _expansion.toString()
            )
        );

        bytes memory data = abi.encodePacked(
            '{"animation_url":"',
            animationUrl,
            '",',
            '"attributes":[',
            '{"trait_type":"Expansion","value":"',
            _expansion.toString(),
            '"},',
            '{"trait_type":"Last Expanse","value":"',
            _lastExpansionTimestamp.toString(),
            '"},',
            '{"trait_type":"Maxed","value":"',
            _maxExpansionReached,
            '"}',
            "]",
            "}"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(data)
                )
            );
    }

    function generateSvg(
        string[] memory _attributes,
        string memory _backgroundColor
    ) internal pure returns (string memory) {
        string
            memory svg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 500">';
        svg = string(
            abi.encodePacked(
                svg,
                '<rect width="100%" height="100%" fill="#',
                _backgroundColor,
                '"/>'
            )
        );
        svg = string(
            abi.encodePacked(
                svg,
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
                _attributes[0],
                "</text>"
            )
        );
        svg = string(
            abi.encodePacked(
                svg,
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
                _attributes[1],
                "</text>"
            )
        );
        svg = string(
            abi.encodePacked(
                svg,
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
                _attributes[2],
                "</text>"
            )
        );
        svg = string(
            abi.encodePacked(
                svg,
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
                _attributes[3],
                "</text>"
            )
        );
        svg = string(abi.encodePacked(svg, "</svg>"));

        return svg;
    }

    function bytes32ToString(
        bytes32 _bytes
    ) internal pure returns (string memory) {
        bytes memory bytesString = new bytes(32);
        for (uint i = 0; i < 32; i++) {
            bytes1 char = bytes1(bytes32(uint(_bytes) * 2 ** (8 * i)));
            if (char != 0) {
                bytesString[i] = char;
            } else {
                break;
            }
        }
        return string(bytesString);
    }

    function bytes3ColorToString(
        bytes3 color
    ) internal pure returns (string memory) {
        string memory sliced = getSlice(2, 3, string(abi.encodePacked(color)));

        return sliced;
    }

    function getSlice(
        uint256 begin,
        uint256 end,
        string memory text
    ) public pure returns (string memory) {
        bytes memory a = new bytes(end - begin + 1);
        for (uint i = 0; i <= end - begin; i++) {
            a[i] = bytes(text)[i + begin - 1];
        }
        return string(a);
    }
}
