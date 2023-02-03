import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

function formatMetadata(
    string memory signature,
    string memory spectrumAttribute,
    string memory sceneryAttribute,
    string memory traceAttribute,
    string memory atmosphereAttribute,
    string memory expansionAttribute,
    string memory externalUrl,
    bytes32 animationUrl,
    bytes32 description,
    bytes3 backgroundColor,
    uint256 tokenId
) pure returns (string memory) {
    string memory attributes = '"attributes":[';
    attributes +=
        '{"trait_type":"Spectrum","value":"' +
        spectrumAttribute +
        '"},';
    attributes +=
        '{"trait_type":"Scenery","value":"' +
        sceneryAttribute +
        '"},';
    attributes += '{"trait_type":"Trace","value":"' + traceAttribute + '"},';
    attributes +=
        '{"trait_type":"Atmosphere","value":"' +
        atmosphereAttribute +
        '"},';
    attributes +=
        '{"trait_type":"Expansion","value":"' +
        expansionAttribute +
        '"}';
    attributes += "]";

    string memory color = bytes3ColorToString(backgroundColor);

    string memory imageData = generateSVG(
        spectrumAttribute,
        sceneryAttribute,
        traceAttribute,
        atmosphereAttribute,
        expansionAttribute,
        color
    );

    string memory metadata = '{"description":"' + description.toString() + '",';
    metadata += '"external_url":"' + externalUrl + '",';
    metadata += '"image_data":"' + imageData + '",';
    metadata += '"name":"' + signature + '",';
    metadata += '"animation_url":"' + animationUrl.toString() + '",';
    metadata += '"background_color":"' + bytes3ColorToString(backgroundColor) + '",';
    metadata += attributes + "}";

    bytes memory data = abi.encodePacked(metadata);

    return string(
        abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(data)
        )
    )
}

function generateSvg(
    string memory spectrumAttribute,
    string memory sceneryAttribute,
    string memory traceAttribute,
    string memory atmosphereAttribute,
    string memory expansionAttribute,
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
    svg = string(
        abi.encodePacked(
            svg,
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="30" fill="#fff">',
            expansionAttribute,
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

function bytes3ColorToString(bytes3 color) internal pure returns (string memory) {
    return string(abi.encodePacked(color).slice(2, 6));
}
