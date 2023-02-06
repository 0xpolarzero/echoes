// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library Formats {
    using Strings for uint256;

    function metadataEncode(
        string memory _base,
        string memory _updatable
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(abi.encodePacked(_base, _updatable))
                )
            );
    }

    function metadataBase(
        string[] memory _attributes,
        string[] memory _spectrumColors,
        string memory _sceneryColor,
        string memory _signature,
        string memory _description,
        string memory _externalUrl,
        uint256 _creationTimestamp,
        uint256 _tokenId
    ) internal pure returns (string memory) {
        string memory imageData = generateSvg(
            _attributes,
            _spectrumColors,
            _sceneryColor
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
            " #",
            _tokenId.toString(),
            '",',
            '"background_color":"',
            _sceneryColor,
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
            '{"display_type":"date","trait_type":"Generation","value":"',
            _creationTimestamp.toString(),
            '"}',
            ","
        );

        return string(abi.encodePacked(dataA, dataB, dataC));
    }

    function metadataUpdatable(
        string memory _animationUrl,
        uint256[] memory _attributesIndexes,
        uint256 _expanse,
        uint256 _lastExpansionTimestamp,
        bool _maxExpansionReached
    ) internal pure returns (string memory) {
        // Get the updated animation URL
        string memory animationUrl = string(
            abi.encodePacked(
                _animationUrl,
                "?0=",
                _attributesIndexes[0].toString(),
                "&1=",
                _attributesIndexes[1].toString(),
                "&2=",
                _attributesIndexes[2].toString(),
                "&3=",
                _attributesIndexes[3].toString(),
                "&4=",
                _expanse.toString()
            )
        );

        bytes memory data = abi.encodePacked(
            '{"trait_type":"Expanse","value":"',
            _expanse.toString(),
            '"},',
            '{"display_type":"date","trait_type":"Last Expansion","value":"',
            _lastExpansionTimestamp.toString(),
            '"},',
            '{"trait_type":"Max Expanse","value":"',
            _maxExpansionReached ? "true" : "false",
            '"}',
            "],",
            '"animation_url":"',
            animationUrl,
            '"',
            "}"
        );

        return string(data);
    }

    function generateSvg(
        string[] memory _attributes,
        string[] memory _spectrumColors,
        string memory _sceneryColor
    ) internal pure returns (string memory) {
        string
            memory svg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 500">';

        svg = string(
            abi.encodePacked(
                svg,
                '<rect width="100%" height="100%" fill="#',
                _sceneryColor,
                '"/>'
            )
        );

        for (uint8 i = 0; i < 4; i++) {
            uint256 y = i * 20 + 20;
            svg = string(
                abi.encodePacked(
                    svg,
                    '<text x="50%" y="',
                    y.toString(),
                    '%" dominant-baseline="middle" text-anchor="middle" font-size="25" font-family="monospace" fill="#',
                    _spectrumColors[i % 2],
                    '">',
                    _attributes[i],
                    "</text>"
                )
            );
        }
        svg = string(abi.encodePacked(svg, "</svg>"));

        return (
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(bytes(svg))
                )
            )
        );
    }
}
