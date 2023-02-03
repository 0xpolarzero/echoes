import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

function formatMetadata(
    string memory _signature,
    string memory _spectrumAttribute,
    string memory _sceneryAttribute,
    string memory _traceAttribute,
    string memory _atmosphereAttribute,
    bytes32 _externalUrl,
    bytes32 _description,
    bytes3 _backgroundColor,
    uint256 _creationTimestamp,
    uint256 _tokenId
) pure returns (string memory) {
    // All attributes except expansion
    string memory attributes = '"attributes":[';
    attributes +=
        '{"trait_type":"Spectrum","value":"' +
        _spectrumAttribute +
        '"},';
    attributes +=
        '{"trait_type":"Scenery","value":"' +
        _sceneryAttribute +
        '"},';
    attributes += '{"trait_type":"Trace","value":"' + _traceAttribute + '"},';
    attributes +=
        '{"trait_type":"Atmosphere","value":"' +
        _atmosphereAttribute +
        '"},';
    attributes +=
        '{"trait_type":"Generation","value":"' +
        _creationTimestamp.toString() +
        '"}';
    attributes += "]";

    string memory imageData = generateSVG(
        _spectrumAttribute,
        _sceneryAttribute,
        _traceAttribute,
        _atmosphereAttribute,
        bytes3ColorToString(_backgroundColor)
    );

    string memory metadata = '{"description":"' +
        _description.toString() +
        '",';
    metadata += '"image_data":"' + imageData + '",';
    metadata +=
        '"external_url":"' +
        _externalUrl.toString() +
        _tokenID.toString() +
        '",';
    metadata += '"name":"' + _signature + '",';
    metadata +=
        '"background_color":"' +
        bytes3ColorToString(_backgroundColor) +
        '",';
    metadata += attributes + "}";

    bytes memory data = abi.encodePacked(metadata);

    return
        string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(data)
            )
        );
}

function formatMetadataUpgradable(
    string memory _animationUrl,
    uint256 _spectrumIndex,
    uint256 _sceneryIndex,
    uint256 _traceIndex,
    uint256 _atmosphereIndex,
    uint256 _expansion,
    uint256 _lastExpansionTimestamp,
    bool _maxExpansionReached
) pure returns (string memory) {
    // Add expansion to attributes
    string memory attributes = '"attributes":[';
    attributes +=
        '{"trait_type":"Expansion","value":"' +
        _expansion.toString() +
        '"},';
    attributes +=
        '{"trait_type":"Last Expanse","value":"' +
        _lastExpansionTimestamp.toString() +
        '"},';
    attributes +=
        '{"trait_type":"Maxed","value":"' +
        _maxExpansionReached.toString() +
        '"}';
    attributes += "]";

    // Get the updated animation URL
    string memory animationUrl = string(
        abi.encodePacked(
            _animationUrl,
            "&0=",
            _spectrumIndex.toString(),
            "&1=",
            _sceneryIndex.toString(),
            "&2=",
            _traceIndex.toString(),
            "&3=",
            _atmosphereIndex.toString(),
            "&4=",
            _expansion.toString()
        )
    );

    // Add animation URL to metadata
    string memory metadata = '{"animation_url":"' + animationUrl + '",';
    metadata += attributes + "}";

    bytes memory data = abi.encodePacked(metadata);

    return
        string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(data)
            )
        );
}

function generateSvg(
    string memory spectrumAttribute,
    string memory sceneryAttribute,
    string memory traceAttribute,
    string memory atmosphereAttribute,
    string memory backgroundColor
) pure returns (string memory) {
    string
        memory svg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 500">';
    svg = string(
        abi.encodePacked(
            svg,
            '<rect width="100%" height="100%" fill="#',
            backgroundColor,
            '"/>'
        )
    );
    svg = string(
        abi.encodePacked(
            svg,
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
            spectrumAttribute,
            "</text>"
        )
    );
    svg = string(
        abi.encodePacked(
            svg,
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
            sceneryAttribute,
            "</text>"
        )
    );
    svg = string(
        abi.encodePacked(
            svg,
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
            traceAttribute,
            "</text>"
        )
    );
    svg = string(
        abi.encodePacked(
            svg,
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
            atmosphereAttribute,
            "</text>"
        )
    );
    svg = string(abi.encodePacked(svg, "</svg>"));

    return svg;
}

// function bytes32ToString(bytes32 x) internal pure returns (string memory) {
//     bytes memory bytesString = new bytes(32);
//     for (uint i = 0; i < 32; i++) {
//         bytes1 char = bytes1(bytes32(uint(x) * 2 ** (8 * i)));
//         if (char != 0) {
//             bytesString[i] = char;
//         } else {
//             break;
//         }
//     }
//     return string(bytesString);
// }

function bytes3ColorToString(
    bytes3 color
) internal pure returns (string memory) {
    return string(abi.encodePacked(color).slice(2, 6));
}
