import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
  ECHOES__EXPANDED,
  ECHOES__MINTED,
} from '../generated/EchoesTestnet/EchoesTestnet';
import { Echo } from '../generated/schema';

export function handleMinted(event: ECHOES__MINTED): void {
  let echo = Echo.load(getUniqueId(event.params.owner, event.params.tokenId));

  if (!echo)
    echo = new Echo(getUniqueId(event.params.owner, event.params.tokenId));

  echo.owner = event.params.owner;
  echo.tokenId = event.params.tokenId;
  echo.signature = event.params.signature;
  echo.createdAtTimestamp = event.block.timestamp;
  echo.createdAtBlock = event.block.number;
  echo.lastExpandedAt = event.block.timestamp;
  echo.expandedCount = BigInt.fromI32(0);
  echo.save();
}

export function handleExpanded(event: ECHOES__EXPANDED): void {
  let echo = Echo.load(getUniqueId(event.params.owner, event.params.tokenId));

  // Just in case, but we can't really get here without a minted event
  if (!echo)
    echo = new Echo(getUniqueId(event.params.owner, event.params.tokenId));

  echo.lastExpandedAt = event.block.timestamp;
  echo.expandedCount = echo.expandedCount.plus(BigInt.fromI32(1));
  echo.save();
}

function getUniqueId(owner: Address, tokenId: BigInt): string {
  return owner.toHex() + '-' + tokenId.toString();
}
